export interface SkillGapItem {
  id: string;
  name: string;
  category: 'core' | 'adjacent' | 'stretch';
  current: number;
  target: number;
  estimatedHours: number;
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

export interface SkillGapSummary {
  currentMatch: number;
  targetMatch: number;
  missingSkills: number;
  estimatedWeeks: number;
  estimatedHours: number;
}
