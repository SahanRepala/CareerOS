/**
 * agents/linkedin-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { LinkedinAgentInput, LinkedinAgentOutput } from './types';

const linkedinAgentAgent = createPlaceholderAgent<LinkedinAgentInput, LinkedinAgentOutput>({
  id: 'linkedin-agent',
  version: '0.1.0-placeholder',
});

export default linkedinAgentAgent;
export type { LinkedinAgentInput, LinkedinAgentOutput } from './types';
