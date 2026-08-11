'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResume, ALLOWED_RESUME_MIME_TYPES } from '@/hooks/use-resume';
import { resumeData } from '@/lib/mock/resume';
import { cn, formatFileSize } from '@/lib/utils';

export default function ResumePage() {
  const { resume, loading, uploading, progress, error, upload, remove } = useResume();
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileState: 'loading' | 'empty' | 'uploading' | 'uploaded' = loading
    ? 'loading'
    : uploading
      ? 'uploading'
      : resume
        ? 'uploaded'
        : 'empty';

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const { error: uploadError } = await upload(file);
    if (inputRef.current) inputRef.current.value = '';

    if (uploadError) {
      toast.error('Upload failed', { description: uploadError });
      return;
    }
    toast.success('Resume uploaded', {
      description: `${file.name} was saved to your account.`,
    });
  };

  const handleRemove = async () => {
    const { error: removeError } = await remove();
    if (removeError) {
      toast.error('Could not delete resume', { description: removeError });
      return;
    }
    toast.success('Resume deleted');
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
              {fileState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">Loading your resume…</p>
                </motion.div>
              )}

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
                    or click to browse · PDF, DOCX up to 10MB
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
                  <p className="mt-3 text-sm font-medium text-foreground">Uploading your resume…</p>
                  <Progress value={progress} className="mt-4 h-1.5 w-full max-w-[180px]" />
                  <p className="mt-1.5 text-xs text-muted-foreground">{progress}%</p>
                </motion.div>
              )}

              {fileState === 'uploaded' && resume && (
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
                        {resume.original_filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resume.file_size !== null ? formatFileSize(resume.file_size) : '—'} ·{' '}
                        {(resume.file_type && ALLOWED_RESUME_MIME_TYPES[resume.file_type]) || 'File'}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Uploaded{' '}
                        {resume.uploaded_at
                          ? new Date(resume.uploaded_at).toLocaleDateString()
                          : ''}
                      </div>
                    </div>
                    <button
                      onClick={handleRemove}
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

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-rose-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                <p className="text-xs">{error}</p>
              </div>
            )}

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
                        <Label htmlFor={`exp-role-${exp.id}`} className="text-xs">Role</Label>
                        <Input id={`exp-role-${exp.id}`} defaultValue={exp.role} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor={`exp-start-${exp.id}`} className="text-xs">Start</Label>
                          <Input id={`exp-start-${exp.id}`} defaultValue={exp.start} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`exp-end-${exp.id}`} className="text-xs">End</Label>
                          <Input id={`exp-end-${exp.id}`} defaultValue={exp.end} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`exp-bullets-${exp.id}`} className="text-xs">Bullets (one per line)</Label>
                      <Textarea
                        id={`exp-bullets-${exp.id}`}
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
                      <Label htmlFor={`edu-degree-${ed.id}`} className="text-xs">Degree</Label>
                      <Input id={`edu-degree-${ed.id}`} defaultValue={ed.degree} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`edu-field-${ed.id}`} className="text-xs">Field</Label>
                      <Input id={`edu-field-${ed.id}`} defaultValue={ed.field} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`edu-start-${ed.id}`} className="text-xs">Start</Label>
                      <Input id={`edu-start-${ed.id}`} defaultValue={ed.start} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`edu-end-${ed.id}`} className="text-xs">End</Label>
                      <Input id={`edu-end-${ed.id}`} defaultValue={ed.end} />
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
