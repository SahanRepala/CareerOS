/**
 * agents/ats-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { AtsAgentInput, AtsAgentOutput } from './types';

const atsAgentAgent = createPlaceholderAgent<AtsAgentInput, AtsAgentOutput>({
  id: 'ats-agent',
  version: '0.1.0-placeholder',
});

export default atsAgentAgent;
export type { AtsAgentInput, AtsAgentOutput } from './types';
