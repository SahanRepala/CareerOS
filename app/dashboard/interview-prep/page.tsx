'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, Lightbulb, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DynamicIcon } from '@/components/shared/dynamic-icon';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
// Mock data removed; in a real app, this should be fetched from the backend
import type { InterviewQuestion, QuestionCategory, Difficulty } from '@/types/interview';

// Placeholder for missing meta data
const interviewCategoryMeta: Record<string, { label: string, icon: string, accent: string }> = {
    technical: { label: 'Technical', icon: 'code', accent: 'primary' },
    behavioral: { label: 'Behavioral', icon: 'user', accent: 'secondary' },
};

export default function InterviewPrepPage() {
  const [category, setCategory] = useState<QuestionCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [active, setActive] = useState<InterviewQuestion | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Replaced global import with empty array placeholder
  const interviewQuestions = useMemo<InterviewQuestion[]>(() => [], []);

  const filtered = useMemo(
    () =>
      interviewQuestions.filter(
        (q) =>
          (category === 'all' || q.category === category) &&
          (difficulty === 'all' || q.difficulty === difficulty)
      ),
    [category, difficulty, interviewQuestions]
  );

  const openQuestion = (q: InterviewQuestion) => {
    setActive(q);
    setFeedbackOpen(false);
  };

  const getFeedback = useCallback(() => {
    setLoadingFeedback(true);
    setTimeout(() => {
      setLoadingFeedback(false);
      setFeedbackOpen(true);
      toast.success('AI feedback ready');
    }, 1100);
  }, []);

  return (
    <>
      <DashboardHeader
        title="Interview Prep"
        subtitle="Practice with mock AI feedback across every interview type."
      />

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as QuestionCategory | 'all')}
        >
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(interviewCategoryMeta).map(([id, meta]) => (
              <TabsTrigger key={id} value={id} className="gap-1.5">
                {meta.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          No questions match these filters. Try widening your selection.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q, i) => {
            const meta = interviewCategoryMeta[q.category] || { icon: 'help', accent: 'primary' };
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="group h-full cursor-pointer shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                  onClick={() => openQuestion(q)}
                >
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          meta.accent === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : meta.accent === 'secondary'
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-accent/10 text-accent'
                        )}
                      >
                        <DynamicIcon name={meta.icon as any} className="h-4 w-4" />
                      </span>
                      <Badge
                        variant="secondary"
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">{q.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Question modal */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{active.title}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {active.prompt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Hint
                  </p>
                  <p className="mt-1 text-xs text-amber-800/90">{active.hint}</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Your answer
                  </p>
                  <textarea
                    placeholder="Type or paste your answer here…"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Save draft
                  </Button>
                  <Button size="sm" className="rounded-lg" onClick={getFeedback} disabled={loadingFeedback}>
                    {loadingFeedback ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Get AI feedback
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
