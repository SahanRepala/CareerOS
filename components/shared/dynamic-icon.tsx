import * as Icons from 'lucide-react';

export type IconName = keyof typeof Icons;

/**
 * Renders a lucide-react icon looked up by its string name (e.g. from mock/config data).
 * Centralizes the dynamic-lookup pattern that was previously duplicated with an
 * unchecked `(Icons as any)[name]` cast in several files. Falls back to `null`
 * instead of throwing if an unknown/invalid name is ever passed.
 */
export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = Icons[name as IconName] as Icons.LucideIcon | undefined;

  if (!Icon) {
    return null;
  }

  return <Icon className={className} />;
}
