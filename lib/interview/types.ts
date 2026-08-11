export type QuestionCategory = 'technical' | 'system-design' | 'behavioral' | 'project-discussion';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionSource = 'resume' | 'job-description' | 'github' | 'general';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  hint: string;
  modelAnswer: string;
  /** What grounded this question — shown as a small tag so the candidate sees *why* it was asked. */
  source: QuestionSource;
  /** Short label naming the resume bullet / repo / JD line this question is rooted in, if any. */
  groundedIn?: string;
}

/** Result of grading a single free-text answer. */
export interface AnswerFeedback {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  source: 'ai' | 'heuristic';
}

export interface AnsweredQuestion {
  questionId: string;
  answerText: string;
  feedback: AnswerFeedback;
  answeredAt: string;
}

export interface InterviewSummary {
  overallScore: number;
  questionsAnswered: number;
  strengths: string[];
  weaknesses: string[];
  suggestedTopics: string[];
  byCategory: Record<QuestionCategory, { count: number; avgScore: number | null }>;
}

/** The bundle of existing-module data used to personalize a session. Everything here is optional
 * except the fact that at least *something* should be present for a good result. */
export interface InterviewContext {
  profile: {
    headline: string | null;
    bio: string | null;
    skills: string[];
  } | null;
  resume: {
    title: string;
    originalFilename: string | null;
  } | null;
  jobDescription: {
    title: string;
    company: string | null;
    description: string | null;
  } | null;
  github: {
    repoName: string | null;
    summary: string | null;
    techStack: string[];
    strengths: string[];
    weaknesses: string[];
    interviewQuestions: string[];
    engineeringMaturity: string | null;
  } | null;
}

export const interviewCategoryMeta: Record<
  QuestionCategory,
  { label: string; icon: string; accent: string; description: string }
> = {
  technical: {
    label: 'Technical',
    icon: 'Cpu',
    accent: 'primary',
    description: 'Core CS, language, and framework depth pulled from your skills and stack.',
  },
  'system-design': {
    label: 'System Design',
    icon: 'Network',
    accent: 'accent',
    description: 'Architecture and scale trade-offs, informed by your GitHub project.',
  },
  behavioral: {
    label: 'Behavioral',
    icon: 'Users',
    accent: 'secondary',
    description: 'STAR-format stories about ownership, conflict, and delivery.',
  },
  'project-discussion': {
    label: 'Project Discussion',
    icon: 'FolderGit2',
    accent: 'primary',
    description: 'Deep dives on the specific repo you analyzed with GitHub Intelligence.',
  },
};
