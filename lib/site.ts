export const siteConfig = {
  name: 'CareerOS',
  tagline: 'One platform to build, optimize, and prepare for your dream job.',
  description:
    'CareerOS uses AI to optimize your resume for ATS, analyze skill gaps, prep you for interviews, and track every application — all in one place.',
  primary: '#2563EB',
  secondary: '#14B8A6',
  accent: '#F59E0B',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
  ],
  authNav: [
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/register' },
  ],
};

export const dashboardNav = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Resume Analyzer', href: '/dashboard/resume', icon: 'FileText' },
  { label: 'Interview Prep', href: '/dashboard/interview-prep', icon: 'MessagesSquare' },
  { label: 'GitHub Review', href: '/dashboard/github-intelligence', icon: 'Github' },
  { label: 'History', href: '/dashboard/versions', icon: 'History' },
  { label: 'Pricing', href: '/dashboard/pricing', icon: 'Sparkles' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
] as const;

// Routes still live in the app (ATS Analysis, Optimizer, Skill Gap, Recruiter View,
// Applications, Profile) but are intentionally no longer top-level nav items — spec
// calls for exactly 7 sidebar entries. They're reachable as in-flow steps from
// Resume Analyzer until that page is merged into one unified flagship layout.

export type DashboardNavItem = (typeof dashboardNav)[number];
