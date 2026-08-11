/**
 * contracts/domain/interview.contract.ts
 *
 * The interview domain already has well-formed types in lib/interview/types.ts
 * (used today by the heuristic implementation). Re-exported here rather than
 * redeclared, per the "no duplicated interfaces" rule — this file is the
 * contract entry point agents import from; lib/interview stays the home of
 * the existing non-agent implementation.
 */
export type {
  QuestionCategory,
  Difficulty,
  QuestionSource,
  InterviewQuestion,
  AnswerFeedback,
  AnsweredQuestion,
  InterviewSummary,
  InterviewContext,
} from '../../lib/interview/types';

import type { InterviewQuestion, InterviewSummary } from '../../lib/interview/types';

/** The full artifact the interview-agent produces for a session. */
export interface InterviewPack {
  questions: InterviewQuestion[];
  summary: InterviewSummary | null;
}
