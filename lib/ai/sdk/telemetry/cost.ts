export interface CostDimensions {
  requestId: string;
  capabilityId: string;
  workflowId: string;
  userId: string;
  model: string;
  provider: string;
}

export interface CostTracker {
  track(dimensions: CostDimensions, usage: { input: number; output: number; usd: number }): void;
  getUsageSummary(): Record<string, unknown>;
}
