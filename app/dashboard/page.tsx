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
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/db/dashboard';
import { useAuth } from '@/hooks/use-auth';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
  fontSize: 12,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
        getDashboardStats(user.id).then(setStats);
    }
  }, [user]);

  if (!stats) return null;

  return (
    <>
      <DashboardHeader
        title="Welcome back"
        subtitle="Here is your job search at a glance."
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard stat={{id: 'apps', label: 'Applications', value: stats.totalApplications.toString()}} index={0} />
        <StatCard stat={{id: 'ats', label: 'ATS Score', value: stats.atsScore.toString()}} index={1} />
        {/* ... */}
      </div>

      {/* Charts (placeholder for now as real DB data integration is WIP) */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* ... */}
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
