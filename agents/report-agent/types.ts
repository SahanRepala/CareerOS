/**
 * agents/report-agent/types.ts
 *
 * Input/output shapes for the Report Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
import type { FinalReport } from '../../contracts/final-report.contract';

export interface ReportAgentInput {
  sections: Record<string, unknown>;
}

export type ReportAgentOutput = FinalReport;
