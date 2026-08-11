'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  FolderGit2,
  Gauge,
  Github,
  Loader2,
  Rocket,
  Search,
  Target,
  ThumbsUp,
  Trophy,
  Wrench,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { VerdictBanner } from '@/components/dashboard/recruiter/verdict-banner';
import { InsightListCard } from '@/components/dashboard/recruiter/insight-list-card';
import { RankedListCard } from '@/components/dashboard/recruiter/ranked-list-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { useRecruiterDashboard } from '@/hooks/use-recruiter-dashboard';
import { cn } from '@/lib/utils';

const skillLevelStyles: Record<string, string> = {
  Expert: 'bg-primary/10 text-primary',
  Advanced: 'bg-secondary/10 text-secondary',
  Intermediate: 'bg-accent/10 text-accent',
  Beginner: 'bg-muted text-muted-foreground',
};

function scoreColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-primary';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

export default function RecruiterViewPage() {
  const {
    profile,
    profileLoading,
    profileError,
    repoUrl,
    repoAnalysis,
    repoLoading,
    repoError,
    analyzeRepo,
    resetRepo,
    assessment,
  } = useRecruiterDashboard();

  const [repoInput, setRepoInput] = useState('');
  const effectiveRepoUrl = repoInput || repoUrl;

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveRepoUrl.trim() || repoLoading) return;
    analyzeRepo(effectiveRepoUrl);
  };

  const candidateName = profile?.full_name?.trim() || 'This candidate';

  if (profileLoading) {
    return (
      <>
        <DashboardHeader
          title="Recruiter Dashboard"
          subtitle="See this candidate exactly as a recruiter would."
        />
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-14 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">Loading candidate profile…</p>
        </div>
      </>
    );
  }

  if (profileError) {
    return (
      <>
        <DashboardHeader
          title="Recruiter Dashboard"
          subtitle="See this candidate exactly as a recruiter would."
        />
        <div className="mt-4">
          <ErrorState title="Couldn't load this candidate" description={profileError} />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Recruiter Dashboard"
        subtitle="A single, recruiter-facing view combining Resume, ATS, Skill Gap, and GitHub Intelligence results."
      />

      <div className="space-y-4">
        {/* GitHub repo link — reuses the GitHub Intelligence backend, does not recompute anything */}
        <Card className="shadow-card">
          <CardContent className="p-5">
            <form onSubmit={handleAnalyze} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="recruiter-repo-url" className="flex items-center gap-1.5">
                  <FolderGit2 className="h-3.5 w-3.5" />
                  Candidate GitHub repository
                </Label>
                <div className="relative">
                  <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="recruiter-repo-url"
                    placeholder="https://github.com/owner/repo"
                    value={repoInput || repoUrl}
                    onChange={(e) => setRepoInput(e.target.value)}
                    className="h-10 rounded-lg pl-9"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {repoUrl && !repoInput
                    ? 'Pre-filled from the candidate\u2019s profile. Runs the same analysis as GitHub Intelligence.'
                    : 'Pulls a live engineering assessment using the GitHub Intelligence module.'}
                </p>
              </div>
              <div className="flex gap-2">
                {repoAnalysis && (
                  <Button type="button" variant="outline" className="h-10 rounded-lg" onClick={resetRepo}>
                    Clear
                  </Button>
                )}
                <Button type="submit" className="h-10 rounded-lg" disabled={repoLoading || !effectiveRepoUrl.trim()}>
                  {repoLoading ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-1.5 h-4 w-4" />
                  )}
                  Analyze
                </Button>
              </div>
            </form>
            {repoError && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                {repoError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Verdict */}
        <VerdictBanner
          candidateName={candidateName}
          headline={profile?.headline}
          location={profile?.location}
          avatarUrl={profile?.avatar_url}
          recommendation={assessment.recommendation}
          score={assessment.hiringReadiness}
          reasoning={assessment.recommendationReasoning}
        />

        {/* Strengths / Weaknesses */}
        <div className="grid gap-4 lg:grid-cols-2">
          <InsightListCard
            icon={ThumbsUp}
            title="Candidate strengths"
            description="What stands out positively across every module"
            items={assessment.strengths}
            tone="positive"
          />
          <InsightListCard
            icon={AlertTriangle}
            title="Candidate weaknesses"
            description="What a recruiter would flag for follow-up"
            items={assessment.weaknesses}
            tone="negative"
          />
        </div>

        {/* Technical skills + Project quality */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4 text-primary" />
                Technical skills summary
              </CardTitle>
              <CardDescription>Reused from the candidate&apos;s resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {assessment.technicalSkills.topSkills.map((s) => (
                  <Badge
                    key={s.name}
                    variant="secondary"
                    className={cn('font-normal', skillLevelStyles[s.level] ?? 'bg-muted text-muted-foreground')}
                  >
                    {s.name} · {s.level}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{assessment.technicalSkills.stackNote}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderGit2 className="h-4 w-4 text-secondary" />
                  Project quality summary
                </CardTitle>
                <CardDescription>From GitHub Intelligence</CardDescription>
              </div>
              {assessment.projectQuality.available && assessment.projectQuality.score !== null && (
                <Badge variant="outline" className="font-semibold">
                  {assessment.projectQuality.score}/100
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {assessment.projectQuality.available ? (
                <>
                  <p className="text-sm leading-relaxed text-foreground">{assessment.projectQuality.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {assessment.projectQuality.maturityLevel && (
                      <Badge variant="outline" className="font-normal">
                        Maturity: {assessment.projectQuality.maturityLevel}
                      </Badge>
                    )}
                    {assessment.projectQuality.architectureRating && (
                      <Badge variant="outline" className="font-normal">
                        Architecture: {assessment.projectQuality.architectureRating}
                      </Badge>
                    )}
                    {assessment.projectQuality.productionReadiness && (
                      <Badge variant="outline" className="font-normal">
                        Production: {assessment.projectQuality.productionReadiness}
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<Github className="h-5 w-5" />}
                  title="No repository linked yet"
                  description={assessment.projectQuality.summary}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* ATS summary */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gauge className="h-4 w-4 text-primary" />
                ATS summary
              </CardTitle>
              <CardDescription>Reused from the ATS Analysis module</CardDescription>
            </div>
            <Badge variant="outline" className="font-semibold">
              {assessment.atsSummary.overall}/100
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Keyword match</span>
                    <span className="font-semibold text-foreground">{assessment.atsSummary.keywordMatch}</span>
                  </div>
                  <Progress
                    value={assessment.atsSummary.keywordMatch}
                    className="h-2"
                    indicatorClassName={scoreColor(assessment.atsSummary.keywordMatch)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Formatting</span>
                    <span className="font-semibold text-foreground">{assessment.atsSummary.formatting}</span>
                  </div>
                  <Progress
                    value={assessment.atsSummary.formatting}
                    className="h-2"
                    indicatorClassName={scoreColor(assessment.atsSummary.formatting)}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Missing keywords</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {assessment.atsSummary.missingKeywords.length === 0 ? (
                    <span className="text-sm text-foreground">None detected.</span>
                  ) : (
                    assessment.atsSummary.missingKeywords.map((k) => (
                      <Badge key={k} variant="outline" className="font-normal">
                        {k}
                      </Badge>
                    ))
                  )}
                </div>
                {assessment.atsSummary.topIssues.length > 0 && (
                  <>
                    <p className="mt-4 text-xs font-medium text-muted-foreground">Top issues</p>
                    <ul className="mt-2 space-y-1.5">
                      {assessment.atsSummary.topIssues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill gaps */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-secondary" />
              Skill gaps
            </CardTitle>
            <CardDescription>Reused from the Skill Gap module, largest gaps first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessment.skillGaps.map((g) => (
              <div key={g.name} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 text-sm">
                  <span className="font-medium text-foreground">{g.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {g.current}% → {g.target}% target · ~{g.estimatedHours}h
                  </span>
                </div>
                <div className="relative">
                  <Progress value={g.current} className="h-2" indicatorClassName="bg-muted-foreground/40" />
                  <div
                    className="pointer-events-none absolute top-0 h-2 w-0.5 -translate-x-1/2 bg-foreground/60"
                    style={{ left: `${g.target}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top improvements */}
        <RankedListCard
          icon={Trophy}
          title="Highest priority improvements"
          description="Ranked highest-impact first, combined across ATS, Skill Gap, and GitHub Intelligence"
          items={assessment.topImprovements.map((i) => ({
            priority: i.priority,
            title: i.title,
            detail: i.detail,
            tag: i.source,
          }))}
        />

        {/* Next actions */}
        <InsightListCard
          icon={Rocket}
          title="Suggested next actions for the candidate"
          description="Concrete next steps to raise hiring readiness"
          items={assessment.nextActions}
          itemIcon={ArrowRight}
          tone="neutral"
        />
      </div>
    </>
  );
}
