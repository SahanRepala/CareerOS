/**
 * agents/resume-rewrite-agent/types.ts
 *
 * Input/output shapes for the Resume Rewrite Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { ParsedJobDescription } from '../../contracts/domain/job-description.contract';
import type { ParsedResume } from '../../contracts/domain/resume.contract';

export interface ResumeRewriteAgentInput {
  resume: ParsedResume;
  jobDescription: ParsedJobDescription;
}

export type ResumeRewriteAgentOutput = ParsedResume;
