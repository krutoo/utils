import {
  type Ref,
  type RefCallback,
  type RefObject,
  type MutableRefObject,
  useMemo,
  useRef,
} from 'react';
import { mergeRefs } from './merge-refs.ts';

/**
 * Create ref that updates all accepted refs from list.
 *
 * @example
 * ```tsx
 * import { useMergeRefs } from '@krutoo/utils/react';
 *
 * function App ({ rootRef }: { rootRef?: Ref<HTMLDivElement> }) {
 *   const innerRef = useRef<HTMLDivElement>(null);
 *
 *   // merged ref should be used
 *   const mergedRef = useMergeRefs([rootRef, innerRef]);
 *
 *   return <div ref={mergedRef}>Hello!</div>;
 * }
 * ```
 *
 * @param refs Refs for merge.
 * @returns Merged ref.
 */
export function useMergeRefs<T>(
  refs: Array<Ref<T> | RefObject<T> | RefCallback<T> | MutableRefObject<T> | null | undefined>,
): Ref<T> {
  const listRef = useRef(refs);

  // update listRef only when items is not same as in refs param
  useMemo<void>(() => {
    if (listRef.current.length !== refs.length) {
      listRef.current = refs;
      return;
    }

    for (let i = 0; i < refs.length; i++) {
      if (listRef.current[i] !== refs[i]) {
        listRef.current = refs;
        return;
      }
    }
  }, [refs]);

  const list = listRef.current;

  return useMemo(() => mergeRefs(list), [list]);
}
