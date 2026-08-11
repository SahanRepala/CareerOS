import type { PostgrestError } from '@supabase/supabase-js';
import type { DbResult } from '@/lib/db/types';

/**
 * Normalizes a Supabase `{ data, error }` response into the repository
 * layer's `DbResult<T>` shape so every module returns errors the same way.
 */
export function toDbResult<T>(
  data: T | null,
  error: PostgrestError | null,
  emptyMessage = 'No matching record was found.'
): DbResult<T> {
  if (error) {
    return { data: null, error: error.message };
  }
  if (data === null) {
    return { data: null, error: emptyMessage };
  }
  return { data, error: null };
}
