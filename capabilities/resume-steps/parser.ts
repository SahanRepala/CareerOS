import { Capability } from '../base';
import { ExecutionContext } from '../../runtime/context';
import { LLMRuntime } from '../lib/ai/sdk/runtime/llm-runtime';
import { ResumeContent } from '../../types/domain';

export interface ResumeParserStepInput { rawResume: string; }
export type ResumeParserStepOutput = ResumeContent;

export class ResumeParserStep implements Capability<ResumeParserStepInput, ResumeParserStepOutput> {
  id = 'resume-parser';
  metadata = { name: 'Resume Parser Step', description: '', version: '1.0.0', featureFlag: '' };
  dependencies = [];

  constructor(private llmRuntime: LLMRuntime) {}

  validate(input: ResumeParserStepInput) { return []; }

  async run(input: ResumeParserStepInput, context: ExecutionContext): Promise<ResumeParserStepOutput> {
    const response = await this.llmRuntime.generate<ResumeParserStepOutput>(
      'resume-parser-prompt',
      input as any,
      'resume-content-schema'
    );
    return response.content;
  }
}
