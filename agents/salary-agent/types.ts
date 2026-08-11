/**
 * agents/salary-agent/types.ts
 *
 * Input/output shapes for the Salary Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
// No shared contract types needed for this agent's input/output yet.

export interface SalaryAgentInput {
  targetRole: string;
  seniority: string | null;
  location: string | null;
}

export type SalaryAgentOutput = { min: number; max: number; currency: string };
