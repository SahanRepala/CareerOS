export interface SkillGapItem {
  id: string;
  name: string;
  current: number;
  target: number;
  estimatedHours: number;
  category: 'core' | 'adjacent' | 'stretch';
}

export interface RoadmapWeek {
  id: string;
  week: number;
  title: string;
  focus: string;
  hours: number;
  milestones: string[];
  done: boolean;
}

export const skillGapSummary = {
  currentMatch: 81,
  targetMatch: 95,
  missingSkills: 3,
  estimatedWeeks: 6,
  estimatedHours: 48,
};

export const skillGapItems: SkillGapItem[] = [
  {
    id: 'g1',
    name: 'Kubernetes',
    current: 25,
    target: 80,
    estimatedHours: 18,
    category: 'core',
  },
  {
    id: 'g2',
    name: 'CI/CD (GitHub Actions)',
    current: 45,
    target: 85,
    estimatedHours: 12,
    category: 'core',
  },
  {
    id: 'g3',
    name: 'GraphQL Federation',
    current: 30,
    target: 75,
    estimatedHours: 14,
    category: 'adjacent',
  },
  {
    id: 'g4',
    name: 'Rust (stretch)',
    current: 10,
    target: 60,
    estimatedHours: 24,
    category: 'stretch',
  },
];

export const roadmapWeeks: RoadmapWeek[] = [
  {
    id: 'w1',
    week: 1,
    title: 'Kubernetes Foundations',
    focus: 'Pods, services, deployments',
    hours: 8,
    milestones: ['Run a local cluster', 'Deploy a sample app', 'Read the k8s docs: networking'],
    done: true,
  },
  {
    id: 'w2',
    week: 2,
    title: 'Kubernetes in Production',
    focus: 'Probes, autoscaling, Helm',
    hours: 10,
    milestones: ['Write a Helm chart', 'Configure HPA', 'Set up liveness/readiness probes'],
    done: true,
  },
  {
    id: 'w3',
    week: 3,
    title: 'CI/CD with GitHub Actions',
    focus: 'Pipelines, caching, secrets',
    hours: 6,
    milestones: ['Build a deploy workflow', 'Add caching', 'Use OIDC for cloud auth'],
    done: false,
  },
  {
    id: 'w4',
    week: 4,
    title: 'GraphQL Federation',
    focus: 'Subgraphs, gateway, stitching',
    hours: 8,
    milestones: ['Stand up two subgraphs', 'Query through a gateway', 'Handle entity resolution'],
    done: false,
  },
  {
    id: 'w5',
    week: 5,
    title: 'Capstone Project',
    focus: 'Tie it together end-to-end',
    hours: 10,
    milestones: ['Ship a federated API on k8s', 'Automate deploys via Actions', 'Document the setup'],
    done: false,
  },
  {
    id: 'w6',
    week: 6,
    title: 'Mock Interviews',
    focus: 'Apply the new skills verbally',
    hours: 6,
    milestones: ['2 system-design mocks', '1 coding mock', 'Refine stories'],
    done: false,
  },
];
