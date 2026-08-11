import type { AnsweredQuestion, InterviewQuestion, InterviewSummary, QuestionCategory } from '@/lib/interview/types';
import { interviewCategoryMeta } from '@/lib/interview/types';

const CATEGORIES = Object.keys(interviewCategoryMeta) as QuestionCategory[];

/**
 * Combines every answered question's AI/heuristic feedback into a single
 * session summary: overall score, recurring strengths/weaknesses, and
 * suggested topics to improve — derived from the categories and grounded
 * facts ("groundedIn") tied to the lowest-scoring answers.
 */
export function summarizeInterview(
  answers: AnsweredQuestion[],
  questionsById: Record<string, InterviewQuestion>
): InterviewSummary {
  const byCategory = Object.fromEntries(
    CATEGORIES.map((c) => [c, { count: 0, total: 0 }])
  ) as Record<QuestionCategory, { count: number; total: number }>;

  const strengthCounts = new Map<string, number>();
  const improvementCounts = new Map<string, number>();
  const weakTopics: { topic: string; score: number }[] = [];

  let totalScore = 0;

  for (const answer of answers) {
    const question = questionsById[answer.questionId];
    if (!question) continue;

    totalScore += answer.feedback.score;
    byCategory[question.category].count += 1;
    byCategory[question.category].total += answer.feedback.score;

    for (const s of answer.feedback.strengths) {
      strengthCounts.set(s, (strengthCounts.get(s) ?? 0) + 1);
    }
    for (const imp of answer.feedback.improvements) {
      improvementCounts.set(imp, (improvementCounts.get(imp) ?? 0) + 1);
    }

    if (answer.feedback.score < 65) {
      weakTopics.push({
        topic: question.groundedIn || interviewCategoryMeta[question.category].label,
        score: answer.feedback.score,
      });
    }
  }

  const overallScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

  const topStrengths = Array.from(strengthCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([s]) => s);

  const topWeaknesses = Array.from(improvementCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([s]) => s);

  const suggestedTopics = Array.from(
    new Set(
      weakTopics
        .sort((a, b) => a.score - b.score)
        .map((w) => w.topic)
    )
  ).slice(0, 5);

  const byCategoryOut = Object.fromEntries(
    CATEGORIES.map((c) => [
      c,
      {
        count: byCategory[c].count,
        avgScore: byCategory[c].count > 0 ? Math.round(byCategory[c].total / byCategory[c].count) : null,
      },
    ])
  ) as InterviewSummary['byCategory'];

  return {
    overallScore,
    questionsAnswered: answers.length,
    strengths: topStrengths.length > 0 ? topStrengths : ['Answer more questions to surface strengths.'],
    weaknesses: topWeaknesses.length > 0 ? topWeaknesses : [],
    suggestedTopics,
    byCategory: byCategoryOut,
  };
}
