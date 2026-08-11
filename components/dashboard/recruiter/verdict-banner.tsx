'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, CircleHelp, XCircle } from 'lucide-react';
import { ScoreRing } from '@/components/shared/score-ring';
import { getInitials, cn } from '@/lib/utils';
import type { HiringRecommendation } from '@/lib/recruiter/recruiter-assessment';

const verdictMeta: Record<
  HiringRecommendation,
  { icon: typeof CheckCircle2; label: string; ring: string; badge: string; glow: string }
> = {
  Hire: {
    icon: CheckCircle2,
    label: 'Recommend to hire',
    ring: 'hsl(160 84% 39%)',
    badge: 'bg-emerald-500 text-white',
    glow: 'from-emerald-500/10',
  },
  Maybe: {
    icon: CircleHelp,
    label: 'Worth a closer look',
    ring: 'hsl(38 92% 50%)',
    badge: 'bg-amber-500 text-white',
    glow: 'from-amber-500/10',
  },
  Reject: {
    icon: XCircle,
    label: 'Not a fit right now',
    ring: 'hsl(346 87% 55%)',
    badge: 'bg-rose-500 text-white',
    glow: 'from-rose-500/10',
  },
};

interface VerdictBannerProps {
  candidateName: string;
  headline?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  recommendation: HiringRecommendation;
  score: number;
  reasoning: string;
}

export function VerdictBanner({
  candidateName,
  headline,
  location,
  avatarUrl,
  recommendation,
  score,
  reasoning,
}: VerdictBannerProps) {
  const meta = verdictMeta[recommendation];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br to-card p-5 shadow-card sm:p-6',
        meta.glow
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={candidateName}
              className="h-14 w-14 flex-none rounded-full border border-border object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-base font-semibold text-white">
              {getInitials(candidateName)}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Candidate review</p>
            <h2 className="truncate text-xl font-semibold text-foreground">{candidateName}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {headline || 'No headline set'}
              {location ? ` · ${location}` : ''}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold', meta.badge)}>
                <meta.icon className="h-3.5 w-3.5" />
                {recommendation}
              </span>
              <span className="text-xs text-muted-foreground">{meta.label}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 lg:items-end">
          <ScoreRing value={score} size={112} stroke={10} label="hiring readiness" color={meta.ring} />
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/90">{reasoning}</p>
    </motion.div>
  );
}
