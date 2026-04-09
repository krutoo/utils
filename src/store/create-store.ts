import type { Store } from './types.ts';

/**
 * Creates "store" - subscribable state container.
 * @param initialValue Initial value.
 * @returns Store.
 */
export function createStore<T>(initialValue: T): Store<T> {
  const listeners = new Set<VoidFunction>();

  let value: T = initialValue;

  return {
    get(): T {
      return value;
    },

    set(nextValue: T): void {
      if (Object.is(value, nextValue)) {
        return;
      }

      value = nextValue;

      for (const listener of listeners) {
        listener();
      }
    },

    subscribe(listener: VoidFunction): VoidFunction {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
