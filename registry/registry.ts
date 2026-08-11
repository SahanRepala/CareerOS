export interface RegistryEntry<T> {
  id: string;
  metadata: Record<string, unknown>;
  instance: T;
}

export class Registry<T> {
  private entries = new Map<string, RegistryEntry<T>>();

  register(entry: RegistryEntry<T>): void {
    this.entries.set(entry.id, entry);
  }

  get(id: string): T | undefined {
    return this.entries.get(id)?.instance;
  }

  getAll(): RegistryEntry<T>[] {
    return Array.from(this.entries.values());
  }
}
