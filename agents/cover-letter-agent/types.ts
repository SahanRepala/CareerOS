/**
 * agents/cover-letter-agent/types.ts
 *
 * Input/output shapes for the Cover Letter Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { CoverLetter } from '../../contracts/domain/cover-letter.contract';
import type { ParsedJobDescription } from '../../contracts/domain/job-description.contract';
import type { ParsedResume } from '../../contracts/domain/resume.contract';

export interface CoverLetterAgentInput {
  resume: ParsedResume;
  jobDescription: ParsedJobDescription;
}

export type CoverLetterAgentOutput = CoverLetter;
