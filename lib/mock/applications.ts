export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface ApplicationCard {
  id: string;
  company: string;
  role: string;
  date: string;
  status: ApplicationStatus;
  notes: string;
  logo: string;
  location: string;
  salary?: string;
}

export const applicationColumns: {
  id: ApplicationStatus;
  title: string;
  accent: string;
}[] = [
  { id: 'applied', title: 'Applied', accent: 'primary' },
  { id: 'interview', title: 'Interview', accent: 'accent' },
  { id: 'offer', title: 'Offer', accent: 'secondary' },
  { id: 'rejected', title: 'Rejected', accent: 'destructive' },
];

export const applications: ApplicationCard[] = [
  {
    id: 'ap1',
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    date: '2026-07-18',
    status: 'applied',
    notes: 'Referred by Jordan. Recruiter: Maya Chen.',
    logo: 'S',
    location: 'Remote (US)',
    salary: '$220k–$260k',
  },
  {
    id: 'ap2',
    company: 'Linear',
    role: 'Product Engineer',
    date: '2026-07-15',
    status: 'interview',
    notes: 'Round 2 — system design on 2026-07-24.',
    logo: 'L',
    location: 'Remote',
    salary: '$200k–$240k',
  },
  {
    id: 'ap3',
    company: 'Vercel',
    role: 'Staff Frontend Engineer',
    date: '2026-07-10',
    status: 'interview',
    notes: 'Take-home in progress. Deadline 2026-07-22.',
    logo: 'V',
    location: 'San Francisco, CA',
    salary: '$240k–$290k',
  },
  {
    id: 'ap4',
    company: 'Arc',
    role: 'Founding Engineer',
    date: '2026-07-02',
    status: 'offer',
    notes: 'Offer received 2026-07-19. Decision by 2026-07-26.',
    logo: 'A',
    location: 'New York, NY',
    salary: '$260k + equity',
  },
  {
    id: 'ap5',
    company: 'Notion',
    role: 'Frontend Engineer',
    date: '2026-06-28',
    status: 'rejected',
    notes: 'Went with another candidate. Feedback: strong technical, wanted more backend.',
    logo: 'N',
    location: 'San Francisco, CA',
  },
  {
    id: 'ap6',
    company: 'OpenAI',
    role: 'Product Engineer, Applied AI',
    date: '2026-07-20',
    status: 'applied',
    notes: 'Applied via careers page. No referral.',
    logo: 'O',
    location: 'Remote',
    salary: '$230k–$280k',
  },
  {
    id: 'ap7',
    company: 'Figma',
    role: 'Senior Software Engineer',
    date: '2026-07-12',
    status: 'interview',
    notes: 'Hiring manager call scheduled 2026-07-23.',
    logo: 'F',
    location: 'Remote',
  },
];
