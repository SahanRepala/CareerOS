import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type {
  DbResult,
  LearningRoadmap,
  LearningRoadmapInsert,
  LearningRoadmapUpdate,
} from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database>;

/** List all learning roadmaps for a user, most recently updated first. */
export async function listLearningRoadmaps(
  supabase: Client,
  userId: string
): Promise<DbResult<LearningRoadmap[]>> {
  const { data, error } = await supabase
    .from('learning_roadmaps')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return toDbResult(data, error);
}

/** Fetch a single learning roadmap by id. */
export async function getLearningRoadmap(
  supabase: Client,
  roadmapId: string
): Promise<DbResult<LearningRoadmap>> {
  const { data, error } = await supabase
    .from('learning_roadmaps')
    .select('*')
    .eq('id', roadmapId)
    .maybeSingle();
  return toDbResult(data, error, 'Learning roadmap not found.');
}

/** Create a new learning roadmap. */
export async function createLearningRoadmap(
  supabase: Client,
  input: LearningRoadmapInsert
): Promise<DbResult<LearningRoadmap>> {
  const { data, error } = await supabase
    .from('learning_roadmaps')
    .insert(input)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Update a learning roadmap (e.g. items, status). */
export async function updateLearningRoadmap(
  supabase: Client,
  roadmapId: string,
  updates: LearningRoadmapUpdate
): Promise<DbResult<LearningRoadmap>> {
  const { data, error } = await supabase
    .from('learning_roadmaps')
    .update(updates)
    .eq('id', roadmapId)
    .select('*')
    .single();
  return toDbResult(data, error);
}

/** Delete a learning roadmap. */
export async function deleteLearningRoadmap(
  supabase: Client,
  roadmapId: string
): Promise<DbResult<null>> {
  const { error } = await supabase.from('learning_roadmaps').delete().eq('id', roadmapId);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
