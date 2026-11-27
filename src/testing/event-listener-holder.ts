import type { AnyFunction } from '../types/functions.ts';

/** @internal */
export class EventListenerHolder<T extends AnyFunction> {
  protected instance: EventTarget;
  protected listener: T | null;

  constructor(instance: EventTarget) {
    this.instance = instance;
    this.listener = null;
  }

  get(): T | null {
    return this.listener;
  }

  set(eventName: string, listener: T | null): void {
    const { instance } = this;

    if (!listener) {
      if (this.listener) {
        instance.removeEventListener(eventName, this.listener);
        this.listener = null;
      }
      return;
    }

    if (this.listener && listener !== this.listener) {
      instance.removeEventListener(eventName, this.listener);
    }

    instance.addEventListener(eventName, listener);
    this.listener = listener;
  }
}
