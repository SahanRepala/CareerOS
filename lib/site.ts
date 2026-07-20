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
  { label: 'Resume', href: '/dashboard/resume', icon: 'FileText' },
  { label: 'ATS Analysis', href: '/dashboard/ats-analysis', icon: 'Gauge' },
  { label: 'Resume Optimizer', href: '/dashboard/optimizer', icon: 'Wand2' },
  { label: 'Interview Prep', href: '/dashboard/interview-prep', icon: 'MessagesSquare' },
  { label: 'Skill Gap', href: '/dashboard/skill-gap', icon: 'Target' },
  { label: 'Applications', href: '/dashboard/applications', icon: 'Briefcase' },
  { label: 'Resume Versions', href: '/dashboard/versions', icon: 'History' },
  { label: 'Profile', href: '/dashboard/profile', icon: 'User' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
] as const;

export type DashboardNavItem = (typeof dashboardNav)[number];
