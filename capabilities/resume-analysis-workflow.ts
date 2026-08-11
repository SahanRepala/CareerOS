import { Capability } from '../base';
import { ExecutionContext } from '../../runtime/context';
import { LLMRuntime } from '../lib/ai/sdk/runtime/llm-runtime';
import { ResumeContent, JobDescription, AnalysisResult } from '../../types/domain';
import { ResumeParserCapability, ResumeParserInput, ResumeParserOutput } from './parser';

export interface ResumeAnalysisWorkflowInput {
    rawResume: string;
    rawJD: string;
}

export class ResumeAnalysisWorkflow implements Capability<ResumeAnalysisWorkflowInput, any> {
    id = 'resume-analysis-workflow';
    metadata = { name: 'Resume Analysis Workflow', description: 'Orchestrates parsing, analysis, and reporting', version: '1.0.0', featureFlag: '' };
    dependencies = ['resume-parser', 'jd-parser', 'ats-analysis'];

    constructor(
        private llmRuntime: LLMRuntime,
        private registry: any // Assume a registry to lookup sub-capabilities
    ) {}

    validate(input: ResumeAnalysisWorkflowInput) { return []; }

    async run(input: ResumeAnalysisWorkflowInput, context: ExecutionContext): Promise<any> {
        // 1. Parse Resume
        const resume = await this.registry.get('resume-parser').run({ rawResume: input.rawResume }, context);
        
        // 2. Parse JD
        const jd = await this.registry.get('jd-parser').run({ rawJD: input.rawJD }, context);
        
        // 3. ATS Analysis
        const analysis = await this.registry.get('ats-analysis').run({ resume, jd }, context);

        // ... continue orchestrating other steps ...
        
        return { resume, jd, analysis };
    }
}
