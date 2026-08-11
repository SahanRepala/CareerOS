export interface ExecutionContext {
  executionId: string;
  correlationId: string;
  userId: string;
  traceId: string;
  featureFlags: Record<string, boolean>;
  telemetry: Record<string, unknown>;
}
