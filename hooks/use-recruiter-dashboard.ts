'use client';

import { useMemo } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useGitHubIntelligence } from '@/hooks/use-github-intelligence';
import { buildRecruiterAssessment, type RecruiterAssessment } from '@/lib/recruiter/recruiter-assessment';

interface UseRecruiterDashboardResult {
  /** Candidate identity, reused from the existing Profile module. */
  profile: ReturnType<typeof useProfile>['profile'];
  profileLoading: boolean;
  profileError: string | null;

  /** Live GitHub Intelligence analysis, reused verbatim from the existing module. */
  repoUrl: string;
  repoAnalysis: ReturnType<typeof useGitHubIntelligence>['analysis'];
  repoLoading: boolean;
  repoError: string | null;
  analyzeRepo: (url: string) => Promise<void>;
  resetRepo: () => void;

  /** The combined recruiter-facing assessment, recomputed only from data above. */
  assessment: RecruiterAssessment;
}

/**
 * Drives the Recruiter Dashboard. Does not fetch or compute anything new on
 * its own — it wires together the existing `useProfile` and
 * `useGitHubIntelligence` hooks (the same ones the Profile and GitHub
 * Intelligence pages use) and folds their results into a single
 * `RecruiterAssessment` via the pure `buildRecruiterAssessment` combinator.
 */
export function useRecruiterDashboard(): UseRecruiterDashboardResult {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { analysis, loading: repoLoading, error: repoError, analyze, reset } = useGitHubIntelligence();

  const assessment = useMemo(() => buildRecruiterAssessment(analysis?.insights ?? null), [analysis]);

  return {
    profile,
    profileLoading,
    profileError,
    repoUrl: profile?.github_url ?? '',
    repoAnalysis: analysis,
    repoLoading,
    repoError,
    analyzeRepo: analyze,
    resetRepo: reset,
    assessment,
  };
}
