import { generateHeuristicFeedback } from '@/lib/ai/interview-heuristics';
import type { AnswerFeedback, InterviewContext, InterviewQuestion } from '@/lib/interview/types';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-5';

function buildPrompt(question: InterviewQuestion, answerText: string, context: InterviewContext): string {
  const payload = {
    question: { title: question.title, prompt: question.prompt, category: question.category, difficulty: question.difficulty, groundedIn: question.groundedIn },
    candidateAnswer: answerText,
    relevantContext: {
      skills: context.profile?.skills ?? [],
      jobDescriptionTitle: context.jobDescription?.title ?? null,
      githubProjectSummary: context.github?.summary ?? null,
    },
  };

  return `You are a senior technical interviewer grading a candidate's spoken/written answer to a single interview question.

${JSON.stringify(payload, null, 2)}

Grade the candidate's actual answer (do not grade the model answer, grade what they wrote). Respond with ONLY a JSON object (no markdown fences, no prose outside the JSON) matching exactly this shape:

{
  "score": number (0-100, be a real grader — an empty or off-topic answer should score near 0, a strong specific answer should score 80+),
  "strengths": string[] (1-4 concise, specific things the answer did well; empty array if none),
  "improvements": string[] (1-4 concise, specific, actionable things to improve),
  "modelAnswer": string (2-4 sentences describing what a strong answer would cover for this specific question)
}`;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  const jsonSlice = firstBrace >= 0 && lastBrace > firstBrace ? candidate.slice(firstBrace, lastBrace + 1) : candidate;
  return JSON.parse(jsonSlice);
}

function coerceScore(value: unknown, fallback: number): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function normalizeFeedback(raw: unknown, baseline: AnswerFeedback): AnswerFeedback {
  if (!raw || typeof raw !== 'object') return baseline;
  const r = raw as Record<string, unknown>;
  return {
    score: coerceScore(r.score, baseline.score),
    strengths: coerceStringArray(r.strengths).length ? coerceStringArray(r.strengths) : baseline.strengths,
    improvements: coerceStringArray(r.improvements).length ? coerceStringArray(r.improvements) : baseline.improvements,
    modelAnswer:
      typeof r.modelAnswer === 'string' && r.modelAnswer.trim() ? r.modelAnswer.trim() : baseline.modelAnswer,
    source: 'ai',
  };
}

/**
 * Grades a single free-text interview answer. Calls the Anthropic API when
 * `ANTHROPIC_API_KEY` is configured; otherwise (or on any failure) falls back
 * to a deterministic keyword/length heuristic so feedback is always returned.
 */
export async function generateAnswerFeedback(
  question: InterviewQuestion,
  answerText: string,
  context: InterviewContext
): Promise<AnswerFeedback> {
  const baseline = generateHeuristicFeedback(question, answerText);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !answerText.trim()) {
    return baseline;
  }

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: buildPrompt(question, answerText, context) }],
      }),
    });

    if (!res.ok) {
      console.error(`Interview Prep: Anthropic API returned ${res.status}`);
      return baseline;
    }

    const data = await res.json();
    const text = (data.content ?? [])
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n');

    const parsed = extractJson(text);
    return normalizeFeedback(parsed, baseline);
  } catch (err) {
    console.error('Interview Prep: AI feedback generation failed', err);
    return baseline;
  }
}
