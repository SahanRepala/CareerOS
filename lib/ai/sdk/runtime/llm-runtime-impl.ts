import { LLMRuntime, ExtendedLLMResponse } from './sdk/runtime/llm-runtime';
import { PromptBuilder } from './sdk/prompt/builder';
import { SchemaRegistry } from './sdk/schema/registry';
import { ResponsePipeline } from './sdk/parsing/pipeline';
import { ProviderRegistry } from '../../../registry/specialized';

export class LLMRuntimeImpl implements LLMRuntime {
  constructor(
    private providerRegistry: ProviderRegistry,
    private promptBuilder: PromptBuilder,
    private schemaRegistry: SchemaRegistry,
    private pipeline: ResponsePipeline
  ) {}

  async generate<T>(
    promptId: string,
    input: Record<string, unknown>,
    schemaId: string
  ): Promise<ExtendedLLMResponse<T>> {
    const provider = this.providerRegistry.get('openrouter');
    if (!provider) throw new Error('Provider not found');

    // 1. Build prompt
    const prompt = await this.promptBuilder.build(promptId, 'v1', { /* context */ } as any);
    
    // 2. Execute
    const response = await provider.execute({ promptId, model: 'gpt-4', input });
    
    // 3. Pipeline processing
    const parsed = await this.pipeline.process<T>(response.raw, schemaId);

    return {
      ...response,
      content: parsed,
      latencyMs: 100,
      cost: 0.01,
      finishReason: 'stop',
      isCached: false,
      requestId: 'req-123',
      metadata: {},
    } as ExtendedLLMResponse<T>;
  }

  stream(promptId: string, input: Record<string, unknown>): AsyncIterable<string> {
    throw new Error('Not implemented');
  }
}
