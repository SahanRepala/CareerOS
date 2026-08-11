/**
 * evaluators/hallucination.evaluator.ts
 *
 * Flags content that doesn't trace back to any provided source material.
 *
 * Status: not implemented — always returns a neutral, un-scored result.
 */
import type { Evaluator, EvaluatorResult } from './types';

export const hallucinationEvaluator: Evaluator = (_output: unknown): EvaluatorResult => {
  return {
    evaluatorId: 'hallucination',
    score: null,
    passed: null,
    notes: ['Hallucination evaluator is not implemented yet.'],
  };
};
