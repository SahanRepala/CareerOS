/**
 * agents/portfolio-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { PortfolioAgentInput, PortfolioAgentOutput } from './types';

const portfolioAgentAgent = createPlaceholderAgent<PortfolioAgentInput, PortfolioAgentOutput>({
  id: 'portfolio-agent',
  version: '0.1.0-placeholder',
});

export default portfolioAgentAgent;
export type { PortfolioAgentInput, PortfolioAgentOutput } from './types';
