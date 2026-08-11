/**
 * workflows/resume-analysis.workflow.ts
 *
 * resume-parser + jd-parser
 *        ↓
 * ┌──────┴──────────────┬───────────────────┬─────────────────────┐
 * ats-agent   recruiter-review-agent  skill-gap-agent   resume-rewrite-agent
 *        └──────────────┴───────────────────┴─────────────────────┘
 *                              ↓
 *                        quality-agent
 *                              ↓
 *                        report-agent
 */
import type { WorkflowGraph } from '../orchestrator/types';
import { node } from './_shared';

export const resumeAnalysisWorkflow: WorkflowGraph = {
  id: 'resume-analysis',
  nodes: [
    node('resume-parser'),
    node('jd-parser'),
    node('ats-agent', ['resume-parser', 'jd-parser']),
    node('recruiter-review-agent', ['resume-parser']),
    node('skill-gap-agent', ['resume-parser']),
    node('resume-rewrite-agent', ['resume-parser', 'jd-parser'], { required: false }),
    node('bullet-improvement-agent', ['resume-parser'], { required: false }),
    node('quality-agent', [
      'ats-agent',
      'recruiter-review-agent',
      'skill-gap-agent',
      'resume-rewrite-agent',
      'bullet-improvement-agent',
    ]),
    node('report-agent', ['quality-agent']),
  ],
};
