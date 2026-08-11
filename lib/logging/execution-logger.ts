/**
 * lib/logging/execution-logger.ts
 *
 * Structured logging for the AI layer (orchestrator, workflows, agents).
 * Deliberately dumb right now — it writes to console in a structured shape.
 * When real observability exists (e.g. persisting to an `execution_logs`
 * table, or shipping to a log pipeline), only this file changes; every
 * caller already logs through `logExecutionEvent`.
 */
import type { AgentId } from '../../types/agent-id';

export type ExecutionEventType =
  | 'workflow_started'
  | 'workflow_finished'
  | 'agent_started'
  | 'agent_finished'
  | 'agent_error';

export interface ExecutionEvent {
  type: ExecutionEventType;
  workflowId?: string;
  workflowExecutionId?: string;
  agentId?: AgentId;
  userId: string;
  status?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export function logExecutionEvent(event: ExecutionEvent): void {
  const entry = {
    timestamp: new Date().toISOString(),
    ...event,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ source: 'careeros.ai-execution', ...entry }));
}
