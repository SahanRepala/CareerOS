'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalysisProgress, type AnalysisModule } from '@/components/shared/analysis-progress';
import { optimizerDiffs, type OptimizerDiff } from '@/lib/mock/optimizer';
import { cn } from '@/lib/utils';

type Status = OptimizerDiff['status'];

const regenerateModules: AnalysisModule[] = [
  { id: 'context', label: 'Reading target role context', duration: 500 },
  { id: 'rewrite', label: 'Rewriting bullet points', detail: 'Optimizing for impact and clarity', duration: 700 },
  { id: 'tone', label: 'Tuning tone & seniority', duration: 500 },
  { id: 'score', label: 'Scoring projected ATS impact', duration: 550 },
];

export default function OptimizerPage() {
  const [diffs, setDiffs] = useState<OptimizerDiff[]>(optimizerDiffs);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const setStatus = (id: string, status: Status) =>
    setDiffs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));

  const acceptAll = () => {
    setDiffs((prev) => prev.map((d) => ({ ...d, status: 'accepted' as Status })));
    toast.success('All improvements accepted', {
      description: 'New ATS score projected: 92/100.',
    });
  };
  const rejectAll = () => {
    setDiffs((prev) => prev.map((d) => ({ ...d, status: 'rejected' as Status })));
    toast.info('All improvements rejected');
  };
  const [regenerateKey, setRegenerateKey] = useState(0);
  const regenerate = () => {
    setRegenerating(true);
    setRegenerateKey((k) => k + 1);
    setDiffs((prev) => prev.map((d) => ({ ...d, status: 'pending' as Status })));
  };
  const handleRegenerateComplete = () => {
    setRegenerating(false);
    toast.success('Regenerated 4 improvements', {
      description: 'Tuned for senior frontend roles.',
    });
  };
  const download = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success('PDF ready', { description: 'Avery_Mitchell_Resume_v3.3.pdf' });
    }, 900);
  };

  const acceptedCount = diffs.filter((d) => d.status === 'accepted').length;
  const projectedScore = 87 + Math.round((acceptedCount / diffs.length) * 5);

  return (
    <>
      <DashboardHeader
        title="Resume Optimizer"
        subtitle="Side-by-side AI rewrites. Accept what you like, reject what you don't."
      />

      {/* Action bar */}
      <Card className="mb-4 shadow-card">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {acceptedCount}/{diffs.length} improvements accepted
              </p>
              <p className="text-xs text-muted-foreground">
                Projected ATS score:{' '}
                <span className="font-semibold text-emerald-600">{projectedScore}/100</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg" onClick={rejectAll}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Reject all
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg" onClick={acceptAll}>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Accept all
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={regenerate}
              disabled={regenerating}
            >
              {regenerating ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              )}
              Regenerate
            </Button>
            <Button size="sm" className="rounded-lg" onClick={download} disabled={downloading}>
              {downloading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-3.5 w-3.5" />
              )}
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Split layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Original */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Original resume</CardTitle>
            <Badge variant="outline" className="font-normal">
              v3.2 · ATS 87
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {diffs.map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {d.section}
                </p>
                <p className="text-sm leading-relaxed text-foreground/80 line-through decoration-rose-300/60">
                  {d.original}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optimized */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              AI optimized
            </CardTitle>
            <Badge className="bg-emerald-50 text-emerald-600">Projected {projectedScore}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {regenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalysisProgress
                    key={regenerateKey}
                    modules={regenerateModules}
                    onComplete={handleRegenerateComplete}
                    title="Regenerating improvements"
                  />
                </motion.div>
              ) : (
                diffs.map((d) => (
                  <motion.div
                    key={d.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'rounded-xl border p-4 transition-colors',
                      d.status === 'accepted'
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : d.status === 'rejected'
                        ? 'border-rose-200 bg-rose-50/40 opacity-70'
                        : 'border-primary/30 bg-primary/5'
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {d.section}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setStatus(d.id, 'accepted')}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                            d.status === 'accepted'
                              ? 'bg-emerald-500 text-white'
                              : 'text-emerald-600 hover:bg-emerald-100'
                          )}
                          aria-label="Accept"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setStatus(d.id, 'rejected')}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                            d.status === 'rejected'
                              ? 'bg-rose-500 text-white'
                              : 'text-rose-600 hover:bg-rose-100'
                          )}
                          aria-label="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {d.optimized}
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="mt-0.5 h-3 w-3 flex-none text-accent" />
                      {d.reason}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
