/**
 * agents/skill-gap-agent/types.ts
 *
 * Input/output shapes for the Skill Gap Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { SkillGapItem } from '../../contracts/domain/career-report.contract';
import type { CandidateProfile } from '../../contracts/domain/resume.contract';

export interface SkillGapAgentInput {
  candidate: CandidateProfile;
  targetRole: string;
}

export type SkillGapAgentOutput = SkillGapItem[];
