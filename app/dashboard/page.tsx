'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/shared/stat-card';
import { DynamicIcon } from '@/components/shared/dynamic-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  applicationFunnel,
  atsScoreTrend,
  dashboardStats,
  recentActivity,
} from '@/lib/mock/dashboard';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
  fontSize: 12,
};

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Welcome back, Avery"
        subtitle="Here is your job search at a glance."
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">ATS score trend</CardTitle>
              <CardDescription>Last 7 months</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">
              +25 pts
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={atsScoreTrend} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="ats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[50, 100]}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--border))' }} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#ats)"
                    dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Application funnel</CardTitle>
            <CardDescription>Where candidates drop off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationFunnel} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="stage"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity + quick actions */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription>Your latest job-search moves</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/applications">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((item, i) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                    <DynamicIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="flex-none text-xs text-muted-foreground">{item.time}</span>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        <QuickActions />
      </div>
    </>
  );
}

function QuickActions() {
  const actions = [
    {
      label: 'Optimize resume',
      description: 'AI rewrites with reasoning',
      href: '/dashboard/optimizer',
      icon: 'Wand2',
      accent: 'primary',
    },
    {
      label: 'Run ATS analysis',
      description: 'Score against real ATS rules',
      href: '/dashboard/ats-analysis',
      icon: 'Gauge',
      accent: 'secondary',
    },
    {
      label: 'Practice interview',
      description: 'Mock AI feedback in minutes',
      href: '/dashboard/interview-prep',
      icon: 'MessagesSquare',
      accent: 'accent',
    },
  ] as const;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base">Quick actions</CardTitle>
        <CardDescription>Jump back in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((a) => {
          const accent =
            a.accent === 'primary'
              ? 'bg-primary/10 text-primary'
              : a.accent === 'secondary'
              ? 'bg-secondary/10 text-secondary'
              : 'bg-accent/10 text-accent';
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${accent}`}>
                <DynamicIcon name={a.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            3 optimizations ready
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Accept them to raise your ATS score to 90+.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
