import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { DbResult, ResumeVersion, ResumeVersionInsert, ResumeVersionUpdate } from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database>;

/** List all versions of a resume, newest version first. */
export async function listResumeVersions(
  supabase: Client,
  resumeId: string
): Promise<DbResult<ResumeVersion[]>> {
  const { data, error } = await supabase
    .from('resume_versions')
    .select('*')
    .eq('resume_id', resumeId)
    .order('version_number', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single resume version by id. */
export async function getResumeVersion(
  supabase: Client,
  versionId: string
): Promise<DbResult<ResumeVersion>> {
  const { data, error } = await supabase
    .from('resume_versions')
    .select('*')
    .eq('id', versionId)
    .maybeSingle();
  return toDbResult(data, error, 'Resume version not found.');
}

/** Create a new resume version. */
export async function createResumeVersion(
  supabase: Client,
  input: ResumeVersionInsert
): Promise<DbResult<ResumeVersion>> {
  const { data, error } = await supabase.from('resume_versions').insert(input).select('*').single();
  return toDbResult(data, error);
}

/** Update an existing resume version's content. */
export async function updateResumeVersion(
  supabase: Client,
  versionId: string,
  updates: ResumeVersionUpdate
): Promise<DbResult<ResumeVersion>> {
  const { data, error } = await supabase
    .from('resume_versions')
    .update(updates)
    .eq('id', versionId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Delete a resume version. */
export async function deleteResumeVersion(
  supabase: Client,
  versionId: string
): Promise<DbResult<null>> {
  const { error } = await supabase.from('resume_versions').delete().eq('id', versionId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
