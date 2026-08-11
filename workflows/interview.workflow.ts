/**
 * workflows/interview.workflow.ts
 *
 * resume-parser + jd-parser -> interview-agent -> quality-agent -> report-agent
 */
import type { WorkflowGraph } from '../orchestrator/types';
import { node } from './_shared';

export const interviewWorkflow: WorkflowGraph = {
  id: 'interview',
  nodes: [
    node('resume-parser'),
    node('jd-parser', [], { required: false }),
    node('interview-agent', ['resume-parser', 'jd-parser'], { timeoutMs: 45_000 }),
    node('quality-agent', ['interview-agent']),
    node('report-agent', ['quality-agent']),
  ],
};
