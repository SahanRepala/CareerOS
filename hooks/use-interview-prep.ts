'use client';

import { useCallback, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Json } from '@/types/database.types';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { useResume } from '@/hooks/use-resume';
import { useGitHubIntelligence } from '@/hooks/use-github-intelligence';
import { jobDescriptionsRepo, interviewSessionsRepo, type JobDescription } from '@/lib/db';
import { summarizeInterview } from '@/lib/interview/summary';
import type {
  AnsweredQuestion,
  InterviewContext,
  InterviewQuestion,
  InterviewSummary,
} from '@/lib/interview/types';

type Phase = 'setup' | 'practicing' | 'finished';

export function useInterviewPrep() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const { profile } = useProfile();
  const { resume } = useResume();
  const github = useGitHubIntelligence();

  const [phase, setPhase] = useState<Phase>('setup');
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnsweredQuestion>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const context: InterviewContext = useMemo(
    () => ({
      profile: profile
        ? { headline: profile.headline, bio: profile.bio, skills: profile.skills ?? [] }
        : null,
      resume: resume ? { title: resume.title, originalFilename: resume.original_filename ?? null } : null,
      jobDescription: jobDescription
        ? { title: jobDescription.title, company: jobDescription.company, description: jobDescription.description }
        : null,
      github: github.analysis
        ? {
            repoName: github.analysis.metadata.name,
            summary: github.analysis.insights.summary,
            techStack: github.analysis.techStack.map((t) => t.label),
            strengths: github.analysis.insights.strengths,
            weaknesses: github.analysis.insights.weaknesses,
            interviewQuestions: github.analysis.insights.interviewQuestions,
            engineeringMaturity: github.analysis.insights.engineeringMaturity.level,
          }
        : null,
    }),
    [profile, resume, jobDescription, github.analysis]
  );

  const hasAnyContext = !!(context.profile?.skills.length || context.resume || context.jobDescription || context.github);

  const saveJobDescription = useCallback(
    async (input: { title: string; company: string; description: string }) => {
      if (!user) return { error: 'You must be signed in.' };
      const result = await jobDescriptionsRepo.createJobDescription(supabase, {
        user_id: user.id,
        title: input.title,
        company: input.company || null,
        description: input.description || null,
      });
      if (result.error) return { error: result.error };
      setJobDescription(result.data);
      return { error: null };
    },
    [supabase, user]
  );

  const clearJobDescription = useCallback(() => setJobDescription(null), []);

  const generate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Could not generate questions.');
        return;
      }

      const generated: InterviewQuestion[] = json.questions;
      setQuestions(generated);
      setAnswers({});
      setPhase('practicing');

      if (user) {
        const created = await interviewSessionsRepo.createInterviewSession(supabase, {
          user_id: user.id,
          job_description_id: jobDescription?.id ?? null,
          session_type: 'mixed',
          status: 'in_progress',
          started_at: new Date().toISOString(),
          summary: { context, questions: generated, answers: {} } as unknown as Json,
        });
        if (created.data) setSessionId(created.data.id);
      }
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  }, [context, jobDescription, supabase, user]);

  const persistProgress = useCallback(
    async (nextAnswers: Record<string, AnsweredQuestion>, status: 'in_progress' | 'completed' = 'in_progress') => {
      if (!sessionId) return;
      const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));
      const summary = summarizeInterview(Object.values(nextAnswers), questionsById);
      await interviewSessionsRepo.updateInterviewSession(supabase, sessionId, {
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        summary: { context, questions, answers: nextAnswers, result: summary } as unknown as Json,
      });
    },
    [sessionId, questions, context, supabase]
  );

  const submitAnswer = useCallback(
    async (question: InterviewQuestion, answerText: string) => {
      setGradingId(question.id);
      setError(null);
      try {
        const res = await fetch('/api/interview-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, answerText, context }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? 'Could not grade this answer.');
          return null;
        }

        const answered: AnsweredQuestion = {
          questionId: question.id,
          answerText,
          feedback: json.feedback,
          answeredAt: new Date().toISOString(),
        };

        const nextAnswers = { ...answers, [question.id]: answered };
        setAnswers(nextAnswers);
        await persistProgress(nextAnswers, 'in_progress');
        return answered;
      } catch {
        setError('Could not reach the server. Please check your connection and try again.');
        return null;
      } finally {
        setGradingId(null);
      }
    },
    [answers, context, persistProgress]
  );

  const finish = useCallback(async () => {
    await persistProgress(answers, 'completed');
    setPhase('finished');
  }, [answers, persistProgress]);

  const restart = useCallback(() => {
    setPhase('setup');
    setQuestions([]);
    setAnswers({});
    setSessionId(null);
    setError(null);
  }, []);

  const summary: InterviewSummary = useMemo(() => {
    const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));
    return summarizeInterview(Object.values(answers), questionsById);
  }, [answers, questions]);

  return {
    phase,
    profile,
    resume,
    github,
    jobDescription,
    saveJobDescription,
    clearJobDescription,
    context,
    hasAnyContext,
    questions,
    answers,
    summary,
    generate,
    generating,
    submitAnswer,
    gradingId,
    finish,
    restart,
    error,
  };
}
