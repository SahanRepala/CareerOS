'use client';

import { useCallback, useState } from 'react';
import { parseGitHubRepoUrl } from '@/lib/github/parse-url';
import type { RepoAnalysis } from '@/lib/github/types';

interface UseGitHubIntelligenceResult {
  analysis: RepoAnalysis | null;
  loading: boolean;
  error: string | null;
  analyze: (url: string) => Promise<void>;
  reset: () => void;
}

/**
 * Drives the GitHub Intelligence page: validates a pasted repository URL,
 * calls the `/api/github-intelligence` backend endpoint, and exposes the
 * resulting metadata/tech-stack/tree analysis along with loading and error
 * state, mirroring the shape of the other data-fetching hooks in the app.
 */
export function useGitHubIntelligence(): UseGitHubIntelligenceResult {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (url: string) => {
    const validation = parseGitHubRepoUrl(url);
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/github-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.');
        setAnalysis(null);
        return;
      }

      setAnalysis(json as RepoAnalysis);
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, analyze, reset };
}
