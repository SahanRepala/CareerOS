/**
 * orchestrator/types.ts
 */
import type { AgentId } from '../types/agent-id';
import type { AgentResult } from '../contracts/agent.contract';

export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 2,
  backoffMs: 500,
  backoffMultiplier: 2,
};

/** One node in a workflow's execution graph. */
export interface WorkflowNode {
  agentId: AgentId;
  /** Other node agentIds that must complete before this one starts. */
  dependsOn: AgentId[];
  timeoutMs: number;
  retryPolicy: RetryPolicy;
  /** If false, a failure here does not fail the whole workflow. */
  required: boolean;
}

export interface WorkflowGraph {
  id: string;
  nodes: WorkflowNode[];
}

export type WorkflowExecutionStatus = 'pending' | 'running' | 'succeeded' | 'partially_failed' | 'failed';

export interface WorkflowNodeExecutionRecord {
  agentId: AgentId;
  attempt: number;
  status: WorkflowExecutionStatus;
  result: AgentResult<unknown> | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface WorkflowExecutionResult {
  workflowExecutionId: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  nodeResults: Record<AgentId, WorkflowNodeExecutionRecord>;
  startedAt: string;
  finishedAt: string | null;
}

/** Unified error format across the whole AI layer (agents, workflows, providers, parsing). */
export type OrchestratorErrorCode =
  | 'AGENT_TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'WORKFLOW_ERROR'
  | 'PARSING_ERROR'
  | 'PROVIDER_ERROR'
  | 'CYCLE_DETECTED'
  | 'UNKNOWN_AGENT';

export interface OrchestratorError {
  code: OrchestratorErrorCode;
  message: string;
  agentId?: AgentId;
  details?: Record<string, unknown>;
}
