/**
 * agents/registry.ts
 *
 * Maps every AgentId to its module. This is the one place the orchestrator
 * looks up "give me the agent for id X" — it never imports an agent folder
 * directly. Adding agent #17 means: add to types/agent-id.ts, scaffold the
 * folder, add one line here.
 */
import type { AgentId } from '../types/agent-id';
import type { Agent } from '../contracts/agent.contract';

import resumeParserAgent from './resume-parser';
import jdParserAgent from './jd-parser';
import atsAgent from './ats-agent';
import resumeRewriteAgent from './resume-rewrite-agent';
import bulletImprovementAgent from './bullet-improvement-agent';
import recruiterReviewAgent from './recruiter-review-agent';
import skillGapAgent from './skill-gap-agent';
import coverLetterAgent from './cover-letter-agent';
import interviewAgent from './interview-agent';
import githubReviewAgent from './github-review-agent';
import portfolioAgent from './portfolio-agent';
import linkedinAgent from './linkedin-agent';
import careerStrategyAgent from './career-strategy-agent';
import salaryAgent from './salary-agent';
import qualityAgent from './quality-agent';
import reportAgent from './report-agent';

/**
 * Deliberately typed as `Agent<any, any>` here: the registry is a lookup
 * table keyed by string id, so it cannot know each agent's concrete input/
 * output types at this level. Callers should look the agent up by id and
 * then narrow via the agent's own exported Input/Output types, e.g.:
 *   import atsAgent, { type AtsAgentInput } from '@/agents/ats-agent'
 */
export const AGENT_REGISTRY: Record<AgentId, Agent<any, any>> = {
  'resume-parser': resumeParserAgent,
  'jd-parser': jdParserAgent,
  'ats-agent': atsAgent,
  'resume-rewrite-agent': resumeRewriteAgent,
  'bullet-improvement-agent': bulletImprovementAgent,
  'recruiter-review-agent': recruiterReviewAgent,
  'skill-gap-agent': skillGapAgent,
  'cover-letter-agent': coverLetterAgent,
  'interview-agent': interviewAgent,
  'github-review-agent': githubReviewAgent,
  'portfolio-agent': portfolioAgent,
  'linkedin-agent': linkedinAgent,
  'career-strategy-agent': careerStrategyAgent,
  'salary-agent': salaryAgent,
  'quality-agent': qualityAgent,
  'report-agent': reportAgent,
};

export function getAgent(id: AgentId): Agent<unknown, unknown> {
  return AGENT_REGISTRY[id];
}
