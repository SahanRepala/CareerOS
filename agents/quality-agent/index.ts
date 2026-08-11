/**
 * agents/quality-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { QualityAgentInput, QualityAgentOutput } from './types';

const qualityAgentAgent = createPlaceholderAgent<QualityAgentInput, QualityAgentOutput>({
  id: 'quality-agent',
  version: '0.1.0-placeholder',
});

export default qualityAgentAgent;
export type { QualityAgentInput, QualityAgentOutput } from './types';
