/**
 * agents/report-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { ReportAgentInput, ReportAgentOutput } from './types';

const reportAgentAgent = createPlaceholderAgent<ReportAgentInput, ReportAgentOutput>({
  id: 'report-agent',
  version: '0.1.0-placeholder',
});

export default reportAgentAgent;
export type { ReportAgentInput, ReportAgentOutput } from './types';
