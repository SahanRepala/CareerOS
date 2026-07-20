'use client';

import { useContext } from 'react';
import { AuthContext } from '@/components/providers/auth-provider';

/**
 * Access the current auth state (user, session, loading) and auth actions
 * (signUp, signIn, signOut). Must be used within <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
