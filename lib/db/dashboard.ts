import { createClient } from '@/lib/supabase/client';

export async function getDashboardStats(userId: string) {
  const supabase = createClient();
  // Aggregate stats from all modules efficiently
  const [resumes, ats, interviews, pdfs, roadmaps, jobDescriptions] = await Promise.all([
    supabase.from('resumes').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('ats_results').select('score').eq('user_id', userId),
    supabase.from('interview_sessions').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('generated_resumes').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('learning_roadmaps').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('job_descriptions').select('id', { count: 'exact' }).eq('user_id', userId),
  ]);

  // Type assertion for Supabase data to fix 'never' inference
  const atsData = ats.data as { score: number }[] | null;
  const atsScores = atsData?.map((r) => Number(r.score)) || [];
  const avgAtsScore = atsScores.length > 0 ? atsScores.reduce((a: number, b: number) => a + b, 0) / atsScores.length : 0;

  // ...
  const { data: recentActivity } = await supabase
      .from('resumes')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

  return {
    resumesCount: resumes.count || 0,
    atsAvgScore: Math.round(avgAtsScore),
    interviewsCount: interviews.count || 0,
    pdfsCount: pdfs.count || 0,
    roadmapsCount: roadmaps.count || 0,
    jobDescriptionsCount: jobDescriptions.count || 0,
    recentActivity: recentActivity || []
  };
}
