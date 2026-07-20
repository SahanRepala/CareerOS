export interface ResumeVersion {
  id: string;
  version: string;
  date: string;
  atsScore: number;
  note: string;
  current?: boolean;
}

export const resumeVersions: ResumeVersion[] = [
  {
    id: 'v5',
    version: 'v3.2',
    date: '2026-07-19',
    atsScore: 87,
    note: 'Tailored for Linear — added CRDT and real-time sync keywords.',
    current: true,
  },
  {
    id: 'v4',
    version: 'v3.1',
    date: '2026-07-12',
    atsScore: 83,
    note: 'Generalist version. Tightened summary to 3 lines.',
  },
  {
    id: 'v3',
    version: 'v3.0',
    date: '2026-06-30',
    atsScore: 79,
    note: 'Added Kubernetes mention and AWS cert.',
  },
  {
    id: 'v2',
    version: 'v2.1',
    date: '2026-06-10',
    atsScore: 74,
    note: 'Restructured skills into a dedicated section.',
  },
  {
    id: 'v1',
    version: 'v2.0',
    date: '2026-05-21',
    atsScore: 68,
    note: 'First AI-optimized pass. Replaced weak verbs.',
  },
];
