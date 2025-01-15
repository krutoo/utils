import { type Ref, useMemo } from 'react';
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
 * @param list Refs for merge.
 * @returns Merged ref.
 */
export function useMergeRefs<T>(list: Array<Ref<T> | null | undefined>): Ref<T> {
  return useMemo(() => mergeRefs(list), [list]);
}
