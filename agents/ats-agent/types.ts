/**
 * agents/ats-agent/types.ts
 *
 * Input/output shapes for the ATS Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { AtsReport } from '../../contracts/domain/ats-report.contract';
import type { ParsedJobDescription } from '../../contracts/domain/job-description.contract';
import type { ParsedResume } from '../../contracts/domain/resume.contract';

export interface AtsAgentInput {
  resume: ParsedResume;
  jobDescription: ParsedJobDescription;
}

export type AtsAgentOutput = AtsReport;
