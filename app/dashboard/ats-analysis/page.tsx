'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AlertCircle, Lightbulb, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ScoreRing } from '@/components/shared/score-ring';
import { AnalysisProgress, type AnalysisModule } from '@/components/shared/analysis-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  atsMissingSkills,
  atsOverview,
  atsPie,
  atsRadar,
  atsRecommendations,
  atsSectionScores,
} from '@/lib/mock/ats';
import { chartTooltipStyle as tooltipStyle } from '@/lib/chart-theme';
import { cn } from '@/lib/utils';

const analysisModules: AnalysisModule[] = [
  { id: 'parse', label: 'Parsing resume structure', detail: 'Reading sections and layout', duration: 700 },
  { id: 'keywords', label: 'Matching keywords', detail: 'Comparing against target job descriptions', duration: 900 },
  { id: 'format', label: 'Checking ATS formatting', detail: 'Fonts, tables, headers, and parsing risk', duration: 650 },
  { id: 'experience', label: 'Scoring experience & impact', detail: 'Quantified metrics and action verbs', duration: 850 },
  { id: 'readability', label: 'Evaluating readability', detail: 'Sentence length and clarity', duration: 600 },
  { id: 'recommend', label: 'Building recommendations', detail: 'Prioritizing highest-impact fixes', duration: 750 },
];

const priorityStyles = {
  high: 'bg-rose-50 text-rose-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-sky-50 text-sky-600',
} as const;

const metricCards = [
  { id: 'keyword', label: 'Keyword Match', value: atsOverview.keywordMatch, accent: 'primary' },
  { id: 'format', label: 'Formatting', value: atsOverview.formatting, accent: 'secondary' },
  { id: 'experience', label: 'Experience', value: atsOverview.experience, accent: 'accent' },
  { id: 'readability', label: 'Readability', value: atsOverview.readability, accent: 'primary' },
  { id: 'action', label: 'Action Verbs', value: atsOverview.actionVerbs, accent: 'secondary' },
] as const;

export default function AtsAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const rerunAnalysis = () => {
    setIsAnalyzing(true);
    setRunKey((k) => k + 1);
  };

  const handleComplete = () => {
    setIsAnalyzing(false);
    toast.success('Analysis complete', {
      description: 'Your ATS score and recommendations are up to date.',
    });
  };

  return (
    <>
      <DashboardHeader
        title="ATS Analysis"
        subtitle="How your resume scores against real applicant tracking systems."
      />

      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={rerunAnalysis}
          disabled={isAnalyzing}
        >
          <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', isAnalyzing && 'animate-spin')} />
          Re-run analysis
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mb-4"
          >
            <AnalysisProgress
              key={runKey}
              modules={analysisModules}
              onComplete={handleComplete}
              title="Analyzing your resume"
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >

      {/* Overview + radar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Overall ATS Score</CardTitle>
            <CardDescription>Recruiter-grade</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center pb-8">
            <ScoreRing value={atsOverview.overall} size={170} label="out of 100" />
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Score breakdown</CardTitle>
            <CardDescription>Six dimensions recruiters and ATS parse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={atsRadar} outerRadius={100}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metricCards.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-card">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{m.value}%</p>
                <Progress value={m.value} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section scores + pie */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Section scores</CardTitle>
            <CardDescription>Per-section parse reliability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {atsSectionScores.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="font-semibold text-foreground">{s.score}</span>
                </div>
                <Progress
                  value={s.score}
                  className="h-2"
                  indicatorClassName={
                    s.score >= 90
                      ? 'bg-emerald-500'
                      : s.score >= 75
                      ? 'bg-primary'
                      : 'bg-amber-500'
                  }
                />
                <p className="text-xs text-muted-foreground">{s.detail}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Keyword coverage</CardTitle>
            <CardDescription>Matched vs missing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={atsPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {atsPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {atsPie.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="flex-1 text-muted-foreground">{p.name}</span>
                  <span className="font-semibold text-foreground">{p.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missing skills */}
      <Card className="mt-4 shadow-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Missing skills</CardTitle>
            <CardDescription>High-weight keywords found in matching JDs</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            View roadmap
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {atsMissingSkills.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <AlertCircle className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.context}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-28">
                  <Progress value={s.weight} className="h-1.5" />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-foreground">
                  {s.weight}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mt-4 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-accent" />
            Recommendations
          </CardTitle>
          <CardDescription>Prioritized fixes to raise your score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {atsRecommendations.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-start"
            >
              <Badge
                className={cn(
                  'flex-none uppercase tracking-wide',
                  priorityStyles[r.priority]
                )}
                variant="secondary"
              >
                {r.priority}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
