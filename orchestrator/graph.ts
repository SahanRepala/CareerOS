/**
 * orchestrator/graph.ts
 *
 * Pure graph math — no agent execution here. Turns a WorkflowGraph's flat
 * `dependsOn` edges into ordered "levels" (batches of nodes that can run in
 * parallel because they don't depend on each other), and detects cycles so
 * a malformed workflow definition fails fast instead of hanging.
 */
import type { AgentId } from '../types/agent-id';
import type { WorkflowGraph, WorkflowNode } from './types';

export class CycleDetectedError extends Error {
  constructor(public readonly cycleNodes: AgentId[]) {
    super(`Cycle detected in workflow graph: ${cycleNodes.join(' -> ')}`);
    this.name = 'CycleDetectedError';
  }
}

/**
 * Returns nodes grouped into sequential levels. All nodes within a level
 * have no dependency on each other and can be executed in parallel; each
 * level waits for the previous one to finish.
 */
export function buildExecutionLevels(graph: WorkflowGraph): WorkflowNode[][] {
  const nodesById = new Map<AgentId, WorkflowNode>(graph.nodes.map((n) => [n.agentId, n]));
  const remaining = new Set<AgentId>(nodesById.keys());
  const completed = new Set<AgentId>();
  const levels: WorkflowNode[][] = [];

  while (remaining.size > 0) {
    const level: WorkflowNode[] = [];
    Array.from(remaining).forEach((id) => {
      const node = nodesById.get(id)!;
      if (node.dependsOn.every((dep) => completed.has(dep))) {
        level.push(node);
      }
    });

    if (level.length === 0) {
      throw new CycleDetectedError(Array.from(remaining));
    }

    for (const node of level) {
      remaining.delete(node.agentId);
      completed.add(node.agentId);
    }
    levels.push(level);
  }

  return levels;
}
