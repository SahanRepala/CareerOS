'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/reveal';
import { landingPlans } from '@/lib/mock/landing';
import { cn } from '@/lib/utils';

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Simple pricing that scales with your search"
            description="Start free. Upgrade when you are ready to optimize every application."
          />
        </Reveal>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {landingPlans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border bg-card p-7 shadow-card transition-shadow hover:shadow-card-hover',
                  plan.highlighted
                    ? 'border-primary/40 shadow-glow ring-1 ring-primary/20'
                    : 'border-border'
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex-1" />
                <Button
                  asChild
                  className="w-full rounded-xl"
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
