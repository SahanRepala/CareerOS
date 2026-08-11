/**
 * agents/salary-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { SalaryAgentInput, SalaryAgentOutput } from './types';

const salaryAgentAgent = createPlaceholderAgent<SalaryAgentInput, SalaryAgentOutput>({
  id: 'salary-agent',
  version: '0.1.0-placeholder',
});

export default salaryAgentAgent;
export type { SalaryAgentInput, SalaryAgentOutput } from './types';
