/**
 * agents/resume-rewrite-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { ResumeRewriteAgentInput, ResumeRewriteAgentOutput } from './types';

const resumeRewriteAgentAgent = createPlaceholderAgent<ResumeRewriteAgentInput, ResumeRewriteAgentOutput>({
  id: 'resume-rewrite-agent',
  version: '0.1.0-placeholder',
});

export default resumeRewriteAgentAgent;
export type { ResumeRewriteAgentInput, ResumeRewriteAgentOutput } from './types';
