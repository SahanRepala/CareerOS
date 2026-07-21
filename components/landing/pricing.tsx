'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/reveal';
import { cn } from '@/lib/utils';

// Mock data removed; placeholder for missing pricing plans
const landingPlans: any[] = [];

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
             // Placeholder for pricing UI
             <div key={i}>Pricing plan {i}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
