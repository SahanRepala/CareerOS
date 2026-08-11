/**
 * agents/recruiter-review-agent/types.ts
 *
 * Input/output shapes for the Recruiter Review Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { RecruiterFeedbackReport } from '../../contracts/domain/ats-report.contract';
import type { ParsedResume } from '../../contracts/domain/resume.contract';

export interface RecruiterReviewAgentInput {
  resume: ParsedResume;
}

export type RecruiterReviewAgentOutput = RecruiterFeedbackReport;
