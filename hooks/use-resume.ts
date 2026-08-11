'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadFileWithProgress } from '@/lib/supabase/storage-upload';
import { useAuth } from '@/hooks/use-auth';
import { resumesRepo, type Resume } from '@/lib/db';

export const RESUME_STORAGE_BUCKET = 'resumes';
export const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_RESUME_MIME_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
};

/** Friendly, user-facing validation only — the storage bucket enforces the same limits server-side. */
function validateResumeFile(file: File): string | null {
  if (!(file.type in ALLOWED_RESUME_MIME_TYPES)) {
    return 'Only PDF and DOCX files are supported.';
  }
  if (file.size > MAX_RESUME_FILE_SIZE) {
    return 'That file is too large. The maximum size is 10 MB.';
  }
  return null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

type UseResumeResult = {
  resume: Resume | null;
  loading: boolean;
  uploading: boolean;
  progress: number;
  error: string | null;
  upload: (file: File) => Promise<{ error: string | null }>;
  remove: () => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
};

/**
 * Loads the authenticated user's uploaded resume file (metadata row from
 * `resumes`, backed by an object in the `resumes` Storage bucket), and
 * exposes `upload`/`remove` to manage it. Uploading when a resume already
 * exists replaces it — the previous file is deleted from Storage once the
 * new one is safely recorded.
 */
export function useResume(): UseResumeResult {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setResume(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await resumesRepo.listResumes(supabase, user.id);

    if (result.data) {
      setResume(result.data[0] ?? null);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = useCallback(
    async (file: File): Promise<{ error: string | null }> => {
      if (!user) {
        return { error: 'You must be signed in to upload a resume.' };
      }

      const validationError = validateResumeFile(file);
      if (validationError) {
        return { error: validationError };
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return { error: 'Your session has expired. Please sign in again.' };
        }

        const previous = resume;
        const storagePath = `${user.id}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;

        await uploadFileWithProgress({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          accessToken: session.access_token,
          bucket: RESUME_STORAGE_BUCKET,
          path: storagePath,
          file,
          onProgress: (p) => setProgress(p.percent),
        });

        const metadata = {
          user_id: user.id,
          title: file.name.replace(/\.[^/.]+$/, '') || file.name,
          is_primary: true,
          filename: storagePath.split('/').pop()!,
          original_filename: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          uploaded_at: new Date().toISOString(),
        };

        const result = previous
          ? await resumesRepo.updateResume(supabase, previous.id, metadata)
          : await resumesRepo.createResume(supabase, metadata);

        if (result.error) {
          // Metadata failed to save — remove the file we just uploaded so it
          // doesn't linger as an orphaned object with no matching row.
          await supabase.storage.from(RESUME_STORAGE_BUCKET).remove([storagePath]);
          setError(result.error);
          return { error: result.error };
        }

        if (previous?.storage_path && previous.storage_path !== storagePath) {
          await supabase.storage.from(RESUME_STORAGE_BUCKET).remove([previous.storage_path]);
        }

        setResume(result.data);
        setProgress(100);
        return { error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setError(message);
        return { error: message };
      } finally {
        setUploading(false);
      }
    },
    [supabase, user, resume]
  );

  const remove = useCallback(async (): Promise<{ error: string | null }> => {
    if (!resume) return { error: null };

    setError(null);

    if (resume.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(RESUME_STORAGE_BUCKET)
        .remove([resume.storage_path]);

      if (storageError) {
        setError(storageError.message);
        return { error: storageError.message };
      }
    }

    const result = await resumesRepo.deleteResume(supabase, resume.id);
    if (result.error) {
      setError(result.error);
      return { error: result.error };
    }

    setResume(null);
    setProgress(0);
    return { error: null };
  }, [supabase, resume]);

  return { resume, loading, uploading, progress, error, upload, remove, refetch: load };
}
