import type { Ref, RefCallback, RefObject } from 'react';

/**
 * Create ref that updates all accepted refs from list.
 * In functional components you can use wrapper hook `useMergeRefs`.
 * @param list Refs for merge.
 * @returns Merged ref.
 */
export function mergeRefs<T>(
  list: Array<Ref<T> | RefObject<T> | RefCallback<T> | null | undefined>,
): Ref<T> {
  return (value: T) => {
    const destructors: VoidFunction[] = [];

    for (const ref of list) {
      if (typeof ref === 'function') {
        const destructor = ref(value);

        if (destructor) {
          destructors.push(destructor);
        }
      } else if (ref) {
        ref.current = value;
      }
    }

    if (destructors.length > 0) {
      return () => {
        for (const destructor of destructors) {
          destructor();
        }
      };
    }
  };
}
