'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderGit2,
  GraduationCap,
  Loader2,
  Save,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { createResumeVersion } from '@/lib/db/resume-versions';
import { resumeData as initialResumeData } from '@/lib/mock/resume';
import { cn } from '@/lib/utils';

type FileState = 'empty' | 'uploading' | 'uploaded';

export default function ResumePage() {
  const { user } = useAuth();
  const [fileState, setFileState] = useState<FileState>('empty');
  const [fileData, setFileData] = useState<{ name: string; size: number; path: string } | null>(null);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', { description: 'Maximum size is 10MB.' });
      return;
    }
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast.error('Invalid file type', { description: 'Only PDF and DOCX are supported.' });
      return;
    }

    setFileState('uploading');
    try {
      const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: resume, error: dbError } = await (supabase.from('resumes') as any).insert({
        user_id: user.id,
        title: file.name,
        file_path: filePath,
        file_name: file.name
      }).select().single();

      if (dbError) throw dbError;

      // Call FastAPI backend
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Parsing failed');
      const { data: parsedData } = await response.json();
      
      // Save parsedData to resume_versions
      await createResumeVersion(supabase as any, {
          resume_id: resume.id,
          user_id: user.id,
          content: parsedData as any
      });
      
      setResumeData(parsedData);
      setFileData({ name: file.name, size: file.size, path: filePath });
      setFileState('uploaded');
      toast.success('Resume uploaded and parsed successfully.');
    } catch (e) {
      console.error(e);
      setFileState('empty');
      toast.error('Upload or parsing failed', { description: 'Please try again.' });
    }
  };

  const handleDelete = async () => {
    if (!fileData || !user) return;
    try {
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([fileData.path]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from('resumes').delete().eq('file_path', fileData.path);
      if (dbError) throw dbError;

      setFileData(null);
      setFileState('empty');
      toast.success('Resume deleted.');
    } catch (e) {
      toast.error('Failed to delete resume.');
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Resume saved', {
        description: 'A new version was added to your history.',
      });
    }, 800);
  };

  return (
    <>
      <DashboardHeader
        title="Resume"
        subtitle="Upload, edit, and save tailored versions of your resume."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload card */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Upload resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <AnimatePresence mode="wait">
              {fileState === 'empty' && (
                <motion.button
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    'flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
                    dragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Drag & drop your resume
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or click to browse · PDF, DOCX up to 5MB
                  </p>
                </motion.button>
              )}

              {fileState === 'uploading' && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-10 text-center"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="mt-3 text-sm font-medium text-foreground">Parsing your resume…</p>
                  <p className="mt-1 text-xs text-muted-foreground">Extracting sections</p>
                </motion.div>
              )}

              {fileState === 'uploaded' && fileData && (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {fileData.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(fileData.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      onClick={handleDelete}
                      className="flex-none rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() => inputRef.current?.click()}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                      Replace
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Pro tip
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                PDFs parse most reliably. Avoid scanned images and two-column layouts for best ATS
                scores.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Editable sections */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 overflow-x-auto">
              <TabsTrigger value="summary" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Summary
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5" /> Projects
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Skills
              </TabsTrigger>
              <TabsTrigger value="certs" className="gap-1.5">
                <Award className="h-3.5 w-3.5" /> Certificates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Professional summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    defaultValue={resumeData.summary.text}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {resumeData.summary.text.length} characters · aim for 350–500
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              {resumeData.experience.map((exp) => (
                <Card key={exp.id} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">{exp.company}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Role</Label>
                        <Input defaultValue={exp.role} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Start</Label>
                          <Input defaultValue={exp.start} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">End</Label>
                          <Input defaultValue={exp.end} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Bullets (one per line)</Label>
                      <Textarea
                        defaultValue={exp.bullets.join('\n')}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              {resumeData.education.map((ed) => (
                <Card key={ed.id} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">{ed.school}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Degree</Label>
                      <Input defaultValue={ed.degree} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Field</Label>
                      <Input defaultValue={ed.field} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Start</Label>
                      <Input defaultValue={ed.start} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">End</Label>
                      <Input defaultValue={ed.end} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {resumeData.projects.map((p) => (
                <Card key={p.id} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        defaultValue={p.description}
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <Badge key={s} variant="secondary" className="font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((s) => (
                      <Badge
                        key={s.id}
                        variant="outline"
                        className="gap-1.5 py-1.5 pl-2.5 pr-1 font-normal"
                      >
                        {s.name}
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {s.level}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certs" className="space-y-4">
              {resumeData.certificates.map((c) => (
                <Card key={c.id} className="shadow-card">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Award className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.issuer} · {c.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-5 flex items-center justify-end gap-3">
            <Button variant="outline" className="rounded-xl">
              Discard
            </Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Saving…' : 'Save resume'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
