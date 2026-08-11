/**
 * agents/quality-agent/types.ts
 *
 * Input/output shapes for the Quality Agent. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
// No shared contract types needed for this agent's input/output yet.

export interface QualityAgentInput {
  agentId: string;
  output: unknown;
}

export type QualityAgentOutput = { passed: boolean; evaluatorResults: Record<string, number> };
