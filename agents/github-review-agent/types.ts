/**
 * agents/github-review-agent/types.ts
 *
 * Input/output shapes for the GitHub Review Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { AIInsights, RepoSignals, TechStackItem } from '../../contracts/domain/github-report.contract';

export interface GithubReviewAgentInput {
  repoSignals: RepoSignals;
  techStack: TechStackItem[];
}

export type GithubReviewAgentOutput = AIInsights;
