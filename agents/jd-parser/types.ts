/**
 * agents/jd-parser/types.ts
 *
 * Input/output shapes for the JD Parser. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { ParsedJobDescription } from '../../contracts/domain/job-description.contract';

export interface JdParserInput {
  rawText: string;
  sourceUrl: string | null;
}

export type JdParserOutput = ParsedJobDescription;
