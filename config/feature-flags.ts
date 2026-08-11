/**
 * config/feature-flags.ts
 *
 * Every agent, plus the quality layer, is individually toggleable. All
 * default to `false` since every agent is currently a placeholder — flip one
 * to `true` only once that agent has a real implementation behind it, so
 * workflows can start routing real traffic to it without a code change
 * anywhere else.
 *
 * Reads from env vars so ops can flip flags per-environment without a
 * deploy; falls back to the DEFAULT_FLAGS below when the env var is unset.
 */
import type { AgentId } from '../types/agent-id';

export interface FeatureFlags {
  agents: Record<AgentId, boolean>;
  qualityLayerEnabled: boolean;
  futureAgentsEnabled: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  agents: {
    'resume-parser': false,
    'jd-parser': false,
    'ats-agent': false,
    'resume-rewrite-agent': false,
    'bullet-improvement-agent': false,
    'recruiter-review-agent': false,
    'skill-gap-agent': false,
    'cover-letter-agent': false,
    'interview-agent': false,
    'github-review-agent': false,
    'portfolio-agent': false,
    'linkedin-agent': false,
    'career-strategy-agent': false,
    'salary-agent': false,
    'quality-agent': false,
    'report-agent': false,
  },
  qualityLayerEnabled: false,
  futureAgentsEnabled: false,
};

function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw === 'true' || raw === '1';
}

let cached: FeatureFlags | null = null;

/** Resolves flags from env vars (FEATURE_AGENT_<ID>, FEATURE_QUALITY_LAYER,
 * FEATURE_FUTURE_AGENTS), falling back to DEFAULT_FLAGS. Cached per-process. */
export function getFeatureFlags(): FeatureFlags {
  if (cached) return cached;

  const agents = { ...DEFAULT_FLAGS.agents };
  for (const id of Object.keys(agents) as AgentId[]) {
    const envName = `FEATURE_AGENT_${id.toUpperCase().replace(/-/g, '_')}`;
    agents[id] = envBool(envName, DEFAULT_FLAGS.agents[id]);
  }

  cached = {
    agents,
    qualityLayerEnabled: envBool('FEATURE_QUALITY_LAYER', DEFAULT_FLAGS.qualityLayerEnabled),
    futureAgentsEnabled: envBool('FEATURE_FUTURE_AGENTS', DEFAULT_FLAGS.futureAgentsEnabled),
  };
  return cached;
}

export function isAgentEnabled(id: AgentId): boolean {
  return getFeatureFlags().agents[id];
}
