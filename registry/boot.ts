import { OpenRouterClient } from './provider/openrouter/client';
import { ProviderRegistry } from './registry/specialized';

export const providerRegistry = new ProviderRegistry();

providerRegistry.register({
  id: 'openrouter',
  metadata: { name: 'OpenRouter' },
  instance: new OpenRouterClient(),
});
