import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { AtsResult, AtsResultInsert, DbResult } from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = any;

/** List all ATS results for a resume version, newest first. */
export async function listAtsResultsForResumeVersion(
  supabase: Client,
  resumeVersionId: string
): Promise<DbResult<AtsResult[]>> {
  const { data, error } = await supabase
    .from('ats_results')
    .select('*')
    .eq('resume_version_id', resumeVersionId)
    .order('created_at', { ascending: false });
  return toDbResult(data, error);
}

/** List all ATS results run against a given job description, newest first. */
export async function listAtsResultsForJobDescription(
  supabase: Client,
  jobDescriptionId: string
): Promise<DbResult<AtsResult[]>> {
  const { data, error } = await supabase
    .from('ats_results')
    .select('*')
    .eq('job_description_id', jobDescriptionId)
    .order('created_at', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single ATS result by id. */
export async function getAtsResult(
  supabase: Client,
  atsResultId: string
): Promise<DbResult<AtsResult>> {
  const { data, error } = await supabase
    .from('ats_results')
    .select('*')
    .eq('id', atsResultId)
    .maybeSingle();
  return toDbResult(data, error, 'ATS result not found.');
}

/** Store a new ATS result. Results are treated as immutable once created. */
export async function createAtsResult(
  supabase: Client,
  input: AtsResultInsert
): Promise<DbResult<AtsResult>> {
  const { data, error } = await supabase.from('ats_results').insert(input).select('*').single();
  return toDbResult(data, error);
}

/** Delete an ATS result. */
export async function deleteAtsResult(supabase: Client, atsResultId: string): Promise<DbResult<null>> {
  const { error } = await supabase.from('ats_results').delete().eq('id', atsResultId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
