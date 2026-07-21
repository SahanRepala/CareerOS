import { Json } from '@/types/database.types';

export interface ResumeSkill {
  id: string;
  name: string;
  level: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  stack: string[];
}

export interface ResumeCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  summary: { text: string };
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  certificates: ResumeCertificate[];
}
