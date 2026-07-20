export interface LandingFeature {
  icon: string;
  title: string;
  description: string;
}

export const landingFeatures: LandingFeature[] = [
  {
    icon: 'Gauge',
    title: 'ATS Score Analysis',
    description:
      'Get an instant, recruiter-grade ATS score with keyword, formatting, and readability breakdowns — before you apply.',
  },
  {
    icon: 'Wand2',
    title: 'AI Resume Optimizer',
    description:
      'Side-by-side rewrites with highlighted improvements and the reasoning behind every change. Accept, reject, or regenerate.',
  },
  {
    icon: 'MessagesSquare',
    title: 'Interview Prep',
    description:
      'Practice technical, behavioral, system-design, and coding questions with mock AI feedback and difficulty filters.',
  },
  {
    icon: 'Target',
    title: 'Skill Gap Roadmap',
    description:
      'See exactly what skills you are missing for a target role, with a week-by-week learning plan and time estimates.',
  },
  {
    icon: 'Briefcase',
    title: 'Application Tracker',
    description:
      'A Kanban board for every application — company, role, status, notes, and deadlines in one calm view.',
  },
  {
    icon: 'History',
    title: 'Resume Versioning',
    description:
      'Every optimization is saved as a version. Compare ATS scores, restore, and download any snapshot.',
  },
];

export interface LandingStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export const landingSteps: LandingStep[] = [
  {
    step: '01',
    title: 'Upload your resume',
    description:
      'Drag in a PDF or DOCX. We parse it into clean, editable sections in seconds.',
    icon: 'Upload',
  },
  {
    step: '02',
    title: 'Analyze & optimize',
    description:
      'See your ATS score, missing keywords, and AI-optimized rewrites — accept the ones you like.',
    icon: 'Sparkles',
  },
  {
    step: '03',
    title: 'Prep & apply',
    description:
      'Practice interview questions, close skill gaps, and track every application to offer.',
    icon: 'Rocket',
  },
];

export interface LandingTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  initials: string;
}

export const landingTestimonials: LandingTestimonial[] = [
  {
    name: 'Priya Nair',
    role: 'Senior Frontend Engineer',
    company: 'Stripe',
    quote:
      'CareerOS turned my resume from a 64 to a 91 ATS score in one evening. I got three interviews the next week.',
    initials: 'PN',
  },
  {
    name: 'Marcus Lee',
    role: 'Staff Engineer',
    company: 'Vercel',
    quote:
      'The optimizer shows its reasoning for every change. I actually learned how to write better bullets — not just got a rewrite.',
    initials: 'ML',
  },
  {
    name: 'Sofia Alvarez',
    role: 'Product Engineer',
    company: 'Linear',
    quote:
      'The interview prep felt like a real mock. The feedback on my system-design answer was sharper than my last recruiter loop.',
    initials: 'SA',
  },
  {
    name: 'Daniel Kim',
    role: 'Founding Engineer',
    company: 'Arc',
    quote:
      'I tracked six applications to offer in the Kanban board. Having notes and deadlines in one place kept me sane.',
    initials: 'DK',
  },
];

export interface LandingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const landingPlans: LandingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to ship your first optimized resume.',
    features: [
      '1 resume version',
      'ATS score analysis',
      '5 interview questions / week',
      'Basic skill gap report',
    ],
    cta: 'Get started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For active job-seekers who want every edge.',
    features: [
      'Unlimited resume versions',
      'AI resume optimizer',
      'Unlimited interview prep',
      'Week-by-week skill roadmap',
      'Application tracker',
      'Priority parsing',
    ],
    cta: 'Start 14-day trial',
    highlighted: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    period: 'per seat',
    description: 'For career coaches and bootcamps running cohorts.',
    features: [
      'Everything in Pro',
      'Up to 20 seats',
      'Shared candidate workspaces',
      'Bulk ATS scoring',
      'Analytics dashboard',
      'SSO & audit logs',
    ],
    cta: 'Talk to sales',
  },
];

export interface LandingFaq {
  q: string;
  a: string;
}

export const landingFaqs: LandingFaq[] = [
  {
    q: 'Is my resume data private?',
    a: 'Yes. Your resumes and profile are yours. We never share parsed content with recruiters or third parties, and you can delete everything at any time.',
  },
  {
    q: 'What file formats can I upload?',
    a: 'PDF and DOCX. We parse both into editable sections. PDFs are preferred for ATS reliability.',
  },
  {
    q: 'How accurate is the ATS score?',
    a: 'Our scoring model is trained on real ATS parsing rules from 40+ enterprise systems. It evaluates keyword match, formatting, structure, readability, and impact — then explains each subscore.',
  },
  {
    q: 'Can I connect my own job board?',
    a: 'Not yet. The application tracker is manual today, but integrations with LinkedIn, Wellfound, and Greenhouse are on the roadmap.',
  },
  {
    q: 'Do you write my resume for me?',
    a: 'No — we optimize it with you. The optimizer suggests improvements and shows the reasoning; you accept or reject each change so your voice stays yours.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Plans are month-to-month. Cancel from Settings and you keep access through the end of your billing period.',
  },
];
