'use client';

import { Check } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { landingPlans } from '@/lib/mock/landing';
import { dashboardUsage } from '@/lib/mock/dashboard';
import { cn } from '@/lib/utils';

export default function DashboardPricingPage() {
  return (
    <>
      <DashboardHeader
        title="Pricing"
        subtitle="Upgrade when you're ready to send more applications."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {landingPlans.map((plan) => {
          const isCurrent = plan.name === dashboardUsage.plan;
          return (
            <Card
              key={plan.id}
              className={cn(
                'flex flex-col shadow-card',
                plan.highlighted && 'border-primary/40 ring-1 ring-primary/20'
              )}
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  {isCurrent && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Current plan
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <Button
                  className="mt-6 w-full rounded-xl"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current plan' : plan.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
