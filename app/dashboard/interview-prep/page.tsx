'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  FileText,
  Github,
  Lightbulb,
  Loader2,
  MessageSquare,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DynamicIcon } from '@/components/shared/dynamic-icon';
import { ScoreRing } from '@/components/shared/score-ring';
import { AnalysisProgress, type AnalysisModule } from '@/components/shared/analysis-progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInterviewPrep } from '@/hooks/use-interview-prep';
import { interviewCategoryMeta } from '@/lib/interview/types';
import type { Difficulty, InterviewQuestion, QuestionCategory } from '@/lib/interview/types';
import { cn } from '@/lib/utils';

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-rose-50 text-rose-600',
};

const sourceLabels: Record<string, string> = {
  resume: 'From your resume',
  'job-description': 'From the job description',
  github: 'From your GitHub project',
  general: 'General practice',
};

const generationModules: AnalysisModule[] = [
  { id: 'context', label: 'Reading your profile & resume', duration: 600 },
  { id: 'jd', label: 'Matching against job description', duration: 550 },
  { id: 'questions', label: 'Drafting tailored questions', detail: 'Behavioral, technical, and situational' },
];

export default function InterviewPrepPage() {
  const {
    phase,
    profile,
    resume,
    github,
    jobDescription,
    saveJobDescription,
    clearJobDescription,
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
  } = useInterviewPrep();

  const [repoUrl, setRepoUrl] = useState(profile?.github_url ?? '');
  const [jdTitle, setJdTitle] = useState('');
  const [jdCompany, setJdCompany] = useState('');
  const [jdDescription, setJdDescription] = useState('');

  const [category, setCategory] = useState<QuestionCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [active, setActive] = useState<InterviewQuestion | null>(null);
  const [draftAnswer, setDraftAnswer] = useState('');

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (category === 'all' || q.category === category) &&
          (difficulty === 'all' || q.difficulty === difficulty)
      ),
    [questions, category, difficulty]
  );

  const openQuestion = (q: InterviewQuestion) => {
    setActive(q);
    setDraftAnswer(answers[q.id]?.answerText ?? '');
  };

  const handleGetFeedback = async () => {
    if (!active) return;
    const result = await submitAnswer(active, draftAnswer);
    if (result) toast.success('AI feedback ready');
  };

  const handleAnalyzeRepo = () => {
    if (!repoUrl.trim()) return;
    github.analyze(repoUrl.trim());
  };

  const handleSaveJd = async () => {
    if (!jdTitle.trim()) {
      toast.error('Add a role title for the job description.');
      return;
    }
    const { error: jdError } = await saveJobDescription({
      title: jdTitle.trim(),
      company: jdCompany.trim(),
      description: jdDescription.trim(),
    });
    if (jdError) toast.error(jdError);
    else toast.success('Job description saved');
  };

  const activeAnswer = active ? answers[active.id] : null;

  return (
    <>
      <DashboardHeader
        title="Interview Prep"
        subtitle="Personalized questions and AI feedback, built from your Resume, GitHub Intelligence, and target job description."
      />

      {phase === 'setup' && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Resume signal */}
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Resume & Profile</h3>
                  <p className="text-xs text-muted-foreground">Reused from your Resume and Profile pages.</p>
                </div>
              </div>
              {resume ? (
                <p className="mt-3 text-xs text-foreground/80">
                  Using <span className="font-medium">{resume.original_filename ?? resume.title}</span>
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">No resume uploaded yet — skills below will still be used.</p>
              )}
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  Add skills on your Profile page for sharper resume-based questions.
                </p>
              )}
            </CardContent>
          </Card>

          {/* GitHub signal */}
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <Github className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">GitHub Intelligence</h3>
                  <p className="text-xs text-muted-foreground">Paste a repo to get project-specific questions.</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  aria-label="GitHub repository URL"
                  className="h-9 text-sm"
                />
                <Button size="sm" className="h-9 rounded-lg" onClick={handleAnalyzeRepo} disabled={github.loading}>
                  {github.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Analyze'}
                </Button>
              </div>
              {github.error && <p className="mt-2 text-xs text-rose-600">{github.error}</p>}
              {github.analysis && (
                <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-foreground">{github.analysis.metadata.fullName}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {github.analysis.insights.summary}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job description signal */}
          <Card className="shadow-card lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Target className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Target Job Description</h3>
                  <p className="text-xs text-muted-foreground">Optional — sharpens role-specific questions.</p>
                </div>
              </div>

              {jobDescription ? (
                <div className="mt-3 flex items-start justify-between rounded-lg border border-border bg-muted/30 p-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {jobDescription.title}
                      {jobDescription.company ? ` · ${jobDescription.company}` : ''}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {jobDescription.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearJobDescription}>
                    Change
                  </Button>
                </div>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="jd-title" className="text-xs">Role title</Label>
                    <Input id="jd-title" value={jdTitle} onChange={(e) => setJdTitle(e.target.value)} placeholder="Senior Frontend Engineer" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="jd-company" className="text-xs">Company (optional)</Label>
                    <Input id="jd-company" value={jdCompany} onChange={(e) => setJdCompany(e.target.value)} placeholder="Acme Inc." className="mt-1 h-9 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="jd-description" className="text-xs">Description (optional)</Label>
                    <textarea
                      id="jd-description"
                      value={jdDescription}
                      onChange={(e) => setJdDescription(e.target.value)}
                      rows={3}
                      placeholder="Paste the job description here…"
                      className="mt-1 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={handleSaveJd}>
                      Save job description
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
            <Button size="lg" className="w-full rounded-lg" onClick={generate} disabled={generating}>
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate personalized interview
            </Button>
            {!hasAnyContext && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                No profile, resume, GitHub, or job description data found yet — you&apos;ll still get a solid general practice set.
              </p>
            )}
            <AnimatePresence>
              {generating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4"
                >
                  <AnalysisProgress
                    modules={generationModules}
                    mode="live"
                    title="Building your interview"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {phase === 'practicing' && (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={category} onValueChange={(v) => setCategory(v as QuestionCategory | 'all')}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All</TabsTrigger>
                {Object.entries(interviewCategoryMeta).map(([id, meta]) => (
                  <TabsTrigger key={id} value={id} className="gap-1.5">
                    {meta.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty | 'all')}>
                <TabsList>
                  <TabsTrigger value="all">Any</TabsTrigger>
                  {difficulties.map((d) => (
                    <TabsTrigger key={d.id} value={d.id}>
                      {d.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={finish}>
                <Trophy className="mr-1.5 h-3.5 w-3.5" />
                Finish & see results ({Object.keys(answers).length}/{questions.length})
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
              No questions match these filters. Try widening your selection.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((q, i) => {
                const meta = interviewCategoryMeta[q.category];
                const answered = answers[q.id];
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card
                      className="group h-full cursor-pointer shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                      onClick={() => openQuestion(q)}
                    >
                      <CardContent className="flex h-full flex-col p-5">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg',
                              meta.accent === 'primary'
                                ? 'bg-primary/10 text-primary'
                                : meta.accent === 'secondary'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-accent/10 text-accent'
                            )}
                          >
                            <DynamicIcon name={meta.icon} className="h-4 w-4" />
                          </span>
                          <div className="flex items-center gap-1.5">
                            {answered && (
                              <Badge className="bg-emerald-100 font-normal text-emerald-700">
                                {answered.feedback.score}/100
                              </Badge>
                            )}
                            <Badge variant="secondary" className={cn('font-normal', difficultyStyles[q.difficulty])}>
                              {q.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-foreground">{q.title}</h3>
                        <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                          {q.prompt}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {sourceLabels[q.source]}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                            {answered ? <Check className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                            {answered ? 'Answered' : 'Open'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {phase === 'finished' && (
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-around">
              <ScoreRing value={summary.overallScore} label="Overall score" sublabel={`${summary.questionsAnswered} answered`} />
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-emerald-600">Strengths</p>
                  <ul className="mt-2 space-y-1.5">
                    {summary.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-1.5 text-xs text-foreground/90">
                        <Check className="mt-0.5 h-3 w-3 flex-none text-emerald-600" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-600">Weaknesses</p>
                  <ul className="mt-2 space-y-1.5">
                    {summary.weaknesses.length === 0 ? (
                      <li className="text-xs text-muted-foreground">No recurring weaknesses detected.</li>
                    ) : (
                      summary.weaknesses.map((w) => (
                        <li key={w} className="flex items-start gap-1.5 text-xs text-foreground/90">
                          <ArrowUpRight className="mt-0.5 h-3 w-3 flex-none text-amber-600" />
                          {w}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {summary.suggestedTopics.length > 0 && (
            <Card className="shadow-card">
              <CardContent className="p-5">
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Suggested topics to improve
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {summary.suggestedTopics.map((t) => (
                    <Badge key={t} variant="outline" className="font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3 sm:grid-cols-4">
            {Object.entries(summary.byCategory).map(([cat, stats]) => (
              <Card key={cat} className="shadow-card">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">{interviewCategoryMeta[cat as QuestionCategory].label}</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {stats.avgScore !== null ? `${stats.avgScore}` : '—'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{stats.count} answered</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="rounded-lg" onClick={restart}>
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Start a new interview
            </Button>
          </div>
        </div>
      )}

      {/* Question modal */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {interviewCategoryMeta[active.category].label}
                  </Badge>
                  <Badge variant="secondary" className={cn('font-normal', difficultyStyles[active.difficulty])}>
                    {active.difficulty}
                  </Badge>
                  <Badge variant="outline" className="font-normal text-muted-foreground">
                    {sourceLabels[active.source]}
                  </Badge>
                </div>
                <DialogTitle className="text-lg">{active.title}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">{active.prompt}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Hint
                  </p>
                  <p className="mt-1 text-xs text-amber-800/90">{active.hint}</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Your answer</p>
                  <textarea
                    value={draftAnswer}
                    onChange={(e) => setDraftAnswer(e.target.value)}
                    placeholder="Type or paste your answer here…"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg"
                    onClick={handleGetFeedback}
                    disabled={gradingId === active.id}
                  >
                    {gradingId === active.id ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Get AI feedback
                  </Button>
                </div>

                <AnimatePresence>
                  {activeAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                          <Sparkles className="h-4 w-4" />
                          AI feedback
                        </p>
                        <Badge className="bg-primary text-white">Score {activeAnswer.feedback.score}/100</Badge>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-emerald-600">Strengths</p>
                          <ul className="mt-1.5 space-y-1">
                            {activeAnswer.feedback.strengths.map((s) => (
                              <li key={s} className="flex items-start gap-1.5 text-xs text-foreground/90">
                                <Check className="mt-0.5 h-3 w-3 flex-none text-emerald-600" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-600">Improve</p>
                          <ul className="mt-1.5 space-y-1">
                            {activeAnswer.feedback.improvements.map((s) => (
                              <li key={s} className="flex items-start gap-1.5 text-xs text-foreground/90">
                                <ArrowUpRight className="mt-0.5 h-3 w-3 flex-none text-amber-600" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-medium text-muted-foreground">Model answer</p>
                        <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                          {activeAnswer.feedback.modelAnswer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
