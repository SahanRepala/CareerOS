import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { DbResult, GeneratedResume, GeneratedResumeInsert } from '@/lib/db/types';
import { toDbResult } from '@/lib/db/result';

type Client = SupabaseClient<Database>;

export async function createGeneratedResume(
  supabase: Client,
  input: GeneratedResumeInsert
): Promise<DbResult<GeneratedResume>> {
  const { data, error } = await supabase.from('generated_resumes').insert(input).select('*').single();
  return toDbResult(data, error);
}

export async function getLatestGeneratedResume(
    supabase: Client,
    resumeVersionId: string,
    templateName: string
): Promise<DbResult<GeneratedResume>> {
    const { data, error } = await supabase
        .from('generated_resumes')
        .select('*')
        .eq('resume_version_id', resumeVersionId)
        .eq('template_name', templateName)
        .order('created_at', { ascending: false })
        .maybeSingle();
    return toDbResult(data, error);
}
