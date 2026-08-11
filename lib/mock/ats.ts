export interface AtsSectionScore {
  id: string;
  label: string;
  score: number;
  detail: string;
}

export interface AtsMissingSkill {
  id: string;
  name: string;
  weight: number;
  context: string;
}

export interface AtsRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

export const atsOverview = {
  overall: 87,
  keywordMatch: 82,
  formatting: 94,
  experience: 79,
  readability: 91,
  actionVerbs: 76,
};

export const atsSectionScores: AtsSectionScore[] = [
  { id: 's1', label: 'Contact & Header', score: 100, detail: 'All required fields present' },
  { id: 's2', label: 'Professional Summary', score: 88, detail: 'Strong, slightly long' },
  { id: 's3', label: 'Work Experience', score: 79, detail: 'Add 2 more quantified metrics' },
  { id: 's4', label: 'Skills Section', score: 84, detail: 'Missing 3 keywords' },
  { id: 's5', label: 'Education', score: 96, detail: 'Well formatted' },
  { id: 's6', label: 'Projects', score: 72, detail: 'Add impact metrics' },
  { id: 's7', label: 'Formatting & Layout', score: 94, detail: 'ATS-friendly structure' },
];

export const atsRadar = [
  { metric: 'Keywords', value: 82 },
  { metric: 'Formatting', value: 94 },
  { metric: 'Experience', value: 79 },
  { metric: 'Readability', value: 91 },
  { metric: 'Action Verbs', value: 76 },
  { metric: 'Impact', value: 68 },
];

export const atsPie = [
  { name: 'Matched keywords', value: 41, color: 'hsl(var(--chart-1))' },
  { name: 'Partial match', value: 18, color: 'hsl(var(--chart-2))' },
  { name: 'Missing keywords', value: 11, color: 'hsl(var(--chart-5))' },
];

export const atsMissingSkills: AtsMissingSkill[] = [
  { id: 'm1', name: 'Kubernetes', weight: 92, context: 'Appears in 18/20 matching job descriptions' },
  { id: 'm2', name: 'CI/CD', weight: 88, context: 'GitHub Actions, CircleCI commonly requested' },
  { id: 'm3', name: 'GraphQL Federation', weight: 71, context: 'Required for senior backend-leaning roles' },
  { id: 'm4', name: 'Web Accessibility (WCAG)', weight: 64, context: 'Mentioned but not demonstrated' },
];

export const atsRecommendations: AtsRecommendation[] = [
  {
    id: 'r1',
    priority: 'high',
    title: 'Add quantified impact to 2 experience bullets',
    detail:
      'Your Linear role has strong verbs but only one metric. Add business impact (%, users, revenue) to at least two more bullets.',
  },
  {
    id: 'r2',
    priority: 'high',
    title: 'Include missing keyword "Kubernetes"',
    detail:
      'Even a single project mention of container orchestration would unlock 18 additional matching roles.',
  },
  {
    id: 'r3',
    priority: 'medium',
    title: 'Tighten summary to 3 lines',
    detail:
      'Recruiters scan summaries in ~6 seconds. Cut the second sentence and lead with your headline metric.',
  },
  {
    id: 'r4',
    priority: 'medium',
    title: 'Add a "Certifications" section header',
    detail:
      'ATS parsers look for a dedicated section. Nesting under Skills drops your parse rate by ~12%.',
  },
  {
    id: 'r5',
    priority: 'low',
    title: 'Swap 4 weak verbs for action verbs',
    detail: '"Worked on", "Helped with", "Responsible for", "Used" — replace with led, shipped, architected, automated.',
  },
];
