'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { profilesRepo, type DbResult, type Profile, type ProfileUpdate } from '@/lib/db';

type UseProfileResult = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<DbResult<Profile>>;
};

/**
 * Ensures the signed-in user has a `profiles` row (creating one on first
 * login if it doesn't exist yet — see `getOrCreateProfile`), then loads and
 * exposes it. Call `updateProfile` to persist edits back to Supabase.
 */
export function useProfile(): UseProfileResult {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await profilesRepo.getOrCreateProfile(supabase, user.id, {
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setProfile(result.data);
      setError(null);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(
    async (updates: ProfileUpdate): Promise<DbResult<Profile>> => {
      if (!user) {
        return { data: null, error: 'You must be signed in to update your profile.' };
      }
      const result = await profilesRepo.updateProfile(supabase, user.id, updates);
      if (result.data) {
        setProfile(result.data);
      }
      return result;
    },
    [supabase, user]
  );

  return { profile, loading, error, refetch: load, updateProfile };
}
