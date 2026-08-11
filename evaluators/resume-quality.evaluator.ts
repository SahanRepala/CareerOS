/**
 * evaluators/resume-quality.evaluator.ts
 *
 * Scores a rewritten/improved resume against general resume best-practices.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const resumeQualityEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'resume-quality',
    score: null,
    passed: null,
    notes: ['Resume Quality evaluator is not implemented yet.'],
  };
};
