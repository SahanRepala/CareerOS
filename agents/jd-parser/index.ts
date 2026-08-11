/**
 * agents/jd-parser/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
import type { JdParserInput, JdParserOutput } from './types';

const jdParserAgent = createPlaceholderAgent<JdParserInput, JdParserOutput>({
  id: 'jd-parser',
  version: '0.1.0-placeholder',
});

export default jdParserAgent;
export type { JdParserInput, JdParserOutput } from './types';
