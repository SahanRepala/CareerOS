/**
 * workflows/_shared.ts
 *
 * Workflows only define execution order (which agents, in what dependency
 * order, with what timeout/retry/required policy) — never logic. This helper
 * just keeps that declaration terse and consistent across workflow files.
 */
import type { AgentId } from '../types/agent-id';
import type { WorkflowNode, RetryPolicy } from '../orchestrator/types';
import { DEFAULT_RETRY_POLICY } from '../orchestrator/types';

export function node(
  agentId: AgentId,
  dependsOn: AgentId[] = [],
  overrides: Partial<Pick<WorkflowNode, 'timeoutMs' | 'retryPolicy' | 'required'>> = {}
): WorkflowNode {
  return {
    agentId,
    dependsOn,
    timeoutMs: overrides.timeoutMs ?? 30_000,
    retryPolicy: overrides.retryPolicy ?? (DEFAULT_RETRY_POLICY as RetryPolicy),
    required: overrides.required ?? true,
  };
}
