export interface LandingFeature {
  icon: string;
  title: string;
  description: string;
}

export const landingFeatures: LandingFeature[] = [
  {
    icon: 'Wand2',
    title: 'Resume Optimization',
    description: 'Rewrite weak bullets into recruiter-ready lines that pass the 6-second scan.',
  },
  {
    icon: 'Gauge',
    title: 'ATS Score',
    description: 'Increase your ATS score before applying, with the exact fixes ranked by impact.',
  },
  {
    icon: 'Eye',
    title: 'Recruiter Feedback',
    description: 'See what a recruiter would flag first — strengths, red flags, and rejection risks.',
  },
  {
    icon: 'MessagesSquare',
    title: 'Interview Preparation',
    description: 'Walk in ready with role-specific questions, ideal answers, and common mistakes to avoid.',
  },
  {
    icon: 'Github',
    title: 'GitHub Review',
    description: 'Turn your GitHub profile into a hiring asset instead of a liability.',
  },
  {
    icon: 'Target',
    title: 'Skill Gap Detection',
    description: 'Know exactly which skills are costing you the interview, and how to close the gap.',
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
      'Download your resume and cover letter, practice interview questions, and apply with confidence.',
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
      'Uploaded my resume, pasted the job description, and had a tailored resume and cover letter in under a minute.',
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
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try CareerOS on your next application.',
    features: [
      '3 analyses',
      '1 GitHub review',
      'Basic interview preparation',
    ],
    cta: 'Get started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For active job-seekers applying every week.',
    features: [
      '25 analyses',
      'Unlimited interviews',
      'Resume downloads',
      'Cover letters',
      'GitHub reports',
    ],
    cta: 'Start Pro',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19',
    period: 'per month',
    description: 'For candidates who apply everywhere, all the time.',
    features: [
      'Unlimited everything',
      'Priority processing',
      'Future features included',
    ],
    cta: 'Start Premium',
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
