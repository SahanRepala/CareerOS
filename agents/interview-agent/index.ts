/**
 * agents/interview-agent/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { InterviewAgentInput, InterviewAgentOutput } from './types';

const interviewAgentAgent = createPlaceholderAgent<InterviewAgentInput, InterviewAgentOutput>({
  id: 'interview-agent',
  version: '0.1.0-placeholder',
});

export default interviewAgentAgent;
export type { InterviewAgentInput, InterviewAgentOutput } from './types';
