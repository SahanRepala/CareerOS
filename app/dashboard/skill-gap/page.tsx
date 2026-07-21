'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Circle, Target, TrendingUp } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ScoreRing } from '@/components/shared/score-ring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { SkillGapItem, RoadmapWeek, SkillGapSummary } from '@/types/skill-gap';
import { cn } from '@/lib/utils';

const categoryStyles: Record<string, string> = {
  core: 'bg-primary/10 text-primary',
  adjacent: 'bg-secondary/10 text-secondary',
  stretch: 'bg-accent/10 text-accent',
};

const roadmapWeeks: RoadmapWeek[] = [];
const skillGapItems: SkillGapItem[] = [];
const skillGapSummary: SkillGapSummary = {
    currentMatch: 0,
    targetMatch: 0,
    missingSkills: 0,
    estimatedWeeks: 0,
    estimatedHours: 0,
};

export default function SkillGapPage() {
  const weeksDone = roadmapWeeks.filter((w) => w.done).length;

  return (
    <>
      <DashboardHeader
        title="Skill Gap"
        subtitle="Close the gap between your skills and your target role."
      />

      {/* Summary */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="flex flex-col items-center justify-center shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Current match</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center pb-8">
            <ScoreRing
              value={skillGapSummary.currentMatch}
              size={150}
              label="to target role"
              color="hsl(var(--primary))"
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Target match</p>
                <p className="text-2xl font-semibold text-foreground">
                  {skillGapSummary.targetMatch}%
                </p>
              </div>
            </div>
            <Progress value={skillGapSummary.targetMatch} className="mt-4 h-1.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              Gap to close: {skillGapSummary.targetMatch - skillGapSummary.currentMatch} pts
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Missing skills</p>
                <p className="text-2xl font-semibold text-foreground">
                  {skillGapSummary.missingSkills}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {skillGapItems.slice(0, 3).map((s) => (
                <Badge key={s.id} variant="outline" className="font-normal">
                  {s.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Estimated time</p>
                <p className="text-2xl font-semibold text-foreground">
                  {skillGapSummary.estimatedWeeks} wks
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ~{skillGapSummary.estimatedHours} hours of focused study
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skill progress */}
      <Card className="mt-4 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Skill progress</CardTitle>
          <CardDescription>Current level vs target for your dream role</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {skillGapItems.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <Badge
                    variant="secondary"
                    className={cn('font-normal capitalize', categoryStyles[s.category])}
                  >
                    {s.category}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {s.estimatedHours}h to target
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Current {s.current}%</span>
                  <span className="font-medium text-foreground">Target {s.target}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-primary/30"
                    style={{ width: `${s.current}%` }}
                  />
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${s.target}%`, opacity: 0.9 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly roadmap timeline */}
      <Card className="mt-4 shadow-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Weekly roadmap</CardTitle>
            <CardDescription>
              {weeksDone} of {roadmapWeeks.length} weeks complete
            </CardDescription>
          </div>
          <Progress value={(weeksDone / roadmapWeeks.length) * 100} className="h-2 w-32" />
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-5">
              {roadmapWeeks.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex gap-4"
                >
                  <span
                    className={cn(
                      'relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 bg-background',
                      w.done
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {w.done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </span>
                  <div
                    className={cn(
                      'flex-1 rounded-xl border p-4 transition-colors',
                      w.done
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Week {w.week} · {w.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {w.focus} · {w.hours}h
                        </p>
                      </div>
                      <Badge
                        variant={w.done ? 'secondary' : 'outline'}
                        className={cn(
                          'font-normal',
                          w.done && 'bg-emerald-50 text-emerald-600'
                        )}
                      >
                        {w.done ? 'Complete' : 'Upcoming'}
                      </Badge>
                    </div>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {w.milestones.map((m) => (
                        <li
                          key={m}
                          className="flex items-start gap-1.5 text-xs text-muted-foreground"
                        >
                          <span
                            className={cn(
                              'mt-0.5 h-1.5 w-1.5 flex-none rounded-full',
                              w.done ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                            )}
                          />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
