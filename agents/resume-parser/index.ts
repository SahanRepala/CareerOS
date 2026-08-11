/**
 * agents/resume-parser/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { ResumeParserInput, ResumeParserOutput } from './types';

const resumeParserAgent = createPlaceholderAgent<ResumeParserInput, ResumeParserOutput>({
  id: 'resume-parser',
  version: '0.1.0-placeholder',
});

export default resumeParserAgent;
export type { ResumeParserInput, ResumeParserOutput } from './types';
