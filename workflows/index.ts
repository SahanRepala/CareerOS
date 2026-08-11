/**
 * workflows/index.ts
 */
import type { WorkflowGraph } from '../orchestrator/types';
import { resumeAnalysisWorkflow } from './resume-analysis.workflow';
import { interviewWorkflow } from './interview.workflow';
import { githubWorkflow } from './github.workflow';
import { careerWorkflow } from './career.workflow';
import { completeAnalysisWorkflow } from './complete-analysis.workflow';

export {
  resumeAnalysisWorkflow,
  interviewWorkflow,
  githubWorkflow,
  careerWorkflow,
  completeAnalysisWorkflow,
};

export const WORKFLOW_REGISTRY: Record<string, WorkflowGraph> = {
  [resumeAnalysisWorkflow.id]: resumeAnalysisWorkflow,
  [interviewWorkflow.id]: interviewWorkflow,
  [githubWorkflow.id]: githubWorkflow,
  [careerWorkflow.id]: careerWorkflow,
  [completeAnalysisWorkflow.id]: completeAnalysisWorkflow,
};
