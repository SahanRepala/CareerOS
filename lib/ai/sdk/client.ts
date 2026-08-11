import { LLMRequest, LLMResponse } from './types/contracts';

export interface ModelSelector {
  select(task: string): Promise<string>; // returns model ID
}

export interface ProviderInterface {
  execute(request: LLMRequest): Promise<LLMResponse>;
}

export interface AIClient {
  execute<T>(request: LLMRequest): Promise<LLMResponse<T>>;
}
