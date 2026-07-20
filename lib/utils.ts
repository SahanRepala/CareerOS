import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Derives 1-2 uppercase initials from a display name or email address. */
export function getInitials(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '?';

  const namePart = trimmed.includes('@') ? trimmed.split('@')[0] : trimmed;
  const parts = namePart.split(/[\s._-]+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
