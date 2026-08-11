'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Sparkles,
  FileUp,
  ClipboardList,
  Cpu,
  Gauge,
  FileText,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const WORKFLOW_STEPS = [
  { icon: FileUp, label: 'Resume Upload', detail: 'PDF or DOCX, parsed in seconds' },
  { icon: ClipboardList, label: 'Job Description', detail: 'Paste any listing' },
  { icon: Cpu, label: 'AI Processing', detail: 'Matched against ATS rules' },
  { icon: Gauge, label: 'ATS Score', detail: 'See exactly what to fix' },
  { icon: FileText, label: 'Tailored Resume', detail: 'Rewritten bullets, ready to send' },
  { icon: Download, label: 'Download', detail: 'Resume + cover letter, one click' },
];

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
              Built for job-winning applications, not just resumes
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Land More Interviews <span className="text-gradient">With AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-5 max-w-xl text-lg text-muted-foreground"
            >
              Upload your resume. Paste any job description. Receive an ATS-optimized resume,
              a personalized cover letter, recruiter insights and interview preparation in under
              one minute.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" className="group rounded-xl">
                <Link href="/register">
                  Analyze My Resume
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href="/dashboard">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
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
                <p className="mb-4 text-xs font-medium text-muted-foreground">How it works</p>
                <div className="flex flex-col gap-0">
                  {WORKFLOW_STEPS.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            i === WORKFLOW_STEPS.length - 1
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary/10 text-secondary'
                          }`}
                        >
                          <step.icon className="h-4 w-4" />
                        </span>
                        {i < WORKFLOW_STEPS.length - 1 && (
                          <span className="my-1 h-6 w-px bg-border" />
                        )}
                      </div>
                      <div className="pb-4 pt-1.5">
                        <p className="text-sm font-semibold text-foreground">{step.label}</p>
                        <p className="text-[11px] text-muted-foreground">{step.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-card-hover sm:block"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">87/100 ATS Score</p>
                    <p className="text-[11px] text-muted-foreground">Ready to download</p>
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
