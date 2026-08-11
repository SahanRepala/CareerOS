/**
 * agents/cover-letter-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { CoverLetterAgentInput, CoverLetterAgentOutput } from './types';

const coverLetterAgentAgent = createPlaceholderAgent<CoverLetterAgentInput, CoverLetterAgentOutput>({
  id: 'cover-letter-agent',
  version: '0.1.0-placeholder',
});

export default coverLetterAgentAgent;
export type { CoverLetterAgentInput, CoverLetterAgentOutput } from './types';
