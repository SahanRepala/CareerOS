/**
 * contracts/domain/resume.contract.ts
 *
 * Canonical shape of a parsed resume/candidate, independent of how it was
 * produced (upload + parser today, agent-assisted later) and independent of
 * the Supabase row shape it's persisted as. `lib/db` types describe storage;
 * these types describe meaning, and are what agents actually consume.
 */
import type { Resume, ResumeVersion } from '../../lib/db/types';

export interface CandidateProfile {
  fullName: string | null;
  headline: string | null;
  email: string | null;
  location: string | null;
  links: { label: string; url: string }[];
  summary: string | null;
  skills: string[];
}

export interface ResumeExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  bullets: string[];
}

export interface ResumeEducationEntry {
  id: string;
  institution: string;
  credential: string;
  startDate: string | null;
  endDate: string | null;
}

/** The normalized, structured resume every downstream agent reasons over. */
export interface ParsedResume {
  candidate: CandidateProfile;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  projects: { id: string; name: string; description: string; bullets: string[] }[];
  certifications: string[];
  rawText: string;
}

/** Links a ParsedResume back to its persisted storage rows. */
export interface ResumeSource {
  resume: Resume;
  version: ResumeVersion | null;
}
