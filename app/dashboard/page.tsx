'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Sparkles } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dashboardStats, recentAnalyses, dashboardUsage } from '@/lib/mock/dashboard';

export default function DashboardPage() {
  const remaining = dashboardUsage.analysesLimit - dashboardUsage.analysesUsed;
  const atsStat = dashboardStats.find((s) => s.id === 'ats');

  return (
    <>
      <DashboardHeader
        title="Welcome back, Avery"
        subtitle="Upload a resume and job description to get your next score."
      />

      {/* Core numbers: resume score, applications remaining, GitHub score */}
      <div className="grid gap-4 sm:grid-cols-3">
        {atsStat && <StatCard stat={atsStat} index={0} />}
        <StatCard
          stat={{
            id: 'remaining',
            label: 'Analyses Remaining',
            value: remaining,
            suffix: ` / ${dashboardUsage.analysesLimit}`,
            change: 0,
            trend: 'flat',
            caption: `${dashboardUsage.plan} plan`,
            accent: 'secondary',
          }}
          index={1}
        />
        <StatCard
          stat={{
            id: 'github',
            label: 'GitHub Score',
            value: dashboardUsage.githubScore,
            suffix: '/100',
            change: 0,
            trend: 'flat',
            caption: 'Hiring impression score',
            accent: 'accent',
          }}
          index={2}
        />
      </div>

      {/* Start new analysis */}
      <Card className="mt-6 shadow-card">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-semibold text-foreground">Start a new analysis</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your resume and paste a job description to get an ATS score, rewrite, and cover letter.
            </p>
          </div>
          <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
            <Link href="/dashboard/resume">
              Start New Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Recent analyses */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent analyses</CardTitle>
              <CardDescription>Your latest resume-to-job matches</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/versions">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentAnalyses.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.role}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.company}</p>
                </div>
                <Badge variant="secondary" className="flex-none">
                  {item.score}/100
                </Badge>
                <span className="flex-none text-xs text-muted-foreground">{item.date}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Resume versions / interview sessions / GitHub */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your progress</CardTitle>
            <CardDescription>Everything you've built so far</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgressRow
              href="/dashboard/versions"
              label="Resume Versions"
              value={dashboardUsage.resumeVersions}
              icon={<Sparkles className="h-4 w-4" />}
              accent="bg-primary/10 text-primary"
            />
            <ProgressRow
              href="/dashboard/interview-prep"
              label="Interview Sessions"
              value={dashboardUsage.interviewSessions}
              icon={<Sparkles className="h-4 w-4" />}
              accent="bg-secondary/10 text-secondary"
            />
            <ProgressRow
              href="/dashboard/github-intelligence"
              label="GitHub Score"
              value={`${dashboardUsage.githubScore}/100`}
              icon={<Github className="h-4 w-4" />}
              accent="bg-accent/10 text-accent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Upgrade banner */}
      {dashboardUsage.plan === 'Free' && (
        <Card className="mt-6 border-primary/30 bg-primary/5 shadow-card">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {remaining} of {dashboardUsage.analysesLimit} free analyses left
                </p>
                <p className="text-xs text-muted-foreground">
                  Upgrade to Pro for 25 analyses, unlimited interviews, and GitHub reports.
                </p>
              </div>
            </div>
            <Button asChild className="w-full rounded-xl sm:w-auto">
              <Link href="/dashboard/pricing">Upgrade to Pro</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function ProgressRow({
  href,
  label,
  value,
  icon,
  accent,
}: {
  href: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${accent}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </Link>
  );
}
