/**
 * agents/interview-agent/types.ts
 *
 * Input/output shapes for the Interview Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { InterviewContext, InterviewPack } from '../../contracts/domain/interview.contract';

export interface InterviewAgentInput {
  context: InterviewContext;
}

export type InterviewAgentOutput = InterviewPack;
