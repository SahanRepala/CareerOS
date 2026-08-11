'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnalysisModule {
  id: string;
  label: string;
  detail?: string;
  /** Roughly how long this module should take, in ms. */
  duration?: number;
}

interface AnalysisProgressProps {
  modules: AnalysisModule[];
  /** Called once every module has completed. Ignored in 'live' mode. */
  onComplete?: () => void;
  title?: string;
  className?: string;
  /**
   * 'simulated' (default) advances through every module on its own timer and
   * calls onComplete at the end — good for demo/mock flows.
   * 'live' advances through all but the last module on their timers, then
   * holds the final module in an active/spinning state indefinitely. Use
   * this for real async work (e.g. an API call) — unmount the component
   * yourself once the real request resolves.
   */
  mode?: 'simulated' | 'live';
}

type ModuleState = 'pending' | 'active' | 'done';

/**
 * Shows each AI "analysis module" completing one at a time, instead of a
 * single generic spinner. Purely presentational — callers control when it
 * mounts/unmounts and what happens on completion.
 */
export function AnalysisProgress({
  modules,
  onComplete,
  title = 'Running AI analysis',
  className,
  mode = 'simulated',
}: AnalysisProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [states, setStates] = useState<ModuleState[]>(() =>
    modules.map((_, i) => (i === 0 ? 'active' : 'pending'))
  );
  const completedRef = useRef(false);
  const lastIndex = modules.length - 1;

  useEffect(() => {
    if (activeIndex >= modules.length) {
      if (mode === 'simulated' && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    // In 'live' mode, the final module holds indefinitely — the caller
    // unmounts this component once the real async work resolves.
    if (mode === 'live' && activeIndex === lastIndex) {
      return;
    }

    const duration = modules[activeIndex]?.duration ?? 900;
    const timer = setTimeout(() => {
      setStates((prev) => {
        const next = [...prev];
        next[activeIndex] = 'done';
        if (activeIndex + 1 < next.length) next[activeIndex + 1] = 'active';
        return next;
      });
      setActiveIndex((i) => i + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, modules, mode, lastIndex]);

  const completedCount = states.filter((s) => s === 'done').length;
  const overallPct = Math.round((completedCount / modules.length) * 100);

  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/20 bg-primary/[0.03] p-6',
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {modules.length} modules complete
            </p>
          </div>
        </div>
        <span className="text-sm font-semibold tabular-nums text-primary">{overallPct}%</span>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${overallPct}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <ul className="space-y-1">
        {modules.map((mod, i) => {
          const state = states[i];
          return (
            <li
              key={mod.id}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300',
                state === 'active' && 'bg-primary/5'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 flex-none items-center justify-center rounded-full border transition-colors duration-300',
                  state === 'done' &&
                    'border-emerald-500 bg-emerald-500 text-white',
                  state === 'active' && 'border-primary/40 text-primary',
                  state === 'pending' && 'border-border text-transparent'
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {state === 'done' ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </motion.span>
                  ) : state === 'active' ? (
                    <motion.span key="spinner" exit={{ opacity: 0 }}>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </motion.span>
                  ) : (
                    <span key="dot" className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </AnimatePresence>
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    state === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {mod.label}
                </p>
                {mod.detail && (
                  <p className="truncate text-xs text-muted-foreground">{mod.detail}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
