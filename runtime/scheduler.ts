import { WorkflowGraph, WorkflowNode } from './types';

export class WorkflowScheduler {
  static getExecutionOrder(graph: WorkflowGraph): WorkflowNode[][] {
    const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
    const levels: WorkflowNode[][] = [];
    const visited = new Set<string>();

    while (visited.size < graph.nodes.length) {
      const level: WorkflowNode[] = [];
      for (const node of graph.nodes) {
        if (visited.has(node.id)) continue;

        const dependenciesMet = node.dependsOn.every((depId) => visited.has(depId));
        if (dependenciesMet) {
          level.push(node);
        }
      }

      if (level.length === 0) {
        throw new Error('Circular dependency detected in workflow graph');
      }

      levels.push(level);
      level.forEach((node) => visited.add(node.id));
    }

    return levels;
  }
}
