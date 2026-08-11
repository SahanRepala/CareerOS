/**
 * agents/career-strategy-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { CareerStrategyAgentInput, CareerStrategyAgentOutput } from './types';

const careerStrategyAgentAgent = createPlaceholderAgent<CareerStrategyAgentInput, CareerStrategyAgentOutput>({
  id: 'career-strategy-agent',
  version: '0.1.0-placeholder',
});

export default careerStrategyAgentAgent;
export type { CareerStrategyAgentInput, CareerStrategyAgentOutput } from './types';
