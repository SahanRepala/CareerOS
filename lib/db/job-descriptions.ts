import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type {
  DbResult,
  JobDescription,
  JobDescriptionInsert,
  JobDescriptionUpdate,
} from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database>;

/** List all job descriptions saved by a user, most recently updated first. */
export async function listJobDescriptions(
  supabase: Client,
  userId: string
): Promise<DbResult<JobDescription[]>> {
  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single job description by id. */
export async function getJobDescription(
  supabase: Client,
  jobDescriptionId: string
): Promise<DbResult<JobDescription>> {
  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('id', jobDescriptionId)
    .maybeSingle();
  return toDbResult(data, error, 'Job description not found.');
}

/** Save a new job description. */
export async function createJobDescription(
  supabase: Client,
  input: JobDescriptionInsert
): Promise<DbResult<JobDescription>> {
  const { data, error } = await supabase.from('job_descriptions').insert(input).select('*').single();
  return toDbResult(data, error);
}

/** Update an existing job description. */
export async function updateJobDescription(
  supabase: Client,
  jobDescriptionId: string,
  updates: JobDescriptionUpdate
): Promise<DbResult<JobDescription>> {
  const { data, error } = await supabase
    .from('job_descriptions')
    .update(updates)
    .eq('id', jobDescriptionId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Delete a job description. */
export async function deleteJobDescription(
  supabase: Client,
  jobDescriptionId: string
): Promise<DbResult<null>> {
  const { error } = await supabase.from('job_descriptions').delete().eq('id', jobDescriptionId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
