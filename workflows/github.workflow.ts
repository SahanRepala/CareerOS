/**
 * workflows/github.workflow.ts
 *
 * github-review-agent -> quality-agent -> report-agent
 *
 * Deterministic repo-signal extraction (parsing the URL, walking the tree,
 * detecting the stack) stays in lib/github/* as today — it's not AI logic.
 * This workflow only covers the agent-driven qualitative review step.
 */
import type { WorkflowGraph } from '../orchestrator/types';
import { node } from './_shared';

export const githubWorkflow: WorkflowGraph = {
  id: 'github',
  nodes: [
    node('github-review-agent', [], { timeoutMs: 45_000 }),
    node('quality-agent', ['github-review-agent']),
    node('report-agent', ['quality-agent']),
  ],
};
