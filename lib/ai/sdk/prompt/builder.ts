import { ExecutionContext } from '../../../runtime/context';

export interface PromptContext {
  execution: ExecutionContext;
  variables: Record<string, unknown>;
}

export interface PromptBuilder {
  build(templateId: string, version: string, context: PromptContext): Promise<string>;
}
