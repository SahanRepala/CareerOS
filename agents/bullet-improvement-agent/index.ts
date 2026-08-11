/**
 * agents/bullet-improvement-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { BulletImprovementAgentInput, BulletImprovementAgentOutput } from './types';

const bulletImprovementAgentAgent = createPlaceholderAgent<BulletImprovementAgentInput, BulletImprovementAgentOutput>({
  id: 'bullet-improvement-agent',
  version: '0.1.0-placeholder',
});

export default bulletImprovementAgentAgent;
export type { BulletImprovementAgentInput, BulletImprovementAgentOutput } from './types';
