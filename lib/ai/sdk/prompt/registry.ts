export interface PromptTemplate {
  id: string;
  version: string;
  template: string;
}

export interface PromptRegistry {
  get(id: string, version: string): Promise<PromptTemplate>;
}
