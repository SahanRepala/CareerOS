/**
 * types/agent-id.ts
 *
 * Single source of truth for agent identifiers. Adding a new agent means
 * adding one line here — the orchestrator, workflows, feature flags, and
 * logging all key off this type, so nothing else needs to change shape.
 */
export const AGENT_IDS = [
  'resume-parser',
  'jd-parser',
  'ats-agent',
  'resume-rewrite-agent',
  'bullet-improvement-agent',
  'recruiter-review-agent',
  'skill-gap-agent',
  'cover-letter-agent',
  'interview-agent',
  'github-review-agent',
  'portfolio-agent',
  'linkedin-agent',
  'career-strategy-agent',
  'salary-agent',
  'quality-agent',
  'report-agent',
] as const;

export type AgentId = (typeof AGENT_IDS)[number];
