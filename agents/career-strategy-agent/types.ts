/**
 * agents/career-strategy-agent/types.ts
 *
 * Input/output shapes for the Career Strategy Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { CareerReport } from '../../contracts/domain/career-report.contract';
import type { CandidateProfile } from '../../contracts/domain/resume.contract';

export interface CareerStrategyAgentInput {
  candidate: CandidateProfile;
  targetRole: string;
}

export type CareerStrategyAgentOutput = CareerReport;
