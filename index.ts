import { LLMRuntimeImpl } from './lib/ai/sdk/runtime/llm-runtime-impl';
import { providerRegistry } from './registry/boot';
import { ResumeAnalysisCapability } from './capabilities/resume-analysis';
import { CapabilityRegistry } from './registry/specialized';

// Initialize SDK
const llmRuntime = new LLMRuntimeImpl(providerRegistry, {} as any, {} as any, {} as any);

// Register Capability
export const capabilityRegistry = new CapabilityRegistry();
capabilityRegistry.register({
  id: 'resume-analysis',
  metadata: {},
  instance: new ResumeAnalysisCapability(llmRuntime),
});
