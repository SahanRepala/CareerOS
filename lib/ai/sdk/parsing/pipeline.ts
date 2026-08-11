import { Parser } from './parser';

export interface ResponsePipeline {
  process<T>(raw: string, schemaId: string): Promise<T>;
}
