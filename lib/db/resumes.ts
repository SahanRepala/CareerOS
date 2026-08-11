import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { DbResult, Resume, ResumeInsert, ResumeUpdate } from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database, any, any>;

/** List all resumes owned by a user, most recently updated first. */
export async function listResumes(supabase: Client, userId: string): Promise<DbResult<Resume[]>> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single resume by id. */
export async function getResume(supabase: Client, resumeId: string): Promise<DbResult<Resume>> {
  const { data, error } = await supabase.from('resumes').select('*').eq('id', resumeId).maybeSingle();
  return toDbResult(data, error, 'Resume not found.');
}

/** Create a new resume. */
export async function createResume(
  supabase: Client,
  input: ResumeInsert
): Promise<DbResult<Resume>> {
  const { data, error } = await supabase.from('resumes').insert(input).select('*').single();
  return toDbResult(data, error);
}

/** Update an existing resume. */
export async function updateResume(
  supabase: Client,
  resumeId: string,
  updates: ResumeUpdate
): Promise<DbResult<Resume>> {
  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', resumeId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Delete a resume (cascades to its resume_versions and ats_results). */
export async function deleteResume(supabase: Client, resumeId: string): Promise<DbResult<null>> {
  const { error } = await supabase.from('resumes').delete().eq('id', resumeId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
