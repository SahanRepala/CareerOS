import { Agent } from '../contracts/agent.contract';
import { Capability } from '../capabilities/base';
import { Registry } from './registry';

// Placeholder interfaces for Workflow, Provider, Rule until defined
export interface Workflow { id: string; }
export interface Provider { id: string; }
export interface Rule { id: string; }

export class AgentRegistry extends Registry<Agent<any, any>> {}
export class CapabilityRegistry extends Registry<Capability<any, any>> {}
export class WorkflowRegistry extends Registry<Workflow> {}
export class ProviderRegistry extends Registry<Provider> {}
export class RuleRegistry extends Registry<Rule> {}
