/**
 * contracts/domain/github-report.contract.ts
 *
 * Mirrors contracts/domain/interview.contract.ts: lib/github/types.ts already
 * defines a complete, well-typed shape used by the existing heuristic
 * implementation. Re-exported rather than redeclared.
 */
export type {
  RepoOwner,
  RepoMetadata,
  TechStackItem,
  TreeNode,
  RepoSignals,
  ArchitectureLayerId,
  ArchitectureLayer,
  RepoScoreBreakdown,
  EngineeringMaturityAssessment,
  QualitativeAssessment,
  RankedImprovement,
  AIInsights,
  RepoAnalysis,
} from '../../lib/github/types';

import type { RepoAnalysis } from '../../lib/github/types';

/** Alias kept for naming symmetry with the other *-report contracts. */
export type GithubReport = RepoAnalysis;
