/**
 * workflows/complete-analysis.workflow.ts
 *
 * resume-parser + jd-parser
 *        ↓
 * ┌── ats-agent ── recruiter-review-agent ── skill-gap-agent ── resume-rewrite-agent ──┐
 * ├── bullet-improvement-agent ── cover-letter-agent ── interview-agent ── linkedin-agent ┤
 * └── github-review-agent ── portfolio-agent ── salary-agent ── career-strategy-agent ──┘
 *                              ↓
 *                        quality-agent
 *                              ↓
 *                        report-agent
 *
 * The "kitchen sink" workflow behind /api/analyze's most thorough mode.
 * Individually toggle sections off via /config/feature-flags.ts rather than
 * editing this graph.
 */
import type { WorkflowGraph } from '../orchestrator/types';
import { node } from './_shared';

const PARSED = ['resume-parser', 'jd-parser'] as const;

export const completeAnalysisWorkflow: WorkflowGraph = {
  id: 'complete-analysis',
  nodes: [
    node('resume-parser'),
    node('jd-parser'),
    node('ats-agent', [...PARSED]),
    node('recruiter-review-agent', ['resume-parser']),
    node('skill-gap-agent', ['resume-parser']),
    node('resume-rewrite-agent', [...PARSED], { required: false }),
    node('bullet-improvement-agent', ['resume-parser'], { required: false }),
    node('cover-letter-agent', [...PARSED], { required: false }),
    node('interview-agent', [...PARSED], { timeoutMs: 45_000, required: false }),
    node('linkedin-agent', ['resume-parser'], { required: false }),
    node('github-review-agent', [], { timeoutMs: 45_000, required: false }),
    node('portfolio-agent', [], { required: false }),
    node('salary-agent', [], { required: false }),
    node('career-strategy-agent', ['skill-gap-agent', 'salary-agent'], { required: false }),
    node('quality-agent', [
      'ats-agent',
      'recruiter-review-agent',
      'skill-gap-agent',
      'resume-rewrite-agent',
      'bullet-improvement-agent',
      'cover-letter-agent',
      'interview-agent',
      'linkedin-agent',
      'github-review-agent',
      'portfolio-agent',
      'career-strategy-agent',
    ]),
    node('report-agent', ['quality-agent']),
  ],
};
