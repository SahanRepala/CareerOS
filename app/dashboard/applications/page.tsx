'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  applicationColumns,
  applications as initial,
  type ApplicationCard as AppCard,
  type ApplicationStatus,
} from '@/lib/mock/applications';
import { cn } from '@/lib/utils';

const columnAccent: Record<string, string> = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppCard[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (id: string, status: ApplicationStatus) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setDragId(null);
  };

  return (
    <>
      <DashboardHeader
        title="Applications"
        subtitle="Track every application from first click to offer."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {applicationColumns.map((col) => {
          const items = apps.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              role="list"
              aria-label={`${col.title} applications`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, col.id)}
              className="flex flex-col rounded-2xl border border-border bg-muted/30 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', columnAccent[col.accent])} />
                  <span className="text-sm font-semibold text-foreground">{col.title}</span>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label={`Add application to ${col.title}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-3">
                {items.map((a, i) => (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    draggable
                    onDragStart={() => setDragId(a.id)}
                    onDragEnd={() => setDragId(null)}
                  >
                    <Card
                      className={cn(
                        'cursor-grab shadow-card transition-all hover:shadow-card-hover active:cursor-grabbing',
                        dragId === a.id && 'opacity-50'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
                            {a.logo}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {a.company}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {a.location}
                          </span>
                          <span>·</span>
                          <span>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        {a.salary && (
                          <p className="mt-2 text-xs font-medium text-foreground">{a.salary}</p>
                        )}
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.notes}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-background/50 px-3 py-6 text-center text-xs text-muted-foreground">
                    Drop applications here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
