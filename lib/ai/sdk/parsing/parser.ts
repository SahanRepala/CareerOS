export interface Parser<T> {
  parse(raw: string): Promise<T>;
  repair(raw: string): Promise<string>; // JSON repair logic
  validate(content: T, schema: Record<string, unknown>): boolean;
}
