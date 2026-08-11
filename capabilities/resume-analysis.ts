import { Capability } from './base';
import { ExecutionContext } from '../runtime/context';
import { RuntimeEngine } from '../runtime/engine';
import { WorkflowGraph } from '../runtime/types';

export interface ResumeAnalysisInput {
  rawResume: string;
  rawJD: string;
}

export interface ResumeAnalysisOutput {
  finalReport: string;
}

export class ResumeAnalysisCapability implements Capability<ResumeAnalysisInput, ResumeAnalysisOutput> {
  id = 'resume-analysis';
  metadata = {
    name: 'Resume Analysis',
    description: 'Orchestrates full resume analysis pipeline',
    version: '1.0.0',
    featureFlag: 'resume-analysis-enabled',
  };
  dependencies = ['resume-parser', 'jd-parser', 'ats-analysis'];

  constructor(private runtimeEngine: RuntimeEngine) {}

  validate(input: ResumeAnalysisInput) {
    if (!input.rawResume || !input.rawJD) return [{ path: 'input', message: 'Missing inputs' }];
    return [];
  }

  async run(input: ResumeAnalysisInput, context: ExecutionContext): Promise<ResumeAnalysisOutput> {
    const graph: WorkflowGraph = {
      id: 'resume-analysis-dag',
      nodes: [
        { id: 'step-1', capabilityId: 'resume-parser', dependsOn: [] },
        { id: 'step-2', capabilityId: 'jd-parser', dependsOn: [] },
        { id: 'step-3', capabilityId: 'ats-analysis', dependsOn: ['step-1', 'step-2'] },
        // ... RecruiterReview, Rewrite, Composer ...
      ],
    };

    // The runtime handles everything: dependency resolution, middleware, lifecycle events, retries
    const result = await this.runtimeEngine.execute(graph, input, context);
    
    // Result composition
    return { finalReport: 'Report composed' };
  }
}
