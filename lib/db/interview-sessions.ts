import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type {
  DbResult,
  InterviewSession,
  InterviewSessionInsert,
  InterviewSessionUpdate,
} from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database>;

/** List all interview sessions for a user, most recently updated first. */
export async function listInterviewSessions(
  supabase: Client,
  userId: string
): Promise<DbResult<InterviewSession[]>> {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single interview session by id. */
export async function getInterviewSession(
  supabase: Client,
  sessionId: string
): Promise<DbResult<InterviewSession>> {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  return toDbResult(data, error, 'Interview session not found.');
}

/** Start a new interview session. */
export async function createInterviewSession(
  supabase: Client,
  input: InterviewSessionInsert
): Promise<DbResult<InterviewSession>> {
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert(input)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Update an interview session (e.g. status, summary, completed_at). */
export async function updateInterviewSession(
  supabase: Client,
  sessionId: string,
  updates: InterviewSessionUpdate
): Promise<DbResult<InterviewSession>> {
  const { data, error } = await supabase
    .from('interview_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Delete an interview session. */
export async function deleteInterviewSession(
  supabase: Client,
  sessionId: string
): Promise<DbResult<null>> {
  const { error } = await supabase.from('interview_sessions').delete().eq('id', sessionId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
