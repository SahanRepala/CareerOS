import Link from 'next/link';
import { type ReactNode } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Logo } from '@/components/shared/logo';

const highlights = [
  'Instant ATS score with keyword breakdown',
  'AI resume optimizer with explainable rewrites',
  'Interview prep with mock AI feedback',
  'Week-by-week skill gap roadmap',
];

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary px-6 py-10 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" />
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            The operating system for your job search.
          </h2>
          <p className="mt-4 text-white/80">
            Join 12,000+ engineers, designers, and PMs who stopped sending generic resumes.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 text-sm text-white/70">
          <Logo withWordmark={false} />
          <span>CareerOS</span>
          <span className="text-white/40">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
