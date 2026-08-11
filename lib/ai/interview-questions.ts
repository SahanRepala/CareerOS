import { generateHeuristicQuestions } from '@/lib/ai/interview-heuristics';
import type { Difficulty, InterviewContext, InterviewQuestion, QuestionCategory, QuestionSource } from '@/lib/interview/types';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-5';

const CATEGORIES: QuestionCategory[] = ['technical', 'system-design', 'behavioral', 'project-discussion'];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const SOURCES: QuestionSource[] = ['resume', 'job-description', 'github', 'general'];

function buildPrompt(context: InterviewContext): string {
  const payload = {
    candidateProfile: context.profile
      ? { headline: context.profile.headline, bio: context.profile.bio, skills: context.profile.skills }
      : null,
    resume: context.resume,
    targetJobDescription: context.jobDescription,
    githubProject: context.github,
  };

  return `You are a senior technical interviewer preparing a personalized mock-interview question set for a candidate.

Here is verified, structured data already gathered by other modules in this product (resume metadata, target job description, and an AI-generated GitHub repository analysis). Do not contradict it, and do not invent facts (companies, metrics, technologies) that aren't present here:

${JSON.stringify(payload, null, 2)}

Generate 9-12 interview questions personalized to this specific candidate. Requirements:
- Every question must be traceable to something in the data above (a skill, a line in the job description, the GitHub project's tech stack/architecture/weaknesses, or the resume title). Use "groundedIn" to name that thing briefly.
- Cover a mix of these categories: "technical", "system-design", "behavioral", "project-discussion". Include at least 2 of each if the data supports it; if there's no GitHub data, skip project-discussion and add more technical/system-design instead.
- Spread difficulty across "easy", "medium", "hard".
- "source" must be one of: "resume", "job-description", "github", "general" (use "general" only for a couple of standard behavioral questions if needed to round out the set).
- Each question needs a short, specific "hint" (not the answer) and a 2-3 sentence "modelAnswer" describing what a strong answer would cover (not a full scripted answer).

Respond with ONLY a JSON object (no markdown fences, no prose outside the JSON) matching exactly this shape:

{
  "questions": [
    {
      "category": "technical" | "system-design" | "behavioral" | "project-discussion",
      "difficulty": "easy" | "medium" | "hard",
      "title": string (short, 3-8 words),
      "prompt": string (the actual question asked to the candidate),
      "hint": string,
      "modelAnswer": string,
      "source": "resume" | "job-description" | "github" | "general",
      "groundedIn": string (short reference to the specific fact this is based on, omit or empty string if source is "general")
    }
  ]
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

let counter = 0;
function id(): string {
  counter += 1;
  return `q-${Date.now().toString(36)}-${counter}`;
}

function normalizeQuestions(raw: unknown, fallback: InterviewQuestion[]): InterviewQuestion[] {
  if (!raw || typeof raw !== 'object') return fallback;
  const list = (raw as Record<string, unknown>).questions;
  if (!Array.isArray(list) || list.length === 0) return fallback;

  const normalized: InterviewQuestion[] = list
    .filter((q): q is Record<string, unknown> => !!q && typeof q === 'object')
    .map((q): InterviewQuestion | null => {
      const category = CATEGORIES.includes(q.category as QuestionCategory)
        ? (q.category as QuestionCategory)
        : 'technical';
      const difficulty = DIFFICULTIES.includes(q.difficulty as Difficulty)
        ? (q.difficulty as Difficulty)
        : 'medium';
      const source = SOURCES.includes(q.source as QuestionSource) ? (q.source as QuestionSource) : 'general';
      const title = typeof q.title === 'string' && q.title.trim() ? q.title.trim() : null;
      const prompt = typeof q.prompt === 'string' && q.prompt.trim() ? q.prompt.trim() : null;
      if (!title || !prompt) return null;

      const groundedIn =
        typeof q.groundedIn === 'string' && q.groundedIn.trim() ? q.groundedIn.trim() : undefined;

      const question: InterviewQuestion = {
        id: id(),
        category,
        difficulty,
        title,
        prompt,
        hint: typeof q.hint === 'string' && q.hint.trim() ? q.hint.trim() : 'Be specific and give a concrete example.',
        modelAnswer:
          typeof q.modelAnswer === 'string' && q.modelAnswer.trim()
            ? q.modelAnswer.trim()
            : 'A strong answer is specific, structured, and grounded in a real example.',
        source,
        ...(groundedIn ? { groundedIn } : {}),
      };
      return question;
    })
    .filter((q): q is InterviewQuestion => q !== null);

  return normalized.length > 0 ? normalized : fallback;
}

/**
 * Generates a personalized interview question set from data reused verbatim
 * from the Resume, Job Description, and GitHub Intelligence modules. Calls
 * the Anthropic API when `ANTHROPIC_API_KEY` is configured; otherwise (or on
 * any failure) falls back to a deterministic, template-based generator so
 * the module always returns a usable, grounded question set.
 */
export async function generateInterviewQuestions(context: InterviewContext): Promise<InterviewQuestion[]> {
  const baseline = generateHeuristicQuestions(context);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
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
        max_tokens: 3200,
        messages: [{ role: 'user', content: buildPrompt(context) }],
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
    return normalizeQuestions(parsed, baseline);
  } catch (err) {
    console.error('Interview Prep: AI question generation failed', err);
    return baseline;
  }
}
