/**
 * agents/portfolio-agent/types.ts
 *
 * Input/output shapes for the Portfolio Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { PortfolioReport } from '../../contracts/domain/portfolio-report.contract';

export interface PortfolioAgentInput {
  portfolioUrl: string;
}

export type PortfolioAgentOutput = PortfolioReport;
