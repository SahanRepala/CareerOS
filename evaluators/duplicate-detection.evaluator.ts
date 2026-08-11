/**
 * evaluators/duplicate-detection.evaluator.ts
 *
 * Flags near-duplicate recommendations/bullets so the report builder doesn't surface the same point twice.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const duplicateDetectionEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'duplicate-detection',
    score: null,
    passed: null,
    notes: ['Duplicate Detection evaluator is not implemented yet.'],
  };
};
