/**
 * workflows/career.workflow.ts
 *
 * resume-parser -> [skill-gap-agent, salary-agent] -> career-strategy-agent
 *        -> quality-agent -> report-agent
 */
import type { WorkflowGraph } from '../orchestrator/types';
import { node } from './_shared';

export const careerWorkflow: WorkflowGraph = {
  id: 'career',
  nodes: [
    node('resume-parser'),
    node('skill-gap-agent', ['resume-parser']),
    node('salary-agent', [], { required: false }),
    node('career-strategy-agent', ['skill-gap-agent', 'salary-agent']),
    node('quality-agent', ['career-strategy-agent']),
    node('report-agent', ['quality-agent']),
  ],
};
