export interface LLMRequest {
  promptId: string;
  model: string;
  input: Record<string, unknown>;
  schema?: Record<string, unknown>; // JSON Schema
}

export interface LLMResponse<T = unknown> {
  content: T;
  raw: string;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
  model: string;
  provider: string;
}

export interface LLMError {
  message: string;
  providerCode?: string;
  retryable: boolean;
}
