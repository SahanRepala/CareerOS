export type Trend = 'up' | 'down' | 'flat';

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  change: number;
  trend: Trend;
  caption: string;
  accent: 'primary' | 'secondary' | 'accent' | 'destructive';
}

export const dashboardStats: StatItem[] = [
  {
    id: 'ats',
    label: 'Current ATS Score',
    value: 87,
    suffix: '/100',
    change: 12,
    trend: 'up',
    caption: 'Up from 75 last week',
    accent: 'primary',
  },
  {
    id: 'applications',
    label: 'Applications',
    value: 24,
    change: 6,
    trend: 'up',
    caption: '6 sent this month',
    accent: 'secondary',
  },
  {
    id: 'readiness',
    label: 'Interview Readiness',
    value: 72,
    suffix: '%',
    change: 8,
    trend: 'up',
    caption: 'Ready for 7 of 10 topics',
    accent: 'accent',
  },
  {
    id: 'skills',
    label: 'Skills Match',
    value: 81,
    suffix: '%',
    change: 3,
    trend: 'up',
    caption: '3 skills to close',
    accent: 'primary',
  },
  {
    id: 'strength',
    label: 'Resume Strength',
    value: 92,
    suffix: '%',
    change: -2,
    trend: 'down',
    caption: 'Slight dip — refresh metrics',
    accent: 'secondary',
  },
];

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: string;
}

export const recentActivity: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Resume optimized for Stripe',
    detail: 'ATS score improved 75 → 87',
    time: '2h ago',
    icon: 'Wand2',
  },
  {
    id: 'a2',
    title: 'Applied to Senior Frontend Engineer',
    detail: 'Vercel — via referral',
    time: '5h ago',
    icon: 'Briefcase',
  },
  {
    id: 'a3',
    title: 'Interview prep completed',
    detail: 'System Design — Difficulty: Hard',
    time: 'Yesterday',
    icon: 'MessagesSquare',
  },
  {
    id: 'a4',
    title: 'New skill added',
    detail: 'TypeScript — advanced',
    time: '2d ago',
    icon: 'Sparkles',
  },
  {
    id: 'a5',
    title: 'Resume version v3.2 saved',
    detail: 'Tailored for Linear',
    time: '3d ago',
    icon: 'History',
  },
];

export const atsScoreTrend = [
  { month: 'Jan', score: 62 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 71 },
  { month: 'Apr', score: 74 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 83 },
  { month: 'Jul', score: 87 },
];

export const applicationFunnel = [
  { stage: 'Applied', count: 24 },
  { stage: 'Screening', count: 14 },
  { stage: 'Interview', count: 8 },
  { stage: 'Offer', count: 3 },
];

export const skillRadar = [
  { skill: 'React', value: 92 },
  { skill: 'TypeScript', value: 88 },
  { skill: 'System Design', value: 70 },
  { skill: 'Testing', value: 76 },
  { skill: 'Cloud', value: 58 },
  { skill: 'Communication', value: 85 },
];
