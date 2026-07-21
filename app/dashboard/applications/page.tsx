'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { listApplications } from '@/lib/db/applications';
import { cn } from '@/lib/utils';
import type { Application } from '@/lib/db/types';

// Define status columns locally since mock data is removed
const applicationColumns = [
  { id: 'wishlist', title: 'Wishlist', accent: 'primary' },
  { id: 'applied', title: 'Applied', accent: 'accent' },
  { id: 'interviewing', title: 'Interviewing', accent: 'secondary' },
  { id: 'offered', title: 'Offered', accent: 'destructive' },
] as const;

const columnAccent: Record<string, string> = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      listApplications(supabase, user.id).then((res) => {
        if (res.data) setApps(res.data);
      });
    }
  }, [user, supabase]);

  const move = (appId: string, status: string) => {
    // Implement update logic if needed
    console.log(`Move ${appId} to ${status}`);
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, col.id)}
              className="flex flex-col rounded-2xl border border-border bg-muted/30 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', columnAccent[col.accent as keyof typeof columnAccent])} />
                  <span className="text-sm font-semibold text-foreground">{col.title}</span>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
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
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {a.company}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{a.role_title}</p>
                          </div>
                        </div>
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
