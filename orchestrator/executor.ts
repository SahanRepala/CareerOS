/**
 * orchestrator/executor.ts
 *
 * The only place that actually calls `agent.run(...)`. Workflows describe
 * *what* graph to run (see /workflows); this file is the *how*: dependency
 * ordering, parallelism within a level, per-node timeout, retry, and
 * collecting a WorkflowExecutionResult that report-builders/ can consume.
 *
 * No AI/provider logic lives here — every agent it calls is currently a
 * createPlaceholderAgent() and returns instantly with status 'not_implemented'.
 */
import { randomUUID } from 'crypto';
import type { AgentId } from '../types/agent-id';
import type { AgentExecutionContext, AgentResult } from '../contracts/agent.contract';
import { getAgent } from '../agents/registry';
import { buildExecutionLevels } from './graph';
import { withRetry, withTimeout, TimeoutError } from './retry';
import type {
  WorkflowGraph,
  WorkflowExecutionResult,
  WorkflowNodeExecutionRecord,
  WorkflowNode,
} from './types';
import { logExecutionEvent } from '../lib/logging/execution-logger';

export interface RunWorkflowOptions {
  userId: string;
  /** Per-agent inputs, keyed by agentId. The caller (a workflow definition's
   * `buildInputs`) is responsible for wiring upstream outputs into downstream
   * inputs — the executor treats inputs as opaque. */
  inputs: Record<AgentId, unknown>;
  trace?: Record<string, unknown>;
}

async function runNode(
  node: WorkflowNode,
  input: unknown,
  context: AgentExecutionContext
): Promise<AgentResult<unknown>> {
  const agent = getAgent(node.agentId);

  const { value } = await withRetry(
    () => withTimeout(agent.run(input, context), node.timeoutMs),
    node.retryPolicy
  );
  return value;
}

export async function runWorkflow(
  graph: WorkflowGraph,
  options: RunWorkflowOptions
): Promise<WorkflowExecutionResult> {
  const workflowExecutionId = randomUUID();
  const startedAt = new Date().toISOString();
  const levels = buildExecutionLevels(graph);
  const nodeResults: Record<string, WorkflowNodeExecutionRecord> = {};
  let hasFailure = false;
  let hasOptionalFailure = false;

  logExecutionEvent({
    type: 'workflow_started',
    workflowId: graph.id,
    workflowExecutionId,
    userId: options.userId,
  });

  for (const level of levels) {
    await Promise.all(
      level.map(async (node) => {
        const recordStart = new Date().toISOString();
        const context: AgentExecutionContext = {
          executionId: randomUUID(),
          workflowExecutionId,
          userId: options.userId,
          startedAt: recordStart,
          trace: options.trace,
        };

        try {
          const result = await runNode(node, options.inputs[node.agentId], context);
          nodeResults[node.agentId] = {
            agentId: node.agentId,
            attempt: 1,
            status: result.status === 'failed' ? 'failed' : 'succeeded',
            result,
            startedAt: recordStart,
            finishedAt: new Date().toISOString(),
          };
          if (result.status === 'failed' && node.required) hasFailure = true;
          if (result.status === 'failed' && !node.required) hasOptionalFailure = true;
        } catch (err) {
          const isTimeout = err instanceof TimeoutError;
          nodeResults[node.agentId] = {
            agentId: node.agentId,
            attempt: node.retryPolicy.maxAttempts,
            status: 'failed',
            result: null,
            startedAt: recordStart,
            finishedAt: new Date().toISOString(),
          };
          logExecutionEvent({
            type: 'agent_error',
            workflowId: graph.id,
            workflowExecutionId,
            userId: options.userId,
            agentId: node.agentId,
            error: isTimeout ? 'AGENT_TIMEOUT' : 'UNKNOWN',
          });
          if (node.required) hasFailure = true;
          else hasOptionalFailure = true;
        }
      })
    );

    // Don't start the next level if a required node in this level failed —
    // its dependents can't produce valid input.
    if (hasFailure) break;
  }

  const status = hasFailure ? 'failed' : hasOptionalFailure ? 'partially_failed' : 'succeeded';

  logExecutionEvent({
    type: 'workflow_finished',
    workflowId: graph.id,
    workflowExecutionId,
    userId: options.userId,
    status,
  });

  return {
    workflowExecutionId,
    workflowId: graph.id,
    status,
    nodeResults: nodeResults as WorkflowExecutionResult['nodeResults'],
    startedAt,
    finishedAt: new Date().toISOString(),
  };
}
