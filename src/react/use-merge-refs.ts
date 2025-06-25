import { type Ref, type RefCallback, type RefObject, type MutableRefObject, useRef } from 'react';
import { mergeRefs } from './merge-refs.ts';

interface State<T> {
  refs: Array<Ref<T> | RefObject<T> | RefCallback<T> | MutableRefObject<T> | null | undefined>;
  merged: Ref<T>;
}

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
  const stateRef = useRef<State<T>>(null);

  // init state once
  if (stateRef.current === null) {
    stateRef.current = {
      refs,
      merged: mergeRefs(refs),
    };
  }

  const state = stateRef.current;

  // change state if `refs` value is not equal shallow to previous value
  if (!Object.is(state.refs, refs)) {
    if (state.refs.length !== refs.length) {
      state.refs = refs;
      state.merged = mergeRefs(refs);
    } else {
      for (let i = 0; i < refs.length; i++) {
        if (state.refs[i] !== refs[i]) {
          state.refs = refs;
          state.merged = mergeRefs(refs);
          break;
        }
      }
    }
  }

  return state.merged;
}
