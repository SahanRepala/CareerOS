/**
 * evaluators/grammar.evaluator.ts
 *
 * Checks generated prose (cover letters, rewritten bullets) for grammatical correctness.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const grammarEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'grammar',
    score: null,
    passed: null,
    notes: ['Grammar evaluator is not implemented yet.'],
  };
};
