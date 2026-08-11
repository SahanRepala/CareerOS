/**
 * agents/_shared/placeholder-agent.ts
 *
 * Every agent folder under /agents is currently a placeholder: it satisfies
 * the Agent<TInput, TOutput> contract, is safe to call from the orchestrator,
 * and always returns a well-formed NOT_IMPLEMENTED result instead of doing
 * any real work. This factory is the ONLY place that boilerplate lives —
 * individual agents just describe their identity and pass their own
 * validators in. When an agent is ready for real logic, replace its call to
 * createPlaceholderAgent with a hand-written implementation of Agent<T, U>;
 * nothing else in the system needs to change because the contract is identical.
 */
import type {
  Agent,
  AgentError,
  AgentExecutionContext,
  AgentResult,
  AgentConfidence,
  AgentCostEstimate,
  AgentMetadata,
} from '../../contracts/agent.contract';
import type { AgentId } from '../../types/agent-id';

export interface PlaceholderAgentConfig<TInput, TOutput> {
  id: AgentId;
  version: string;
  /** Bump when /prompts/<agent>.md gains real content. Null until then. */
  promptVersion?: string | null;
  /** Optional custom input validation; defaults to "always valid" since there's no logic to protect yet. */
  validateInput?: (input: TInput) => AgentError[];
  /** Optional custom output validation; defaults to "always valid" since output is always null here. */
  validateOutput?: (output: TOutput | null) => AgentError[];
}

export function createPlaceholderAgent<TInput, TOutput>(
  config: PlaceholderAgentConfig<TInput, TOutput>
): Agent<TInput, TOutput> {
  let lastExecutionTimeMs: number | null = null;

  const metadata: AgentMetadata = {
    agentId: config.id,
    version: config.version,
    promptVersion: config.promptVersion ?? null,
    provider: null,
    model: null,
  };

  return {
    id: config.id,

    validateInput(input: TInput): AgentError[] {
      return config.validateInput ? config.validateInput(input) : [];
    },

    validateOutput(output: TOutput | null): AgentError[] {
      return config.validateOutput ? config.validateOutput(output) : [];
    },

    confidence(): AgentConfidence {
      return { score: 0, rationale: 'Agent is not implemented yet.' };
    },

    metadata(): AgentMetadata {
      return metadata;
    },

    version(): string {
      return config.version;
    },

    costEstimate(): AgentCostEstimate {
      return { estimatedTokens: 0, estimatedUsd: 0 };
    },

    executionTime(): number | null {
      return lastExecutionTimeMs;
    },

    async run(input: TInput, context: AgentExecutionContext): Promise<AgentResult<TOutput>> {
      const start = Date.now();
      const inputErrors = this.validateInput(input);
      lastExecutionTimeMs = Date.now() - start;

      if (inputErrors.length > 0) {
        return {
          status: 'failed',
          output: null,
          confidence: this.confidence(),
          cost: this.costEstimate(input),
          executionTimeMs: lastExecutionTimeMs,
          metadata,
          errors: inputErrors,
        };
      }

      return {
        status: 'not_implemented',
        output: null,
        confidence: this.confidence(),
        cost: this.costEstimate(input),
        executionTimeMs: lastExecutionTimeMs,
        metadata,
        errors: [
          {
            code: 'NOT_IMPLEMENTED',
            message: `${config.id} has an architecture placeholder but no implementation yet.`,
            details: { executionId: context.executionId },
          },
        ],
      };
    },
  };
}
