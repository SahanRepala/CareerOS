import { type LucideIcon, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Tone = 'positive' | 'negative' | 'neutral';

const toneStyles: Record<Tone, { icon: string; dot: string }> = {
  positive: { icon: 'text-emerald-500', dot: 'text-emerald-500' },
  negative: { icon: 'text-amber-500', dot: 'text-amber-500' },
  neutral: { icon: 'text-primary', dot: 'text-muted-foreground' },
};

interface InsightListCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  items: string[];
  emptyLabel?: string;
  tone?: Tone;
  itemIcon?: LucideIcon;
}

/** Reused for strengths, weaknesses, ATS issues, and suggested next actions on the Recruiter Dashboard. */
export function InsightListCard({
  icon: Icon,
  title,
  description,
  items,
  emptyLabel = 'Nothing to flag here.',
  tone = 'neutral',
  itemIcon: ItemIcon,
}: InsightListCardProps) {
  const styles = toneStyles[tone];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={cn('h-4 w-4', styles.icon)} />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2.5">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              {ItemIcon ? (
                <ItemIcon className={cn('mt-0.5 h-3.5 w-3.5 flex-none', styles.dot)} />
              ) : (
                <Circle className={cn('mt-1.5 h-1.5 w-1.5 flex-none fill-current', styles.dot)} />
              )}
              <span className="text-foreground">{item}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
