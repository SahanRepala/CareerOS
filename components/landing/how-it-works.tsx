'use client';

import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/reveal';
import { DynamicIcon } from '@/components/shared/dynamic-icon';
// Mock data removed
const landingSteps: { step: number; icon: string; title: string; description: string }[] = [
    { step: 1, icon: 'upload', title: 'Upload', description: 'Upload your resume and the target job description.' },
    { step: 2, icon: 'zap', title: 'Optimize', description: 'Our AI optimizes your resume against the JD.' },
    { step: 3, icon: 'check', title: 'Apply', description: 'Download your optimized resume and apply with confidence.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-card/40 py-24">
      <div className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="From resume to offer in three steps"
            description="No setup, no learning curve. Upload once and CareerOS handles the rest."
          />
        </Reveal>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {landingSteps.map((step, i) => {
            return (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background shadow-card">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
                      <DynamicIcon name={step.icon} className="h-7 w-7" />
                    </div>
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
