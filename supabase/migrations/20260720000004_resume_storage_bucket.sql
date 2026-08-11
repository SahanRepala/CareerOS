-- CareerOS database foundation: resume file storage
-- Creates a private Storage bucket for uploaded resume files (PDF/DOCX) and
-- restricts access so each user can only read/write objects under their own
-- `${user_id}/...` folder. Objects are addressed as
-- `<user_id>/<uuid>-<original filename>`, so `storage.foldername(name)[1]`
-- is always the owning user's id.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  10485760, -- 10 MB, enforced again in the app for a friendlier error message
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "resume_files_select_own"
  on storage.objects for select
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "resume_files_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "resume_files_update_own"
  on storage.objects for update
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "resume_files_delete_own"
  on storage.objects for delete
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
