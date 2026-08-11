/**
 * agents/recruiter-review-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { RecruiterReviewAgentInput, RecruiterReviewAgentOutput } from './types';

const recruiterReviewAgentAgent = createPlaceholderAgent<RecruiterReviewAgentInput, RecruiterReviewAgentOutput>({
  id: 'recruiter-review-agent',
  version: '0.1.0-placeholder',
});

export default recruiterReviewAgentAgent;
export type { RecruiterReviewAgentInput, RecruiterReviewAgentOutput } from './types';
