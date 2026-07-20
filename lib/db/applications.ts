import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Application, ApplicationInsert, ApplicationUpdate, DbResult } from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database>;

/** List all applications for a user, most recently updated first. */
export async function listApplications(
  supabase: Client,
  userId: string
): Promise<DbResult<Application[]>> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single application by id. */
export async function getApplication(
  supabase: Client,
  applicationId: string
): Promise<DbResult<Application>> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .maybeSingle();
  return toDbResult(data, error, 'Application not found.');
}

/** Log a new application. */
export async function createApplication(
  supabase: Client,
  input: ApplicationInsert
): Promise<DbResult<Application>> {
  const { data, error } = await supabase.from('applications').insert(input).select('*').single();
  return toDbResult(data, error);
}

/** Update an application (e.g. status, notes). */
export async function updateApplication(
  supabase: Client,
  applicationId: string,
  updates: ApplicationUpdate
): Promise<DbResult<Application>> {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Delete an application. */
export async function deleteApplication(
  supabase: Client,
  applicationId: string
): Promise<DbResult<null>> {
  const { error } = await supabase.from('applications').delete().eq('id', applicationId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
