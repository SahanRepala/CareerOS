'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/reveal';
// Mock data removed
const landingTestimonials: { name: string; initials: string; quote: string; role: string; company: string }[] = [
    { name: 'Alex Johnson', initials: 'AJ', quote: 'CareerOS helped me land my dream role at Google!', role: 'Software Engineer', company: 'Google' },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Loved by job-seekers"
            title="People are landing roles they thought were out of reach"
            description="Real stories from engineers, designers, and PMs who used CareerOS to close the gap."
          />
        </Reveal>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-2 xl:columns-3 [column-fill:_balance]">
          {landingTestimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08} className="mb-5 inline-block w-full break-inside-avoid">
              <motion.figure
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <Quote className="h-7 w-7 text-primary/20" />
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                  &quot;{t.quote}&quot;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-white">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
