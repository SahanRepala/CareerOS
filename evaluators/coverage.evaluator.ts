/**
 * evaluators/coverage.evaluator.ts
 *
 * Checks whether an agent addressed every required section of its expected output shape.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const coverageEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'coverage',
    score: null,
    passed: null,
    notes: ['Coverage evaluator is not implemented yet.'],
  };
};
