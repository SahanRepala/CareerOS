/**
 * contracts/domain/job-description.contract.ts
 */
import type { JobDescription } from '../../lib/db/types';

export interface ParsedJobDescription {
  title: string;
  company: string | null;
  seniority: string | null;
  location: string | null;
  employmentType: string | null;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  rawText: string;
}

export interface JobDescriptionSource {
  jobDescription: JobDescription;
}
