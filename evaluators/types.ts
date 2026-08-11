/**
 * evaluators/types.ts
 *
 * Evaluators are pure functions that score a single piece of agent output.
 * The quality-agent (see /agents/quality-agent) runs the relevant subset of
 * these against every agent result before it reaches the report builder.
 * None of these implementations reason about content yet — they're wired to
 * always return a neutral "not evaluated" score so the pipeline type-checks
 * and runs end-to-end today.
 */
export interface EvaluatorResult {
  evaluatorId: string;
  /** 0-1, or null when the evaluator hasn't been implemented yet. */
  score: number | null;
  passed: boolean | null;
  notes: string[];
}

export type Evaluator = (output: unknown) => EvaluatorResult;
