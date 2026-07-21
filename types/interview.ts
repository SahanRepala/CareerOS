export type QuestionCategory = 'technical' | 'behavioral' | 'system_design';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface InterviewQuestion {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  modelAnswer: string;
  feedback: Feedback;
}
