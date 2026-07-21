'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/reveal';
// Mock data removed

export function Faq() {
  const landingFaqs: { q: string; a: string }[] = [];
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you might want to know before you upload your resume."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <motion.div
            initial="closed"
            whileInView="open"
            viewport={{ once: true }}
            variants={{ open: { transition: { staggerChildren: 0.05 } } }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {landingFaqs.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  className="rounded-xl border border-border bg-card px-5 shadow-card data-[state=open]:shadow-card-hover"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
