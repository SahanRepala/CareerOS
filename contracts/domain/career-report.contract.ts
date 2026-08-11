/**
 * contracts/domain/career-report.contract.ts
 */

export interface CareerMilestone {
  title: string;
  timeframe: string;
  description: string;
}

export interface SkillGapItem {
  skill: string;
  currentLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  suggestedResources: string[];
}

export interface CareerReport {
  targetRole: string | null;
  roadmap: CareerMilestone[];
  skillGaps: SkillGapItem[];
  salaryBenchmark: { min: number; max: number; currency: string } | null;
}
