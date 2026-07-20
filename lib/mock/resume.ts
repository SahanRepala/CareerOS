export interface ResumeSummary {
  text: string;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  location: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  link?: string;
  stack: string[];
}

export interface ResumeSkill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ResumeCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeAchievement {
  id: string;
  title: string;
  detail: string;
  date: string;
}

export interface ResumeData {
  summary: ResumeSummary;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  certificates: ResumeCertificate[];
  achievements: ResumeAchievement[];
}

export const uploadedResumeFile = {
  name: 'Avery_Mitchell_Resume.pdf',
  size: 248_000,
  pages: 2,
  uploadedAt: '2026-07-18T10:24:00Z',
};

export const resumeData: ResumeData = {
  summary: {
    text: 'Senior Frontend Engineer with 6+ years building performant, accessible web applications at scale. Specialized in React, TypeScript, and design systems. Led teams of 4-6 engineers and shipped products used by millions. Passionate about developer experience and clean architecture.',
  },
  education: [
    {
      id: 'e1',
      school: 'University of Washington',
      degree: 'B.S.',
      field: 'Computer Science',
      start: '2016',
      end: '2020',
      location: 'Seattle, WA',
    },
  ],
  experience: [
    {
      id: 'x1',
      company: 'Linear',
      role: 'Senior Frontend Engineer',
      start: '2022',
      end: 'Present',
      location: 'Remote',
      bullets: [
        'Architected the real-time sync engine used by 500k+ teams, cutting sync latency by 40%.',
        'Led migration of the design system to a token-driven pipeline shared across web and desktop.',
        'Mentored 4 engineers; established the frontend RFC process adopted org-wide.',
      ],
    },
    {
      id: 'x2',
      company: 'Vercel',
      role: 'Frontend Engineer',
      start: '2020',
      end: '2022',
      location: 'San Francisco, CA',
      bullets: [
        'Shipped the Vercel dashboard analytics suite, driving a 28% lift in pro-tier conversions.',
        'Built the edge functions playground used by 1M+ developers monthly.',
      ],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Flowboard',
      description:
        'Open-source Kanban board with keyboard-first navigation and offline sync.',
      link: 'github.com/avery/flowboard',
      stack: ['React', 'TypeScript', 'Zustand', 'IndexedDB'],
    },
    {
      id: 'p2',
      name: 'Pulse',
      description:
        'Real-time analytics widget library with sub-100ms render budget.',
      stack: ['React', 'Web Workers', 'Canvas'],
    },
  ],
  skills: [
    { id: 's1', name: 'React', level: 'Expert' },
    { id: 's2', name: 'TypeScript', level: 'Expert' },
    { id: 's3', name: 'Next.js', level: 'Advanced' },
    { id: 's4', name: 'Node.js', level: 'Advanced' },
    { id: 's5', name: 'GraphQL', level: 'Intermediate' },
    { id: 's6', name: 'Tailwind CSS', level: 'Expert' },
    { id: 's7', name: 'Figma', level: 'Intermediate' },
    { id: 's8', name: 'PostgreSQL', level: 'Intermediate' },
  ],
  certificates: [
    {
      id: 'c1',
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      date: '2024',
    },
    {
      id: 'c2',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: '2023',
    },
  ],
  achievements: [
    {
      id: 'ac1',
      title: 'Speaker — React Summit 2025',
      detail: 'Talk: "Designing for the Keyboard-First Generation"',
      date: '2025',
    },
    {
      id: 'ac2',
      title: 'Top 1% contributor — open source',
      detail: 'Maintainer of 3 libraries with 10k+ stars combined',
      date: '2024',
    },
  ],
};
