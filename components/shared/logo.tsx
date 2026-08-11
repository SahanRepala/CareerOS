import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2', className)}>
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M4 14.5L9 9.5L12.5 13L20 5.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 5.5H20V11.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          CareerOS
        </span>
      )}
    </Link>
  );
}
