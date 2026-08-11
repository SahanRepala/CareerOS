/**
 * contracts/final-report.contract.ts
 *
 * The shape report-builders/ assembles by merging individual agent outputs.
 * This is what an /api route eventually hands back to the frontend for a
 * "complete analysis" style request.
 */
import type { AtsReport, RecruiterFeedbackReport } from './domain/ats-report.contract';
import type { CoverLetter } from './domain/cover-letter.contract';
import type { InterviewPack } from './domain/interview.contract';
import type { GithubReport } from './domain/github-report.contract';
import type { PortfolioReport } from './domain/portfolio-report.contract';
import type { CareerReport } from './domain/career-report.contract';

export interface FinalRecommendation {
  priority: 'high' | 'medium' | 'low';
  sourceAgentId: string;
  message: string;
}

/** Every section is optional because a given workflow may only run a subset of agents. */
export interface FinalReport {
  reportId: string;
  generatedAt: string;
  ats: AtsReport | null;
  recruiterFeedback: RecruiterFeedbackReport | null;
  coverLetter: CoverLetter | null;
  interview: InterviewPack | null;
  github: GithubReport | null;
  portfolio: PortfolioReport | null;
  career: CareerReport | null;
  /** Deduplicated, conflict-resolved, priority-sorted recommendations across all sections. */
  topRecommendations: FinalRecommendation[];
}
