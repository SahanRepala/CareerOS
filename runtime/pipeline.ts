import { Capability } from '../capabilities/base';
import { ExecutionContext } from './context';
import { Middleware } from './middleware';

export class Pipeline {
  constructor(private middlewares: Middleware[]) {}

  async run<TInput, TOutput>(
    capability: Capability<TInput, TOutput>,
    input: TInput,
    context: ExecutionContext
  ): Promise<TOutput> {
    let index = 0;

    const next = async (): Promise<TOutput> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        return middleware.execute(capability, input, context, next);
      }
      return capability.run(input, context);
    };

    return next();
  }
}
