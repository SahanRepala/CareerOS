export interface OptimizerDiff {
  id: string;
  section: string;
  original: string;
  optimized: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const optimizerDiffs: OptimizerDiff[] = [
  {
    id: 'd1',
    section: 'Summary',
    original:
      'Senior Frontend Engineer with 6+ years building performant, accessible web applications at scale.',
    optimized:
      'Senior Frontend Engineer with 6+ years shipping performant, accessible web apps to 10M+ users, cutting load times by 38%.',
    reason: 'Added quantified impact and a headline metric recruiters can scan in <6s.',
    status: 'pending',
  },
  {
    id: 'd2',
    section: 'Experience · Linear',
    original:
      'Architected the real-time sync engine used by 500k+ teams, cutting sync latency by 40%.',
    optimized:
      'Architected a real-time sync engine powering 500k+ teams, reducing sync latency 40% and infra cost $1.2M/yr.',
    reason: 'Surfaced a cost-impact metric that aligns with senior role expectations.',
    status: 'pending',
  },
  {
    id: 'd3',
    section: 'Experience · Vercel',
    original:
      'Shipped the Vercel dashboard analytics suite, driving a 28% lift in pro-tier conversions.',
    optimized:
      'Led 3-engineer team to ship Vercel Analytics, driving a 28% lift in pro-tier conversions ($4.2M ARR).',
    reason: 'Added leadership signal and revenue tie-back missing from the original.',
    status: 'pending',
  },
  {
    id: 'd4',
    section: 'Skills',
    original: 'React, TypeScript, Next.js, Node.js, GraphQL, Tailwind CSS, Figma, PostgreSQL',
    optimized:
      'React, TypeScript, Next.js, Node.js, GraphQL, Kubernetes, CI/CD, Tailwind CSS, Figma, PostgreSQL',
    reason: 'Inserted 2 high-weight missing keywords (Kubernetes, CI/CD) found in matching JDs.',
    status: 'pending',
  },
];
