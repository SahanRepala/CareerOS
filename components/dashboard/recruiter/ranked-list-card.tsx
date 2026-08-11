import { type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface RankedListItem {
  priority: number;
  title: string;
  detail: string;
  tag?: string;
}

interface RankedListCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  description?: string;
  items: RankedListItem[];
  emptyLabel?: string;
  accentClassName?: string;
}

/** Numbered, priority-ordered list card — used for the Top 5 highest-impact improvements section. */
export function RankedListCard({
  icon: Icon,
  iconClassName = 'text-accent',
  title,
  description,
  items,
  emptyLabel = 'Nothing ranked yet.',
  accentClassName = 'bg-accent/10 text-accent',
}: RankedListCardProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-4 w-4 ${iconClassName}`} />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          items.map((item) => (
            <div key={item.priority} className="flex items-start gap-3 rounded-xl border border-border p-4">
              <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold ${accentClassName}`}>
                {item.priority}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  {item.tag && (
                    <Badge variant="outline" className="font-normal">
                      {item.tag}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
