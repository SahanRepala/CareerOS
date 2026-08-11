export interface EventMetadata {
  correlationId: string;
  timestamp: Date;
  source: string;
  lifecycleStage: 'start' | 'progress' | 'end';
}

export interface Event<T = unknown> {
  type: string;
  metadata: EventMetadata;
  payload: T;
}

export type Subscriber<T = unknown> = (event: Event<T>) => void | Promise<void>;

export interface EventBus {
  publish<T>(event: Event<T>): void | Promise<void>;
  subscribe<T>(eventType: string, subscriber: Subscriber<T>): void;
  unsubscribe<T>(eventType: string, subscriber: Subscriber<T>): void;
}
