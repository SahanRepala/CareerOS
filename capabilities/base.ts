import { ExecutionContext } from '../runtime/context';

export interface ValidationError {
  path: string;
  message: string;
}

export interface CapabilityMetadata {
  name: string;
  description: string;
  version: string;
  featureFlag: string;
}

export interface Capability<TInput, TOutput> {
  id: string;
  metadata: CapabilityMetadata;
  dependencies: string[];
  validate(input: TInput): ValidationError[];
  run(input: TInput, context: ExecutionContext): Promise<TOutput>;
}
