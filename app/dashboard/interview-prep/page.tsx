'use client';

import { useMemo, useState } from 'react';
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
import {
  interviewCategoryMeta,
  interviewQuestions,
  type Difficulty,
  type InterviewQuestion,
  type QuestionCategory,
} from '@/lib/mock/interview';
import { cn } from '@/lib/utils';

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-rose-50 text-rose-600',
};

export default function InterviewPrepPage() {
  const [category, setCategory] = useState<QuestionCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [active, setActive] = useState<InterviewQuestion | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const filtered = useMemo(
    () =>
      interviewQuestions.filter(
        (q) =>
          (category === 'all' || q.category === category) &&
          (difficulty === 'all' || q.difficulty === difficulty)
      ),
    [category, difficulty]
  );

  const openQuestion = (q: InterviewQuestion) => {
    setActive(q);
    setFeedbackOpen(false);
  };

  const getFeedback = () => {
    setLoadingFeedback(true);
    setTimeout(() => {
      setLoadingFeedback(false);
      setFeedbackOpen(true);
      toast.success('AI feedback ready');
    }, 1100);
  };

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

        <Tabs
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as Difficulty | 'all')}
        >
          <TabsList>
            <TabsTrigger value="all">Any</TabsTrigger>
            {difficulties.map((d) => (
              <TabsTrigger key={d.id} value={d.id}>
                {d.label}
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
            const meta = interviewCategoryMeta[q.category];
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
                        <DynamicIcon name={meta.icon} className="h-4 w-4" />
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn('font-normal', difficultyStyles[q.difficulty])}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">{q.title}</h3>
                    <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {q.prompt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Open question
                    </div>
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {interviewCategoryMeta[active.category].label}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn('font-normal', difficultyStyles[active.difficulty])}
                  >
                    {active.difficulty}
                  </Badge>
                </div>
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

                <AnimatePresence>
                  {feedbackOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                          <Sparkles className="h-4 w-4" />
                          AI feedback
                        </p>
                        <Badge className="bg-primary text-white">
                          Score {active.feedback.score}/100
                        </Badge>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-emerald-600">Strengths</p>
                          <ul className="mt-1.5 space-y-1">
                            {active.feedback.strengths.map((s) => (
                              <li key={s} className="flex items-start gap-1.5 text-xs text-foreground/90">
                                <Check className="mt-0.5 h-3 w-3 flex-none text-emerald-600" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-600">Improve</p>
                          <ul className="mt-1.5 space-y-1">
                            {active.feedback.improvements.map((s) => (
                              <li key={s} className="flex items-start gap-1.5 text-xs text-foreground/90">
                                <ArrowUpRight className="mt-0.5 h-3 w-3 flex-none text-amber-600" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-medium text-muted-foreground">Model answer</p>
                        <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                          {active.modelAnswer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
