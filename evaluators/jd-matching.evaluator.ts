/**
 * evaluators/jd-matching.evaluator.ts
 *
 * Scores how well a resume or rewrite aligns with a specific job description's requirements.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const jdMatchingEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'jd-matching',
    score: null,
    passed: null,
    notes: ['JD Matching evaluator is not implemented yet.'],
  };
};
