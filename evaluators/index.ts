/**
 * evaluators/index.ts
 *
 * Registry of every evaluator, keyed by id, for the quality-agent to iterate.
 */
import type { Evaluator } from './types';

import { accuracyEvaluator } from './accuracy.evaluator';
import { consistencyEvaluator } from './consistency.evaluator';
import { hallucinationEvaluator } from './hallucination.evaluator';
import { duplicateDetectionEvaluator } from './duplicate-detection.evaluator';
import { grammarEvaluator } from './grammar.evaluator';
import { resumeQualityEvaluator } from './resume-quality.evaluator';
import { jdMatchingEvaluator } from './jd-matching.evaluator';
import { coverageEvaluator } from './coverage.evaluator';

export const EVALUATOR_REGISTRY: Record<string, Evaluator> = {
  'accuracy': accuracyEvaluator,
  'consistency': consistencyEvaluator,
  'hallucination': hallucinationEvaluator,
  'duplicate-detection': duplicateDetectionEvaluator,
  'grammar': grammarEvaluator,
  'resume-quality': resumeQualityEvaluator,
  'jd-matching': jdMatchingEvaluator,
  'coverage': coverageEvaluator,
};

export * from './types';