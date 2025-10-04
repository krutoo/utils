import type { Store } from './types.ts';

/**
 * Creates nano store.
 * @param initialValue Initial value.
 * @returns Nano store.
 */
export function createStore<T>(initialValue: T): Store<T> {
  const listeners = new Set<VoidFunction>();

  let currentValue: T = initialValue;

  return {
    get(): T {
      return currentValue;
    },

    set(nextValue: T): void {
      if (Object.is(currentValue, nextValue)) {
        return;
      }

      currentValue = nextValue;

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
