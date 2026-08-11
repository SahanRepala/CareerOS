import { generateHeuristicInsights } from '@/lib/ai/heuristic-insights';
import type {
  AIInsights,
  ArchitectureLayerId,
  EngineeringMaturityAssessment,
  QualitativeAssessment,
  RankedImprovement,
  RepoMetadata,
  RepoSignals,
  TechStackItem,
  TreeNode,
} from '@/lib/github/types';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-5';
const ARCHITECTURE_LAYERS: ArchitectureLayerId[] = [
  'frontend',
  'backend',
  'database',
  'apis',
  'authentication',
  'deployment',
];

/** Flattens the tree to a depth-limited list of paths so the prompt stays small. */
function flattenTopLevel(tree: TreeNode[], maxEntries = 120): string[] {
  const out: string[] = [];

  function walk(nodes: TreeNode[], depth: number) {
    for (const node of nodes) {
      if (out.length >= maxEntries) return;
      out.push(node.type === 'dir' ? `${node.path}/` : node.path);
      if (node.type === 'dir' && node.children && depth < 3) {
        walk(node.children, depth + 1);
      }
    }
  }

  walk(tree, 0);
  return out;
}

function buildPrompt(
  metadata: RepoMetadata,
  techStack: TechStackItem[],
  signals: RepoSignals,
  tree: TreeNode[]
): string {
  const paths = flattenTopLevel(tree);

  const context = {
    repo: {
      name: metadata.fullName,
      description: metadata.description,
      language: metadata.language,
      topics: metadata.topics,
      stars: metadata.stars,
      forks: metadata.forks,
      openIssues: metadata.openIssues,
      license: metadata.license,
      isArchived: metadata.isArchived,
      isFork: metadata.isFork,
      pushedAt: metadata.pushedAt,
    },
    techStack: techStack.map((t) => ({ label: t.label, category: t.category })),
    bestPracticeSignals: signals,
    topLevelFilesAndFolders: paths,
  };

  return `You are a senior software engineer and technical recruiter reviewing a GitHub repository for a candidate's portfolio.

Here is factual, verified data about the repository (already fetched from the GitHub API — do not contradict it):

${JSON.stringify(context, null, 2)}

Based ONLY on this data, respond with a single JSON object (no markdown fences, no prose outside the JSON) matching exactly this shape:

{
  "summary": string (2-3 sentences, what the project is and does),
  "architecture": [
    { "layer": "frontend", "detected": boolean, "summary": string },
    { "layer": "backend", "detected": boolean, "summary": string },
    { "layer": "database", "detected": boolean, "summary": string },
    { "layer": "apis", "detected": boolean, "summary": string },
    { "layer": "authentication", "detected": boolean, "summary": string },
    { "layer": "deployment", "detected": boolean, "summary": string }
  ],
  "strengths": string[] (2-5 concise bullet points),
  "weaknesses": string[] (2-5 concise bullet points),
  "codeQuality": string[] (2-4 observations about code quality/organization),
  "missingPractices": string[] (best practices absent: tests, CI/CD, Docker, README, linting, etc — only list ones actually missing),
  "scores": {
    "architecture": number (0-100),
    "maintainability": number (0-100),
    "documentation": number (0-100),
    "security": number (0-100),
    "testing": number (0-100),
    "overall": number (0-100, roughly the average of the other five)
  },
  "suggestions": string[] (3-6 actionable, specific improvement suggestions),
  "recruiterImpression": string (1-2 sentences on how this repo would read to a recruiter),
  "resumeBullets": string[] (2-5 resume-ready bullet points a candidate could use, written in first-person past-tense achievement style, grounded only in the data given, using measurable/quantified, ATS-friendly wording (e.g. lead with a strong action verb, include concrete tech-stack keywords and any real numbers available such as stars/forks/test count — never fabricate a metric that isn't in the data)),
  "engineeringMaturity": { "level": "Beginner" | "Intermediate" | "Advanced", "reasoning": string (why, citing specific detected signals) },
  "architectureQuality": { "rating": string (e.g. "Basic" | "Moderate" | "Strong"), "reasoning": string (grounded in the detected architecture layers and structure) },
  "scalabilityAssessment": { "rating": string (e.g. "Low" | "Moderate" | "High"), "reasoning": string (grounded in detected infra/db/API/IaC evidence, not speculation) },
  "maintainabilityAssessment": { "rating": string (e.g. "Low" | "Moderate" | "High"), "reasoning": string (grounded in typing/linting/tests/CI evidence) },
  "securityObservations": string[] (2-5 observations based ONLY on detected evidence — env config, license, CI, dependency files; never claim to have found a specific vulnerability that wasn't actually scanned for),
  "productionReadiness": { "rating": string (e.g. "Not yet ready" | "Nearing readiness" | "Ready"), "reasoning": string (list concrete gaps or confirm none were found) },
  "interviewQuestions": string[] (3-6 interview questions a technical interviewer could ask this candidate, each one specific to the actual detected architecture layers and tech stack — not generic questions),
  "topImprovements": [ { "priority": number (1 = highest impact, up to 5), "title": string, "impact": string (why this specific improvement matters most for this repo) } ] (top 5, ranked highest-impact first)
}

Keep every string concise and specific to this repository's actual data. Do not invent facts not supported by the context above.`;
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

const MATURITY_LEVELS: EngineeringMaturityAssessment['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

function coerceEngineeringMaturity(value: unknown, fallback: EngineeringMaturityAssessment): EngineeringMaturityAssessment {
  if (!value || typeof value !== 'object') return fallback;
  const v = value as Record<string, unknown>;
  const level = MATURITY_LEVELS.includes(v.level as EngineeringMaturityAssessment['level'])
    ? (v.level as EngineeringMaturityAssessment['level'])
    : fallback.level;
  const reasoning = typeof v.reasoning === 'string' && v.reasoning.trim() ? v.reasoning : fallback.reasoning;
  return { level, reasoning };
}

function coerceQualitativeAssessment(value: unknown, fallback: QualitativeAssessment): QualitativeAssessment {
  if (!value || typeof value !== 'object') return fallback;
  const v = value as Record<string, unknown>;
  const rating = typeof v.rating === 'string' && v.rating.trim() ? v.rating : fallback.rating;
  const reasoning = typeof v.reasoning === 'string' && v.reasoning.trim() ? v.reasoning : fallback.reasoning;
  return { rating, reasoning };
}

function coerceRankedImprovements(value: unknown, fallback: RankedImprovement[]): RankedImprovement[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  const items = value
    .filter((v): v is Record<string, unknown> => !!v && typeof v === 'object')
    .map((v, i) => ({
      priority: typeof v.priority === 'number' && Number.isFinite(v.priority) ? v.priority : i + 1,
      title: typeof v.title === 'string' && v.title.trim() ? v.title : '',
      impact: typeof v.impact === 'string' && v.impact.trim() ? v.impact : '',
    }))
    .filter((v) => v.title && v.impact)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
    .map((v, i) => ({ ...v, priority: i + 1 }));
  return items.length > 0 ? items : fallback;
}

/** Validates and normalizes the model's raw JSON into a strict `AIInsights`, filling gaps from a heuristic baseline. */
function normalizeAIResponse(raw: unknown, baseline: AIInsights): AIInsights {
  if (!raw || typeof raw !== 'object') return baseline;
  const r = raw as Record<string, unknown>;

  const architectureRaw = Array.isArray(r.architecture) ? r.architecture : [];
  const architecture = ARCHITECTURE_LAYERS.map((layer) => {
    const match = architectureRaw.find(
      (a): a is Record<string, unknown> => !!a && typeof a === 'object' && (a as Record<string, unknown>).layer === layer
    );
    const fallbackEntry = baseline.architecture.find((a) => a.layer === layer)!;
    return {
      layer,
      detected: typeof match?.detected === 'boolean' ? match.detected : fallbackEntry.detected,
      summary: typeof match?.summary === 'string' && match.summary.trim() ? match.summary : fallbackEntry.summary,
    };
  });

  const scoresRaw = (r.scores && typeof r.scores === 'object' ? r.scores : {}) as Record<string, unknown>;
  const scores = {
    architecture: coerceScore(scoresRaw.architecture, baseline.scores.architecture),
    maintainability: coerceScore(scoresRaw.maintainability, baseline.scores.maintainability),
    documentation: coerceScore(scoresRaw.documentation, baseline.scores.documentation),
    security: coerceScore(scoresRaw.security, baseline.scores.security),
    testing: coerceScore(scoresRaw.testing, baseline.scores.testing),
    overall: coerceScore(scoresRaw.overall, baseline.scores.overall),
  };

  return {
    source: 'ai',
    summary: typeof r.summary === 'string' && r.summary.trim() ? r.summary : baseline.summary,
    architecture,
    strengths: coerceStringArray(r.strengths).length ? coerceStringArray(r.strengths) : baseline.strengths,
    weaknesses: coerceStringArray(r.weaknesses).length ? coerceStringArray(r.weaknesses) : baseline.weaknesses,
    codeQuality: coerceStringArray(r.codeQuality).length ? coerceStringArray(r.codeQuality) : baseline.codeQuality,
    missingPractices: coerceStringArray(r.missingPractices),
    scores,
    suggestions: coerceStringArray(r.suggestions).length ? coerceStringArray(r.suggestions) : baseline.suggestions,
    recruiterImpression:
      typeof r.recruiterImpression === 'string' && r.recruiterImpression.trim()
        ? r.recruiterImpression
        : baseline.recruiterImpression,
    resumeBullets: coerceStringArray(r.resumeBullets).length ? coerceStringArray(r.resumeBullets) : baseline.resumeBullets,
    engineeringMaturity: coerceEngineeringMaturity(r.engineeringMaturity, baseline.engineeringMaturity),
    architectureQuality: coerceQualitativeAssessment(r.architectureQuality, baseline.architectureQuality),
    scalabilityAssessment: coerceQualitativeAssessment(r.scalabilityAssessment, baseline.scalabilityAssessment),
    maintainabilityAssessment: coerceQualitativeAssessment(r.maintainabilityAssessment, baseline.maintainabilityAssessment),
    securityObservations: coerceStringArray(r.securityObservations).length
      ? coerceStringArray(r.securityObservations)
      : baseline.securityObservations,
    productionReadiness: coerceQualitativeAssessment(r.productionReadiness, baseline.productionReadiness),
    interviewQuestions: coerceStringArray(r.interviewQuestions).length
      ? coerceStringArray(r.interviewQuestions)
      : baseline.interviewQuestions,
    topImprovements: coerceRankedImprovements(r.topImprovements, baseline.topImprovements),
  };
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  const jsonSlice = firstBrace >= 0 && lastBrace > firstBrace ? candidate.slice(firstBrace, lastBrace + 1) : candidate;
  return JSON.parse(jsonSlice);
}

/**
 * Generates the full AI-reasoning layer for a repository: a summary,
 * architecture breakdown, strengths/weaknesses, code quality notes, missing
 * best practices, a modular score, suggestions, recruiter impression, and
 * resume bullets. Calls the Anthropic API when `ANTHROPIC_API_KEY` is
 * configured; otherwise (or on any failure) falls back to a deterministic,
 * signal-driven heuristic so the feature always returns a result.
 */
export async function generateRepoInsights(
  metadata: RepoMetadata,
  techStack: TechStackItem[],
  signals: RepoSignals,
  tree: TreeNode[]
): Promise<AIInsights> {
  const baseline = generateHeuristicInsights(metadata, techStack, signals);

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
        messages: [{ role: 'user', content: buildPrompt(metadata, techStack, signals, tree) }],
      }),
    });

    if (!res.ok) {
      console.error(`GitHub Intelligence: Anthropic API returned ${res.status}`);
      return baseline;
    }

    const data = await res.json();
    const text = (data.content ?? [])
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n');

    const parsed = extractJson(text);
    return normalizeAIResponse(parsed, baseline);
  } catch (err) {
    console.error('GitHub Intelligence: AI insight generation failed', err);
    return baseline;
  }
}
