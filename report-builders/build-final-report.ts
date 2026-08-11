/**
 * report-builders/build-final-report.ts
 *
 * Takes a WorkflowExecutionResult (raw per-agent AgentResults) and merges it
 * into the single FinalReport contract the frontend/API consumes. This is
 * deliberately mechanical: pull each section's output out of the node
 * results if present, dedupe recommendation text, sort by priority. No
 * agent is called from here and no content is generated — everything it
 * merges was already produced by the orchestrator.
 */
import { randomUUID } from 'crypto';
import type { WorkflowExecutionResult } from '../orchestrator/types';
import type {
  FinalReport,
  FinalRecommendation,
  AtsReport,
  RecruiterFeedbackReport,
  CoverLetter,
  InterviewPack,
  GithubReport,
  PortfolioReport,
  CareerReport,
} from '../contracts';

function sectionOutput<T>(execution: WorkflowExecutionResult, agentId: string): T | null {
  const record = execution.nodeResults[agentId as keyof typeof execution.nodeResults];
  if (!record || record.status !== 'succeeded' || !record.result) return null;
  return (record.result.output as T) ?? null;
}

function dedupeRecommendations(recs: FinalRecommendation[]): FinalRecommendation[] {
  const seen = new Set<string>();
  const deduped: FinalRecommendation[] = [];
  for (const rec of recs) {
    const key = rec.message.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(rec);
  }
  return deduped;
}

const PRIORITY_WEIGHT: Record<FinalRecommendation['priority'], number> = { high: 0, medium: 1, low: 2 };

function sortByPriority(recs: FinalRecommendation[]): FinalRecommendation[] {
  return [...recs].sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
}

/**
 * Every recommendations array below is empty because no agent produces real
 * output yet (all placeholders return `output: null`). Once agents are
 * implemented, extend this function to pull each section's own
 * recommendation-shaped fields into `topRecommendations` before dedupe/sort.
 */
function collectRecommendations(): FinalRecommendation[] {
  return [];
}

export function buildFinalReport(execution: WorkflowExecutionResult): FinalReport {
  const recommendations = sortByPriority(dedupeRecommendations(collectRecommendations()));

  return {
    reportId: randomUUID(),
    generatedAt: new Date().toISOString(),
    ats: sectionOutput<AtsReport>(execution, 'ats-agent'),
    recruiterFeedback: sectionOutput<RecruiterFeedbackReport>(execution, 'recruiter-review-agent'),
    coverLetter: sectionOutput<CoverLetter>(execution, 'cover-letter-agent'),
    interview: sectionOutput<InterviewPack>(execution, 'interview-agent'),
    github: sectionOutput<GithubReport>(execution, 'github-review-agent'),
    portfolio: sectionOutput<PortfolioReport>(execution, 'portfolio-agent'),
    career: sectionOutput<CareerReport>(execution, 'career-strategy-agent'),
    topRecommendations: recommendations,
  };
}
