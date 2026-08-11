import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { DbResult, Profile, ProfileInsert, ProfileUpdate } from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database, any, any>;

/** Fetch the current user's profile row. */
export async function getProfile(supabase: Client, userId: string): Promise<DbResult<Profile>> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return toDbResult(data, error, 'Profile not found.');
}

/** Update the current user's profile row. */
export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: ProfileUpdate
): Promise<DbResult<Profile>> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/**
 * Ensures a profile row exists for the given user, creating one if needed.
 *
 * No database trigger auto-creates `profiles` rows on sign-up in this
 * migration set (see the schema notes) — call this once, wherever your app
 * first needs a guaranteed profile (e.g. dashboard entry, onboarding), before
 * writing to any table that has a foreign key to `profiles`.
 */
export async function getOrCreateProfile(
  supabase: Client,
  userId: string,
  defaults: Omit<ProfileInsert, 'id'> = {}
): Promise<DbResult<Profile>> {
  const existing = await getProfile(supabase, userId);
  if (existing.data) {
    return existing;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...defaults })
    .select('*')
    .single();
  return toDbResult(data, error);
}
