/**
 * evaluators/accuracy.evaluator.ts
 *
 * Checks whether claims in an agent's output are grounded in the source input (resume/JD/repo) rather than fabricated.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const accuracyEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'accuracy',
    score: null,
    passed: null,
    notes: ['Accuracy evaluator is not implemented yet.'],
  };
};
