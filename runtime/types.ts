import { ExecutionContext } from './context';

export interface WorkflowExecutor {
  execute(workflowGraph: WorkflowGraph, input: unknown, context: ExecutionContext): Promise<unknown>;
}

export interface CapabilityExecutor {
  execute(capabilityId: string, input: unknown, context: ExecutionContext): Promise<unknown>;
}

export interface RuntimeConfig {
  environment: 'development' | 'production';
  debug: boolean;
}

// Execution Graph Abstractions

export interface WorkflowNode {
  id: string;
  capabilityId: string;
  dependsOn: string[]; // List of node IDs
  retryPolicy?: RetryPolicy;
  timeoutMs?: number;
}

export interface WorkflowGraph {
  id: string;
  nodes: WorkflowNode[];
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
}
