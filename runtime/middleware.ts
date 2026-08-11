import { ExecutionContext } from './context';
import { Capability } from '../capabilities/base';

export interface ExecutionResult<T = unknown> {
  status: 'succeeded' | 'failed';
  output?: T;
  error?: string;
  executionTimeMs: number;
}

export interface Middleware {
  execute<TInput, TOutput>(
    capability: Capability<TInput, TOutput>,
    input: TInput,
    context: ExecutionContext,
    next: () => Promise<TOutput>
  ): Promise<TOutput>;
}
