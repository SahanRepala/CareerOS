export interface SchemaRegistry {
  getSchema(schemaId: string): Promise<Record<string, unknown>>;
}
