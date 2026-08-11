/**
 * evaluators/consistency.evaluator.ts
 *
 * Checks whether an agent's output is internally consistent (e.g. scores line up with stated findings).
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const consistencyEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'consistency',
    score: null,
    passed: null,
    notes: ['Consistency evaluator is not implemented yet.'],
  };
};
