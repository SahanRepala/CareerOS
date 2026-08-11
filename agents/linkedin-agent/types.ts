/**
 * agents/linkedin-agent/types.ts
 *
 * Input/output shapes for the LinkedIn Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { ParsedResume } from '../../contracts/domain/resume.contract';

export interface LinkedinAgentInput {
  profileText: string;
  resume: ParsedResume;
}

export type LinkedinAgentOutput = { score: number; suggestions: string[] };
