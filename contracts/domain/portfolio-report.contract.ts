/**
 * contracts/domain/portfolio-report.contract.ts
 *
 * Net-new contract — there is no existing portfolio feature to reconcile
 * with, so this shape is designed fresh for the future portfolio-agent.
 */

export interface PortfolioProjectAssessment {
  projectName: string;
  clarityScore: number; // 0-100
  presentationNotes: string[];
  suggestedImprovements: string[];
}

export interface PortfolioReport {
  overallScore: number; // 0-100
  projects: PortfolioProjectAssessment[];
  narrativeCoherence: string;
  recommendations: string[];
}
