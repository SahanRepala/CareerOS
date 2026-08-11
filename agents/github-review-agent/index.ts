/**
 * agents/github-review-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { GithubReviewAgentInput, GithubReviewAgentOutput } from './types';

const githubReviewAgentAgent = createPlaceholderAgent<GithubReviewAgentInput, GithubReviewAgentOutput>({
  id: 'github-review-agent',
  version: '0.1.0-placeholder',
});

export default githubReviewAgentAgent;
export type { GithubReviewAgentInput, GithubReviewAgentOutput } from './types';
