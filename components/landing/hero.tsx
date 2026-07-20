'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScoreRing } from '@/components/shared/score-ring';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute -z-10 left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Now with AI Resume Optimizer
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              One platform to{' '}
              <span className="text-gradient">build, optimize, and prepare</span> for your dream job.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-5 max-w-xl text-lg text-muted-foreground"
            >
              CareerOS scores your resume against real ATS rules, rewrites it with you, preps you for
              interviews, and tracks every application — from first click to offer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" className="group rounded-xl">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href="/dashboard">
                  <Play className="mr-2 h-4 w-4" />
                  View Demo
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="flex -space-x-2">
                  {['PN', 'ML', 'SA', 'DK'].map((i) => (
                    <span
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-secondary text-[10px] font-semibold text-white"
                    >
                      {i}
                    </span>
                  ))}
                </span>
                <span>12,000+ job-seekers</span>
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="text-amber-500">★★★★★</span>
                <span>4.9/5</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 blur-2xl" />
              <div className="glass rounded-3xl p-6 shadow-card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">ATS Score</p>
                    <p className="text-sm font-semibold text-foreground">Resume v3.2</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    +12 this week
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <ScoreRing value={87} size={150} label="out of 100" sublabel="Recruiter-grade" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { l: 'Keywords', v: '82%' },
                    { l: 'Format', v: '94%' },
                    { l: 'Impact', v: '76%' },
                  ].map((m) => (
                    <div key={m.l} className="rounded-xl bg-white/60 p-3 text-center">
                      <p className="text-lg font-semibold text-foreground">{m.v}</p>
                      <p className="text-[11px] text-muted-foreground">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-card-hover sm:block"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">3 improvements ready</p>
                    <p className="text-[11px] text-muted-foreground">Accept to apply instantly</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
