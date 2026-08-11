/**
 * agents/skill-gap-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { SkillGapAgentInput, SkillGapAgentOutput } from './types';

const skillGapAgentAgent = createPlaceholderAgent<SkillGapAgentInput, SkillGapAgentOutput>({
  id: 'skill-gap-agent',
  version: '0.1.0-placeholder',
});

export default skillGapAgentAgent;
export type { SkillGapAgentInput, SkillGapAgentOutput } from './types';
