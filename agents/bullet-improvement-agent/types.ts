/**
 * agents/bullet-improvement-agent/types.ts
 *
 * Input/output shapes for the Bullet Improvement Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { ParsedJobDescription } from '../../contracts/domain/job-description.contract';

export interface BulletImprovementAgentInput {
  bullets: string[];
  jobDescription: ParsedJobDescription | null;
}

export type BulletImprovementAgentOutput = { original: string; improved: string; rationale: string }[];
