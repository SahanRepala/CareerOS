'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Download, History, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResumeVersion {
    id: string;
    version: string;
    current: boolean;
    date: string;
    atsScore: number;
    note: string;
}
const resumeVersions: ResumeVersion[] = [];

export default function VersionsPage() {
  const restore = (v: string) =>
    toast.success('Version restored', { description: `${v} is now your active resume.` });
  const download = (v: string) =>
    toast.success('Download started', { description: `${v}.pdf` });

  return (
    <>
      <DashboardHeader
        title="Resume Versions"
        subtitle="Every optimization is saved. Compare, restore, or download any snapshot."
      />

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              {resumeVersions.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex gap-4"
                >
                  <span
                    className={cn(
                      'relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 bg-background',
                      v.current
                        ? 'border-primary bg-primary text-white'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {v.current ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <History className="h-4 w-4" />
                    )}
                  </span>

                  <div
                    className={cn(
                      'flex-1 rounded-xl border p-4 transition-colors',
                      v.current
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{v.version}</p>
                        {v.current && (
                          <Badge className="bg-primary text-white">Current</Badge>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(v.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">ATS</span>
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            v.atsScore >= 85
                              ? 'text-emerald-600'
                              : v.atsScore >= 75
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          )}
                        >
                          {v.atsScore}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{v.note}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => download(v.version)}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => restore(v.version)}
                        disabled={v.current}
                      >
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                        Restore
                      </Button>
                    </div>
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
