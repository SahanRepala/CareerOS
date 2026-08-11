import type { AnswerFeedback, Difficulty, InterviewContext, InterviewQuestion } from '@/lib/interview/types';

let counter = 0;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

function pick<T>(arr: T[], n: number): T[] {
  return arr.filter(Boolean).slice(0, n);
}

/**
 * Deterministic, template-based question generator used when ANTHROPIC_API_KEY
 * is not configured, or the AI call fails. Never invents facts — every question
 * is built directly from structured fields already present in the context
 * (profile skills, job description text, GitHub Intelligence insights), so it
 * always returns something grounded even without a live model call.
 */
export function generateHeuristicQuestions(context: InterviewContext): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  const skills = context.profile?.skills ?? [];
  const techStack = context.github?.techStack ?? [];

  // Resume / profile-based
  pick(skills, 3).forEach((skill, i) => {
    questions.push({
      id: id('resume'),
      category: 'technical',
      difficulty: (['easy', 'medium', 'hard'] as Difficulty[])[i % 3],
      title: `Depth check: ${skill}`,
      prompt: `Your profile lists ${skill} as a skill. Walk me through a real problem you solved with it, including a decision you'd make differently today.`,
      hint: `Be concrete: name the project, the constraint, and the trade-off.`,
      modelAnswer: `A strong answer names a specific project, states the constraint that made ${skill} the right (or only) tool, and is honest about one thing they'd change now.`,
      source: 'resume',
      groundedIn: skill,
    });
  });

  if (context.resume?.title && skills.length === 0) {
    questions.push({
      id: id('resume'),
      category: 'technical',
      difficulty: 'easy',
      title: 'Walk me through your resume',
      prompt: `Give me a two-minute walkthrough of "${context.resume.title}" — what you built, your role, and the impact.`,
      hint: 'Lead with impact, not chronology.',
      modelAnswer: 'A strong answer opens with the most impressive, most relevant result, then backs into role and scope.',
      source: 'resume',
      groundedIn: context.resume.title,
    });
  }

  // Job-description-based
  if (context.jobDescription?.description) {
    const jd = context.jobDescription.description;
    const keywords = Array.from(
      new Set(
        (jd.match(/\b[A-Z][a-zA-Z0-9+.#]{2,}\b/g) ?? [])
          .map((w) => w.trim())
          .filter((w) => !['The', 'This', 'You', 'Our', 'We', 'For'].includes(w))
      )
    ).slice(0, 3);

    keywords.forEach((kw, i) => {
      questions.push({
        id: id('jd'),
        category: i === 0 ? 'system-design' : 'technical',
        difficulty: 'medium',
        title: `${kw} in context of this role`,
        prompt: `The job description for "${context.jobDescription!.title}" references "${kw}". How would you approach it in that role, and what's a risk you'd flag early?`,
        hint: 'Tie your answer back to the specific responsibilities in the posting.',
        modelAnswer: `A strong answer connects ${kw} to a concrete responsibility in the posting and names a realistic risk or trade-off.`,
        source: 'job-description',
        groundedIn: kw,
      });
    });

    questions.push({
      id: id('jd'),
      category: 'behavioral',
      difficulty: 'medium',
      title: `Why this role at ${context.jobDescription.company ?? 'this company'}?`,
      prompt: `Based on the description for "${context.jobDescription.title}", what part of the role excites you most, and what's a gap in your experience you'd need to close fast?`,
      hint: 'Show self-awareness, not just enthusiasm.',
      modelAnswer: 'A strong answer names a specific responsibility from the posting and is candid about one real gap plus a plan to close it.',
      source: 'job-description',
      groundedIn: context.jobDescription.title,
    });
  }

  // GitHub project-specific
  if (context.github) {
    const g = context.github;
    g.interviewQuestions.slice(0, 3).forEach((q) => {
      questions.push({
        id: id('github'),
        category: 'project-discussion',
        difficulty: 'hard',
        title: `${g.repoName ?? 'Your repo'}: architecture deep dive`,
        prompt: q,
        hint: 'Reference actual files, patterns, or trade-offs from the repo — not generic answers.',
        modelAnswer: `A strong answer cites specific code paths or decisions in ${g.repoName ?? 'the repository'} rather than speaking abstractly.`,
        source: 'github',
        groundedIn: g.repoName ?? undefined,
      });
    });

    pick(techStack, 2).forEach((tech) => {
      questions.push({
        id: id('github'),
        category: 'system-design',
        difficulty: 'medium',
        title: `Scaling a ${tech} system`,
        prompt: `Your project "${g.repoName ?? 'this repo'}" uses ${tech}. If traffic grew 50x overnight, what's the first thing in that stack that breaks, and how would you fix it?`,
        hint: 'Name the actual bottleneck for this specific stack, not a generic scaling checklist.',
        modelAnswer: `A strong answer identifies a concrete bottleneck specific to ${tech} at scale and proposes a fix with a trade-off.`,
        source: 'github',
        groundedIn: tech,
      });
    });

    if (g.weaknesses.length > 0) {
      questions.push({
        id: id('github'),
        category: 'project-discussion',
        difficulty: 'medium',
        title: 'Known gap in this project',
        prompt: `The analysis flagged: "${g.weaknesses[0]}". Walk me through why that gap exists and how you'd close it with another week.`,
        hint: 'Own the gap directly — deflecting reads worse than a clear plan.',
        modelAnswer: 'A strong answer explains the real constraint (time, scope, unknowns) and gives a specific, prioritized next step.',
        source: 'github',
        groundedIn: g.repoName ?? undefined,
      });
    }
  }

  // General behavioral fallback so the set is never empty/thin
  questions.push({
    id: id('general'),
    category: 'behavioral',
    difficulty: 'easy',
    title: 'Tell me about a time you disagreed with a teammate',
    prompt: 'Describe a specific disagreement, how you approached it, and the outcome. Use the STAR framework.',
    hint: 'Focus on your actions, not their faults.',
    modelAnswer: 'A strong answer follows Situation, Task, Action, Result and quantifies the outcome.',
    source: 'general',
  });

  if (questions.length < 4) {
    questions.push({
      id: id('general'),
      category: 'system-design',
      difficulty: 'medium',
      title: 'Design a URL shortener',
      prompt: 'Design a URL shortener handling 10M writes/day. Cover ID generation, storage, and read scaling.',
      hint: 'Base62 vs hash collisions, caching, and read/write ratio.',
      modelAnswer: 'A strong answer covers ID generation strategy, storage schema, cache layer, and a back-of-envelope capacity estimate.',
      source: 'general',
    });
  }

  return questions;
}

function overlapScore(answer: string, keywords: string[]): number {
  if (keywords.length === 0) return 65;
  const lower = answer.toLowerCase();
  const hits = keywords.filter((k) => lower.includes(k.toLowerCase())).length;
  return Math.round((hits / keywords.length) * 100);
}

/** Deterministic feedback used when no AI key is configured or the AI call fails. */
export function generateHeuristicFeedback(
  question: InterviewQuestion,
  answerText: string
): AnswerFeedback {
  const trimmed = answerText.trim();
  const wordCount = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;

  const keywordPool = [question.groundedIn ?? '', ...question.title.split(/\s+/)].filter(
    (w) => w.length > 3
  );
  const relevance = overlapScore(trimmed, keywordPool);
  const lengthScore = Math.min(100, Math.round((Math.min(wordCount, 120) / 120) * 100));
  const score = wordCount === 0 ? 0 : Math.round(relevance * 0.5 + lengthScore * 0.5);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount === 0) {
    improvements.push('No answer was submitted — attempt a full response, even a rough one.');
  } else {
    if (wordCount >= 60) strengths.push('Answer has enough depth to cover the key points.');
    else improvements.push('Answer is quite short — add a concrete example or more detail.');

    if (relevance >= 50) strengths.push('Directly references the specifics of the question.');
    else improvements.push(`Tie the answer more explicitly back to "${question.groundedIn ?? question.title}".`);

    if (/\b(result|impact|reduced|increased|shipped|%|users)\b/i.test(trimmed)) {
      strengths.push('Includes a measurable outcome.');
    } else {
      improvements.push('Add a measurable outcome or result to strengthen the answer.');
    }
  }

  if (strengths.length === 0) strengths.push('Attempted the question.');
  if (improvements.length === 0) improvements.push('Consider a more concise structure (situation → action → result).');

  return {
    score,
    strengths,
    improvements,
    modelAnswer: question.modelAnswer,
    source: 'heuristic',
  };
}
