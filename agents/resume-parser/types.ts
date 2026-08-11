/**
 * agents/resume-parser/types.ts
 *
 * Input/output shapes for the Resume Parser. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { ParsedResume } from '../../contracts/domain/resume.contract';

export interface ResumeParserInput {
  rawText: string;
  sourceFileName: string | null;
}

export type ResumeParserOutput = ParsedResume;
