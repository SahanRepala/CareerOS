'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatItem } from '@/lib/mock/dashboard';

const accentMap: Record<StatItem['accent'], string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  destructive: 'text-destructive',
};

const ringMap: Record<StatItem['accent'], string> = {
  primary: 'bg-primary/10',
  secondary: 'bg-secondary/10',
  accent: 'bg-accent/10',
  destructive: 'bg-destructive/10',
};

export function StatCard({ stat, index = 0 }: { stat: StatItem; index?: number }) {
  const TrendIcon =
    stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? ArrowDownRight : Minus;
  const trendColor =
    stat.trend === 'up'
      ? 'text-emerald-600 bg-emerald-50'
      : stat.trend === 'down'
      ? 'text-rose-600 bg-rose-50'
      : 'text-muted-foreground bg-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group relative overflow-hidden p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-1">
              <span className={cn('text-3xl font-semibold tracking-tight', accentMap[stat.accent])}>
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-sm font-medium text-muted-foreground">{stat.suffix}</span>
              )}
            </div>
          </div>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              ringMap[stat.accent]
            )}
          >
            <span className={cn('text-lg font-semibold', accentMap[stat.accent])}>
              {stat.id.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
              trendColor
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {stat.change > 0 ? '+' : ''}
            {stat.change}
          </span>
          <span className="text-xs text-muted-foreground">{stat.caption}</span>
        </div>
      </Card>
    </motion.div>
  );
}
