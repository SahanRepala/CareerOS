export interface ResumeContent {
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  graduationDate: string;
}

export interface Resume {
  id: string;
  candidateId: string;
  rawContent: string;
  parsedContent: ResumeContent;
  version: string;
  createdAt: Date;
}

export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  githubUsername?: string;
  createdAt: Date;
}

export interface JobDescription {
  id: string;
  company: string;
  title: string;
  content: string;
  requirements: string[];
  createdAt: Date;
}

export interface AnalysisResult {
  score: number;
  details: Record<string, string>;
  recommendations: string[];
}

export interface Analysis {
  id: string;
  targetId: string;
  type: 'ATS' | 'SKILL_GAP' | 'SALARY' | 'QUALITY';
  result: AnalysisResult;
  createdAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  status: 'initialized' | 'scheduled' | 'executing' | 'completed' | 'failed';
  startedAt: Date;
  finishedAt?: Date;
}

export interface CapabilityExecution {
  id: string;
  capabilityId: string;
  workflowExecutionId: string;
  status: 'initialized' | 'executing' | 'completed' | 'failed';
  startedAt: Date;
  finishedAt?: Date;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  capabilityExecutionId: string;
  status: 'initialized' | 'executing' | 'completed' | 'failed';
  startedAt: Date;
  finishedAt?: Date;
}

export interface Report {
  id: string;
  type: string;
  content: string;
  createdAt: Date;
}

export interface InterviewPack {
  id: string;
  jobDescriptionId: string;
  questions: string[];
  tips: string[];
  createdAt: Date;
}

export interface GitHubProfile {
  id: string;
  username: string;
  repositories: string[];
  createdAt: Date;
}

export interface CoverLetter {
  id: string;
  candidateId: string;
  jobDescriptionId: string;
  content: string;
  createdAt: Date;
}
