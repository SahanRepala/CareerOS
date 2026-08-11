import type { AIInsights } from '@/lib/github/types';
import { dashboardStats } from '@/lib/mock/dashboard';
import { atsMissingSkills, atsOverview, atsRecommendations, atsSectionScores } from '@/lib/mock/ats';
import { roadmapWeeks, skillGapItems, skillGapSummary } from '@/lib/mock/skill-gap';
import { resumeData } from '@/lib/mock/resume';

/**
 * The Recruiter Dashboard never recomputes scores from scratch — it reads
 * the same numbers already surfaced on the Dashboard, ATS Analysis, Skill
 * Gap, Resume, and GitHub Intelligence pages and combines them the way a
 * recruiter would when forming an opinion of a candidate.
 */

export type HiringRecommendation = 'Hire' | 'Maybe' | 'Reject';

export interface RecruiterSkillSummary {
  name: string;
  level: string;
}

export interface RecruiterSkillGap {
  name: string;
  current: number;
  target: number;
  gap: number;
  estimatedHours: number;
  category: string;
}

export interface RecruiterImprovement {
  priority: number;
  title: string;
  detail: string;
  source: 'ATS' | 'GitHub Intelligence' | 'Skill Gap';
}

export interface RecruiterProjectQuality {
  available: boolean;
  source: 'ai' | 'heuristic' | null;
  summary: string;
  maturityLevel: string | null;
  architectureRating: string | null;
  productionReadiness: string | null;
  score: number | null;
}

export interface RecruiterAtsSummary {
  overall: number;
  keywordMatch: number;
  formatting: number;
  topIssues: string[];
  missingKeywords: string[];
}

export interface RecruiterAssessment {
  hiringReadiness: number;
  recommendation: HiringRecommendation;
  recommendationReasoning: string;
  strengths: string[];
  weaknesses: string[];
  technicalSkills: {
    topSkills: RecruiterSkillSummary[];
    stackNote: string;
  };
  projectQuality: RecruiterProjectQuality;
  atsSummary: RecruiterAtsSummary;
  skillGaps: RecruiterSkillGap[];
  topImprovements: RecruiterImprovement[];
  nextActions: string[];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function statValue(id: string, fallback: number): number {
  return dashboardStats.find((s) => s.id === id)?.value ?? fallback;
}

const SKILL_LEVEL_RANK: Record<string, number> = { Expert: 4, Advanced: 3, Intermediate: 2, Beginner: 1 };

/** Weighted blend of the already-computed dashboard stats, optionally tempered by a live GitHub Intelligence score. */
function computeHiringReadiness(github: AIInsights | null): { score: number; ats: number; skills: number; strength: number; readiness: number } {
  const ats = statValue('ats', atsOverview.overall);
  const skills = statValue('skills', skillGapSummary.currentMatch);
  const strength = statValue('strength', 90);
  const readiness = statValue('readiness', 70);

  const base = clamp(ats * 0.3 + skills * 0.2 + strength * 0.25 + readiness * 0.25);
  const score = github ? clamp(base * 0.7 + github.scores.overall * 0.3) : base;

  return { score, ats, skills, strength, readiness };
}

function buildRecommendation(
  score: number,
  parts: { ats: number; skills: number; strength: number; readiness: number },
  github: AIInsights | null
): { recommendation: HiringRecommendation; reasoning: string } {
  const recommendation: HiringRecommendation = score >= 80 ? 'Hire' : score >= 60 ? 'Maybe' : 'Reject';

  const highlights = [
    `an ATS match of ${parts.ats}/100`,
    `resume strength at ${parts.strength}%`,
    `skills coverage at ${parts.skills}%`,
  ];
  const weakest = Object.entries({ ats: parts.ats, skills: parts.skills, strength: parts.strength, readiness: parts.readiness }).sort(
    (a, b) => a[1] - b[1]
  )[0];
  const weakestLabel: Record<string, string> = {
    ats: 'ATS/resume match',
    skills: 'skills coverage',
    strength: 'resume strength',
    readiness: 'interview readiness',
  };

  let reasoning = `Combining ${highlights.join(', ')}${
    github ? `, and a GitHub Intelligence score of ${github.scores.overall}/100` : ''
  } puts overall hiring readiness at ${score}/100.`;

  if (recommendation === 'Hire') {
    reasoning += ' These signals are consistently strong enough to move this candidate forward with confidence.';
  } else if (recommendation === 'Maybe') {
    reasoning += ` The main soft spot is ${weakestLabel[weakest[0]]} at ${weakest[1]}%, which is worth probing directly in a screen before deciding.`;
  } else {
    reasoning += ` ${weakestLabel[weakest[0]]} is the biggest drag at ${weakest[1]}%, and multiple areas need to improve before this profile is competitive.`;
  }

  return { recommendation, reasoning };
}

function buildStrengths(github: AIInsights | null): string[] {
  const strengths: string[] = [];

  const expertSkills = resumeData.skills.filter((s) => s.level === 'Expert').map((s) => s.name);
  if (expertSkills.length > 0) {
    strengths.push(`Expert-level proficiency in ${expertSkills.join(', ')}.`);
  }

  const strongStats = dashboardStats.filter((s) => s.value >= 85);
  strongStats.forEach((s) => strengths.push(`${s.label} is strong at ${s.value}${s.suffix ?? ''} — ${s.caption.toLowerCase()}.`));

  const strongSections = atsSectionScores.filter((s) => s.score >= 90);
  if (strongSections.length > 0) {
    strengths.push(`Resume sections well above the ATS bar: ${strongSections.map((s) => s.label).join(', ')}.`);
  }

  if (github) {
    strengths.push(...github.strengths.slice(0, 2));
  }

  return strengths.slice(0, 5);
}

function buildWeaknesses(github: AIInsights | null): string[] {
  const weaknesses: string[] = [];

  atsRecommendations
    .filter((r) => r.priority === 'high')
    .forEach((r) => weaknesses.push(r.title));

  skillGapItems
    .filter((g) => g.category === 'core' && g.target - g.current >= 30)
    .forEach((g) => weaknesses.push(`${g.name} sits well below target (${g.current}% vs a ${g.target}% bar).`));

  const weakStats = dashboardStats.filter((s) => s.value < 75);
  weakStats.forEach((s) => weaknesses.push(`${s.label} is only ${s.value}${s.suffix ?? ''} — below where recruiters typically expect it.`));

  if (github) {
    weaknesses.push(...github.weaknesses.slice(0, 2));
  }

  return weaknesses.slice(0, 5);
}

function buildTechnicalSkills(github: AIInsights | null): RecruiterAssessment['technicalSkills'] {
  const topSkills = [...resumeData.skills]
    .sort((a, b) => (SKILL_LEVEL_RANK[b.level] ?? 0) - (SKILL_LEVEL_RANK[a.level] ?? 0))
    .slice(0, 8)
    .map((s) => ({ name: s.name, level: s.level }));

  const stackFromGithub = github ? Array.from(new Set(github.architecture.filter((a) => a.detected).map((a) => a.layer))) : [];

  const stackNote = github
    ? `Resume-declared skills are corroborated by real code across ${stackFromGithub.length || 0} architecture layer${
        stackFromGithub.length === 1 ? '' : 's'
      } detected in their linked GitHub repository.`
    : 'Based on resume-declared skills only — link a GitHub repository above to corroborate these against real code.';

  return { topSkills, stackNote };
}

function buildProjectQuality(github: AIInsights | null): RecruiterProjectQuality {
  if (!github) {
    return {
      available: false,
      source: null,
      summary: 'No repository has been analyzed yet. Paste a candidate GitHub repo above to pull in a live engineering assessment.',
      maturityLevel: null,
      architectureRating: null,
      productionReadiness: null,
      score: null,
    };
  }

  return {
    available: true,
    source: github.source,
    summary: github.summary,
    maturityLevel: github.engineeringMaturity.level,
    architectureRating: github.architectureQuality.rating,
    productionReadiness: github.productionReadiness.rating,
    score: github.scores.overall,
  };
}

function buildAtsSummary(): RecruiterAtsSummary {
  return {
    overall: atsOverview.overall,
    keywordMatch: atsOverview.keywordMatch,
    formatting: atsOverview.formatting,
    topIssues: atsRecommendations.filter((r) => r.priority === 'high').map((r) => r.title),
    missingKeywords: atsMissingSkills.slice(0, 4).map((m) => m.name),
  };
}

function buildSkillGaps(): RecruiterSkillGap[] {
  return [...skillGapItems]
    .map((g) => ({
      name: g.name,
      current: g.current,
      target: g.target,
      gap: g.target - g.current,
      estimatedHours: g.estimatedHours,
      category: g.category,
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5);
}

function buildTopImprovements(github: AIInsights | null): RecruiterImprovement[] {
  const candidates: { title: string; detail: string; source: RecruiterImprovement['source']; weight: number }[] = [];

  atsRecommendations.forEach((r) => {
    const weight = r.priority === 'high' ? 90 : r.priority === 'medium' ? 60 : 30;
    candidates.push({ title: r.title, detail: r.detail, source: 'ATS', weight });
  });

  if (github) {
    github.topImprovements.forEach((imp) => {
      candidates.push({ title: imp.title, detail: imp.impact, source: 'GitHub Intelligence', weight: 100 - (imp.priority - 1) * 15 });
    });
  }

  [...skillGapItems]
    .filter((g) => g.category === 'core')
    .forEach((g) => {
      const gap = g.target - g.current;
      candidates.push({
        title: `Close the ${g.name} skill gap`,
        detail: `Currently at ${g.current}% against a ${g.target}% target (~${g.estimatedHours}h of focused work estimated).`,
        source: 'Skill Gap',
        weight: gap,
      });
    });

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((c, i) => ({ priority: i + 1, title: c.title, detail: c.detail, source: c.source }));
}

function buildNextActions(github: AIInsights | null): string[] {
  const actions: string[] = [];

  atsRecommendations
    .filter((r) => r.priority !== 'high')
    .slice(0, 2)
    .forEach((r) => actions.push(r.title));

  const nextWeek = roadmapWeeks.find((w) => !w.done);
  if (nextWeek) {
    actions.push(`Complete Week ${nextWeek.week} of the learning roadmap: "${nextWeek.title}" (${nextWeek.hours}h, focus: ${nextWeek.focus}).`);
  }

  if (github) {
    actions.push(...github.suggestions.slice(0, 2));
  } else {
    actions.push('Link a GitHub repository in the Profile page to unlock a project-quality assessment here.');
  }

  return actions.slice(0, 5);
}

/**
 * Builds the full recruiter-facing assessment by combining data already
 * computed elsewhere in the app. Pass the `AIInsights` from an analyzed
 * GitHub repository (via the existing GitHub Intelligence hook/backend) to
 * fold project-quality signals in; pass `null` to render the dashboard
 * without a linked repository.
 */
export function buildRecruiterAssessment(github: AIInsights | null): RecruiterAssessment {
  const { score, ...parts } = computeHiringReadiness(github);
  const { recommendation, reasoning } = buildRecommendation(score, parts, github);

  return {
    hiringReadiness: score,
    recommendation,
    recommendationReasoning: reasoning,
    strengths: buildStrengths(github),
    weaknesses: buildWeaknesses(github),
    technicalSkills: buildTechnicalSkills(github),
    projectQuality: buildProjectQuality(github),
    atsSummary: buildAtsSummary(),
    skillGaps: buildSkillGaps(),
    topImprovements: buildTopImprovements(github),
    nextActions: buildNextActions(github),
  };
}
