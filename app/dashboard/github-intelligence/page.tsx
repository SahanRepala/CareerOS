'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  BookCheck,
  Briefcase,
  Check,
  Circle,
  Clock,
  Code2,
  Copy,
  Database,
  Eye,
  ExternalLink,
  Folder,
  GaugeCircle,
  GitFork,
  Github,
  HelpCircle,
  Layers,
  Lightbulb,
  Loader2,
  Lock,
  Monitor,
  Rocket,
  Scale,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  Webhook,
  Wrench,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RepoTree } from '@/components/dashboard/github-intelligence/repo-tree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScoreRing } from '@/components/shared/score-ring';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { AnalysisProgress, type AnalysisModule } from '@/components/shared/analysis-progress';
import { useGitHubIntelligence } from '@/hooks/use-github-intelligence';
import { cn } from '@/lib/utils';
import type { ArchitectureLayerId } from '@/lib/github/types';

const repoAnalysisModules: AnalysisModule[] = [
  { id: 'fetch', label: 'Fetching repository data', detail: 'Files, commits, and languages', duration: 900 },
  { id: 'structure', label: 'Mapping project structure', detail: 'Architecture and layer detection', duration: 800 },
  { id: 'quality', label: 'Assessing code quality signals', duration: 700 },
  { id: 'summary', label: 'Generating AI summary', detail: 'Writing resume-ready highlights' },
];

const categoryStyles = {
  language: 'bg-primary/10 text-primary',
  framework: 'bg-secondary/10 text-secondary',
  'package-manager': 'bg-accent/10 text-accent',
  infra: 'bg-sky-50 text-sky-600',
  tooling: 'bg-violet-50 text-violet-600',
} as const;

const scoreCategoryMeta = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'maintainability', label: 'Maintainability' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'security', label: 'Security' },
  { id: 'testing', label: 'Testing' },
] as const;

const architectureLayerMeta: Record<ArchitectureLayerId, { label: string; icon: typeof Monitor }> = {
  frontend: { label: 'Frontend', icon: Monitor },
  backend: { label: 'Backend', icon: Server },
  database: { label: 'Database', icon: Database },
  apis: { label: 'APIs', icon: Webhook },
  authentication: { label: 'Authentication', icon: Lock },
  deployment: { label: 'Deployment', icon: Rocket },
};

function scoreColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-primary';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

/** Maps a free-text rating/level string (e.g. "Advanced", "Low", "Nearing readiness") to a badge color class. */
function ratingBadgeClass(rating: string): string {
  const positive = /advanced|strong|high|ready\b/i;
  const negative = /beginner|basic|low|not yet|not ready/i;
  if (positive.test(rating)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (negative.test(rating)) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  } catch {
    toast.error('Could not copy to clipboard');
  }
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function GitHubIntelligencePage() {
  const [input, setInput] = useState('');
  const { analysis, loading, error, analyze, reset } = useGitHubIntelligence();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    analyze(input);
  };

  const handleClear = () => {
    setInput('');
    reset();
  };

  return (
    <>
      <DashboardHeader
        title="GitHub Hiring Report"
        subtitle="What a recruiter thinks after reviewing this GitHub profile."
      />

      {/* URL input */}
      <Card className="shadow-card">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="repo-url">Repository URL</Label>
              <div className="relative">
                <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="repo-url"
                  placeholder="https://github.com/vercel/next.js"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-10 rounded-lg pl-9"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {analysis && (
                <Button type="button" variant="outline" className="h-10 rounded-lg" onClick={handleClear}>
                  Clear
                </Button>
              )}
              <Button type="submit" className="h-10 rounded-lg" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-1.5 h-4 w-4" />
                )}
                Analyze
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <AnalysisProgress
              modules={repoAnalysisModules}
              mode="live"
              title="Analyzing repository"
            />
          </motion.div>
        )}

        {!loading && error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            <ErrorState title="Couldn't analyze this repository" description={error} onRetry={() => analyze(input)} />
          </motion.div>
        )}

        {!loading && !error && !analysis && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            <EmptyState
              icon={<Github className="h-6 w-6" />}
              title="No repository analyzed yet"
              description="Paste a public GitHub repository URL above to get started."
            />
          </motion.div>
        )}

        {!loading && !error && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Repo overview */}
            <Card className="shadow-card">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    {analysis.metadata.owner.avatarUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={analysis.metadata.owner.avatarUrl}
                        alt={analysis.metadata.owner.login}
                        className="h-11 w-11 flex-none rounded-full border border-border"
                      />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">{analysis.metadata.fullName}</h2>
                        {analysis.metadata.isArchived && (
                          <Badge variant="outline" className="gap-1 font-normal">
                            <Archive className="h-3 w-3" /> Archived
                          </Badge>
                        )}
                        {analysis.metadata.isFork && (
                          <Badge variant="outline" className="font-normal">
                            Fork
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                        {analysis.metadata.description || 'No description provided.'}
                      </p>
                      {analysis.metadata.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {analysis.metadata.topics.slice(0, 8).map((topic) => (
                            <Badge key={topic} variant="secondary" className="font-normal">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="flex-none rounded-lg">
                    <a href={analysis.metadata.htmlUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Metric cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { id: 'stars', label: 'Stars', value: formatCompactNumber(analysis.metadata.stars), icon: Star, accent: 'text-amber-500' },
                { id: 'forks', label: 'Forks', value: formatCompactNumber(analysis.metadata.forks), icon: GitFork, accent: 'text-secondary' },
                { id: 'watchers', label: 'Watchers', value: formatCompactNumber(analysis.metadata.watchers), icon: Eye, accent: 'text-primary' },
                { id: 'language', label: 'Primary language', value: analysis.metadata.language ?? '—', icon: Code2, accent: 'text-violet-500' },
                { id: 'updated', label: 'Last updated', value: formatDate(analysis.metadata.pushedAt), icon: Clock, accent: 'text-rose-500' },
              ].map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2">
                        <m.icon className={cn('h-4 w-4', m.accent)} />
                        <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                      </div>
                      <p className="mt-2 truncate text-xl font-semibold text-foreground">{m.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Tech stack */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Detected tech stack</CardTitle>
                  <CardDescription>
                    Inferred from manifest files, config files, and source extensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.techStack.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No recognizable tech-stack signals were found in this repository.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analysis.techStack.map((t) => (
                        <Badge
                          key={t.id}
                          variant="secondary"
                          className={cn('gap-1.5 font-normal', categoryStyles[t.category])}
                          title={`Detected from ${t.detectedFrom}`}
                        >
                          <Circle className="h-1.5 w-1.5 fill-current" />
                          {t.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Scale className="h-3.5 w-3.5" /> {analysis.metadata.license ?? 'No license'}
                    </span>
                    <span>·</span>
                    <span>{analysis.fileCount.toLocaleString()} files scanned</span>
                    {analysis.truncated && (
                      <>
                        <span>·</span>
                        <span>Large repo — results truncated</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Folder structure */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Folder className="h-4 w-4 text-primary" />
                    Folder structure
                  </CardTitle>
                  <CardDescription>Top-level layout of the default branch</CardDescription>
                </CardHeader>
                <CardContent className="max-h-80 overflow-y-auto">
                  <RepoTree nodes={analysis.tree} />
                </CardContent>
              </Card>
            </div>

            {/* AI summary */}
            <Card className="shadow-card">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-accent" />
                    AI repository summary
                  </CardTitle>
                  <CardDescription>What this project is and does</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1.5 font-normal">
                  {analysis.insights.source === 'ai' ? (
                    <>
                      <Sparkles className="h-3 w-3" /> AI-generated
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="h-3 w-3" /> Heuristic analysis
                    </>
                  )}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground">{analysis.insights.summary}</p>
                {analysis.insights.source === 'heuristic' && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Generated from repository signals only. Add an <code className="rounded bg-muted px-1 py-0.5">ANTHROPIC_API_KEY</code> to unlock deeper AI reasoning.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Repository score */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Repository score</CardTitle>
                <CardDescription>Modular scoring across five engineering dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 lg:col-span-1">
                    <ScoreRing value={analysis.insights.scores.overall} size={140} label="overall score" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                    {scoreCategoryMeta.map((c) => {
                      const value = analysis.insights.scores[c.id];
                      return (
                        <div key={c.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">{c.label}</span>
                            <span className="font-semibold text-foreground">{value}</span>
                          </div>
                          <Progress value={value} className="h-2" indicatorClassName={scoreColor(value)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engineering maturity */}
            <Card className="shadow-card">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <GaugeCircle className="h-4 w-4 text-primary" />
                    Engineering maturity assessment
                  </CardTitle>
                  <CardDescription>Overall skill level this repository demonstrates</CardDescription>
                </div>
                <Badge variant="outline" className={cn('font-semibold', ratingBadgeClass(analysis.insights.engineeringMaturity.level))}>
                  {analysis.insights.engineeringMaturity.level}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground">{analysis.insights.engineeringMaturity.reasoning}</p>
              </CardContent>
            </Card>

            {/* Deep engineering assessments */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  id: 'architectureQuality',
                  title: 'Architecture quality',
                  icon: Layers,
                  assessment: analysis.insights.architectureQuality,
                },
                {
                  id: 'scalability',
                  title: 'Scalability assessment',
                  icon: TrendingUp,
                  assessment: analysis.insights.scalabilityAssessment,
                },
                {
                  id: 'maintainability',
                  title: 'Maintainability assessment',
                  icon: Wrench,
                  assessment: analysis.insights.maintainabilityAssessment,
                },
                {
                  id: 'productionReadiness',
                  title: 'Production readiness',
                  icon: Rocket,
                  assessment: analysis.insights.productionReadiness,
                },
              ].map((section) => (
                <Card key={section.id} className="shadow-card">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <section.icon className="h-4 w-4 text-primary" />
                      {section.title}
                    </CardTitle>
                    <Badge variant="outline" className={cn('font-semibold', ratingBadgeClass(section.assessment.rating))}>
                      {section.assessment.rating}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground">{section.assessment.reasoning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Architecture breakdown */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Architecture</CardTitle>
                <CardDescription>Detected layers across the stack</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.insights.architecture.map((layer, i) => {
                  const meta = architectureLayerMeta[layer.layer];
                  return (
                    <motion.div
                      key={layer.layer}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-lg',
                              layer.detected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <meta.icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium text-foreground">{meta.label}</span>
                        </div>
                        {layer.detected ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{layer.summary}</p>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Strengths */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-500" />
                      <span className="text-foreground">{s}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
                      <span className="text-foreground">{w}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Code quality */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code2 className="h-4 w-4 text-primary" />
                    Code quality observations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.codeQuality.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Circle className="mt-1.5 h-1.5 w-1.5 flex-none fill-current text-muted-foreground" />
                      <span className="text-foreground">{q}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Missing best practices */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-4 w-4 text-rose-500" />
                    Missing best practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.missingPractices.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 flex-none text-emerald-500" />
                      No obvious best-practice gaps detected.
                    </div>
                  ) : (
                    analysis.insights.missingPractices.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <X className="mt-0.5 h-3.5 w-3.5 flex-none text-rose-500" />
                        <span className="text-foreground">{m}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Security observations */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    Security observations
                  </CardTitle>
                  <CardDescription>Based only on evidence detected in the repository</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.securityObservations.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Circle className="mt-1.5 h-1.5 w-1.5 flex-none fill-current text-muted-foreground" />
                      <span className="text-foreground">{s}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Interview questions */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <HelpCircle className="h-4 w-4 text-secondary" />
                    Suggested interview questions
                  </CardTitle>
                  <CardDescription>Generated from the detected architecture and tech stack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.interviewQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-secondary/10 text-[11px] font-semibold text-secondary">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{q}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top 5 highest-impact improvements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Rocket className="h-4 w-4 text-accent" />
                  Top 5 highest-impact improvements
                </CardTitle>
                <CardDescription>Ranked by priority — highest impact first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.insights.topImprovements.map((item) => (
                  <div key={item.priority} className="flex items-start gap-3 rounded-xl border border-border p-4">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                      {item.priority}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.impact}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  Actionable improvement suggestions
                </CardTitle>
                <CardDescription>Prioritized, repository-specific next steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.insights.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-4">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{s}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Recruiter impression */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Estimated recruiter impression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground">{analysis.insights.recruiterImpression}</p>
                </CardContent>
              </Card>

              {/* Resume bullets */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookCheck className="h-4 w-4 text-secondary" />
                    Suggested resume bullets
                  </CardTitle>
                  <CardDescription>Copy and tailor these to your resume</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.insights.resumeBullets.map((bullet, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
                    >
                      <p className="text-sm text-foreground">{bullet}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-none"
                        aria-label="Copy resume bullet"
                        onClick={() => copyToClipboard(bullet)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
