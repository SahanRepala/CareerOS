'use client';

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { getAuthErrorMessage } from '@/lib/supabase/errors';

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: string | null; requiresEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signUp: async (email, password, fullName) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: fullName ? { data: { full_name: fullName } } : undefined,
          });
          if (error) {
            return { error: getAuthErrorMessage(error), requiresEmailConfirmation: false };
          }
          // If confirmations are enabled, Supabase returns a user but no
          // session until the user clicks the confirmation link.
          const requiresEmailConfirmation = !data.session;
          return { error: null, requiresEmailConfirmation };
        } catch (err) {
          return { error: getAuthErrorMessage(err), requiresEmailConfirmation: false };
        }
      },
      signIn: async (email, password) => {
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          return { error: error ? getAuthErrorMessage(error) : null };
        } catch (err) {
          return { error: getAuthErrorMessage(err) };
        }
      },
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          return { error: error ? getAuthErrorMessage(error) : null };
        } catch (err) {
          return { error: getAuthErrorMessage(err) };
        }
      },
    }),
    [session, loading, supabase]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
