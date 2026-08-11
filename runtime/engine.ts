import { ExecutionContext } from './context';
import { WorkflowGraph, WorkflowExecutor } from './types';
import { CapabilityRegistry } from '../registry/specialized';
import { EventBus } from '../lib/events/types';
import { WorkflowScheduler } from './scheduler';
import { Pipeline } from './pipeline';

export class RuntimeEngine implements WorkflowExecutor {
  constructor(
    private capabilityRegistry: CapabilityRegistry,
    private eventBus: EventBus,
    private pipeline: Pipeline
  ) {}

  async execute(
    workflowGraph: WorkflowGraph,
    input: unknown,
    context: ExecutionContext
  ): Promise<unknown> {
    this.eventBus.publish({
      type: 'workflow_started',
      metadata: {
        correlationId: context.correlationId,
        timestamp: new Date(),
        source: 'runtime-engine',
        lifecycleStage: 'start',
      },
      payload: { workflowId: workflowGraph.id },
    });

    const nodeOutputs = new Map<string, unknown>();

    try {
      const levels = WorkflowScheduler.getExecutionOrder(workflowGraph);

      for (const level of levels) {
        await Promise.all(
          level.map(async (node) => {
            const capability = this.capabilityRegistry.get(node.capabilityId);
            if (!capability) {
              throw new Error(`Capability ${node.capabilityId} not found`);
            }

            this.eventBus.publish({
              type: 'capability_started',
              metadata: {
                correlationId: context.correlationId,
                timestamp: new Date(),
                source: 'runtime-engine',
                lifecycleStage: 'start',
              },
              payload: { capabilityId: node.capabilityId },
            });

            // Validate
            const validationErrors = capability.validate(input);
            if (validationErrors.length > 0) {
              throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
            }

            const startTime = Date.now();
            const output = await this.pipeline.run(capability, input, context);
            const executionTimeMs = Date.now() - startTime;
            
            nodeOutputs.set(node.id, output);

            this.eventBus.publish({
              type: 'capability_finished',
              metadata: {
                correlationId: context.correlationId,
                timestamp: new Date(),
                source: 'runtime-engine',
                lifecycleStage: 'end',
              },
              payload: { capabilityId: node.capabilityId, executionTimeMs },
            });
            
            return output;
          })
        );
      }
    } catch (error) {
      this.eventBus.publish({
        type: 'workflow_failed',
        metadata: {
          correlationId: context.correlationId,
          timestamp: new Date(),
          source: 'runtime-engine',
          lifecycleStage: 'end',
        },
        payload: { error },
      });
      throw error;
    }

    this.eventBus.publish({
      type: 'workflow_finished',
      metadata: {
        correlationId: context.correlationId,
        timestamp: new Date(),
        source: 'runtime-engine',
        lifecycleStage: 'end',
      },
      payload: { workflowId: workflowGraph.id },
    });

    // Return all node outputs, or compose as needed
    return Object.fromEntries(nodeOutputs);
  }
}
