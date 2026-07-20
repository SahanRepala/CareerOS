import type { Database } from '@/types/database.types';

type Tables = Database['public']['Tables'];

export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type Resume = Tables['resumes']['Row'];
export type ResumeInsert = Tables['resumes']['Insert'];
export type ResumeUpdate = Tables['resumes']['Update'];

export type ResumeVersion = Tables['resume_versions']['Row'];
export type ResumeVersionInsert = Tables['resume_versions']['Insert'];
export type ResumeVersionUpdate = Tables['resume_versions']['Update'];

export type JobDescription = Tables['job_descriptions']['Row'];
export type JobDescriptionInsert = Tables['job_descriptions']['Insert'];
export type JobDescriptionUpdate = Tables['job_descriptions']['Update'];

export type AtsResult = Tables['ats_results']['Row'];
export type AtsResultInsert = Tables['ats_results']['Insert'];

export type InterviewSession = Tables['interview_sessions']['Row'];
export type InterviewSessionInsert = Tables['interview_sessions']['Insert'];
export type InterviewSessionUpdate = Tables['interview_sessions']['Update'];

export type LearningRoadmap = Tables['learning_roadmaps']['Row'];
export type LearningRoadmapInsert = Tables['learning_roadmaps']['Insert'];
export type LearningRoadmapUpdate = Tables['learning_roadmaps']['Update'];

export type GeneratedResume = Tables['generated_resumes']['Row'];
export type GeneratedResumeInsert = Tables['generated_resumes']['Insert'];
export type GeneratedResumeUpdate = Tables['generated_resumes']['Update'];

export type InterviewQuestion = Tables['interview_questions']['Row'];
export type InterviewQuestionInsert = Tables['interview_questions']['Insert'];
export type InterviewQuestionUpdate = Tables['interview_questions']['Update'];

export type Application = Tables['applications']['Row'];
export type ApplicationInsert = Tables['applications']['Insert'];
export type ApplicationUpdate = Tables['applications']['Update'];

/** Standard result shape returned by every repository function. */
export type DbResult<T> = { data: T; error: null } | { data: null; error: string };
