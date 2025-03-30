import type { Ref, RefObject, RefCallback, MutableRefObject } from 'react';

/**
 * Create ref that updates all accepted refs from list.
 * In functional components you can use wrapper hook `useMergeRefs`.
 * @param list Refs for merge.
 * @returns Merged ref.
 */
export function mergeRefs<T>(
  list: Array<Ref<T> | RefObject<T> | RefCallback<T> | MutableRefObject<T> | null | undefined>,
): Ref<T> {
  return (value: T) => {
    for (const ref of list) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
}
