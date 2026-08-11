import { Event, EventBus, Subscriber } from './types';

export class InMemoryEventBus implements EventBus {
  private subscribers = new Map<string, Subscriber[]>();

  publish<T>(event: Event<T>): void {
    const subs = this.subscribers.get(event.type) || [];
    subs.forEach((sub) => sub(event));
  }

  subscribe<T>(eventType: string, subscriber: Subscriber<T>): void {
    const subs = this.subscribers.get(eventType) || [];
    this.subscribers.set(eventType, [...subs, subscriber as Subscriber]);
  }

  unsubscribe<T>(eventType: string, subscriber: Subscriber<T>): void {
    const subs = this.subscribers.get(eventType) || [];
    this.subscribers.set(
      eventType,
      subs.filter((s) => s !== subscriber)
    );
  }
}
