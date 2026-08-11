/**
 * config/model-routing.config.ts
 *
 * Where per-agent provider/model routing will live once a provider exists.
 * Every agent currently maps to `provider: null, model: null` — there is
 * intentionally no OpenAI/Anthropic/Gemini/Groq/Ollama wiring here yet, only
 * the shape that wiring will fill in.
 */
import type { AgentId } from '../types/agent-id';

export interface ModelRoutingEntry {
  /** Provider name once one is chosen, e.g. 'anthropic'. Null = not wired up. */
  provider: string | null;
  /** Model identifier once one is chosen. Null = not wired up. */
  model: string | null;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
}

const DEFAULT_ROUTING: ModelRoutingEntry = {
  provider: null,
  model: null,
  temperature: 0.3,
  maxTokens: 2000,
  timeoutMs: 30_000,
};

/** Per-agent overrides. Empty entries fall back to DEFAULT_ROUTING. */
export const MODEL_ROUTING: Record<AgentId, Partial<ModelRoutingEntry>> = {
  'resume-parser': { temperature: 0.1 },
  'jd-parser': { temperature: 0.1 },
  'ats-agent': { temperature: 0.1 },
  'resume-rewrite-agent': { temperature: 0.4, maxTokens: 3000 },
  'bullet-improvement-agent': { temperature: 0.4 },
  'recruiter-review-agent': { temperature: 0.3 },
  'skill-gap-agent': { temperature: 0.2 },
  'cover-letter-agent': { temperature: 0.6, maxTokens: 1500 },
  'interview-agent': { temperature: 0.5, maxTokens: 3000, timeoutMs: 45_000 },
  'github-review-agent': { temperature: 0.3, maxTokens: 3000, timeoutMs: 45_000 },
  'portfolio-agent': { temperature: 0.3 },
  'linkedin-agent': { temperature: 0.3 },
  'career-strategy-agent': { temperature: 0.4 },
  'salary-agent': { temperature: 0.1 },
  'quality-agent': { temperature: 0 },
  'report-agent': { temperature: 0 },
};

export function getModelRouting(agentId: AgentId): ModelRoutingEntry {
  return { ...DEFAULT_ROUTING, ...MODEL_ROUTING[agentId] };
}

/** Order providers are tried in when a chosen provider is unavailable/rate-limited. Empty until real providers exist. */
export const PROVIDER_PRIORITY: string[] = [];
