import { LLMResponse } from './types/contracts';

export interface ExtendedLLMResponse<T = unknown> extends LLMResponse<T> {
  latencyMs: number;
  cost: number;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'error';
  isCached: boolean;
  requestId: string;
  metadata: Record<string, unknown>;
}

export interface LLMRuntime {
  generate<T>(
    promptId: string,
    input: Record<string, unknown>,
    schemaId: string
  ): Promise<ExtendedLLMResponse<T>>;

  stream(
    promptId: string,
    input: Record<string, unknown>
  ): AsyncIterable<string>;
}
