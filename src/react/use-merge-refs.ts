import { type Ref, type RefCallback, type RefObject, useRef } from 'react';
import { mergeRefs } from './merge-refs.ts';

interface HookState<T> {
  refs: Array<Ref<T> | RefObject<T> | RefCallback<T> | null | undefined>;
  merged: Ref<T>;
}

/**
 * Create ref that updates all accepted refs from list.
 * @param refs Refs for merge.
 * @returns Merged ref.
 */
export function useMergeRefs<T>(
  refs: Array<Ref<T> | RefObject<T> | RefCallback<T> | null | undefined>,
): Ref<T> {
  const stateRef = useRef<HookState<T>>(null);

  // init state once
  if (stateRef.current === null) {
    stateRef.current = {
      refs,
      merged: mergeRefs(refs),
    };
  }

  const state = stateRef.current;

  // immediately update state if `refs` is not equals to current
  // - useEffect is not used because value must be set during render, not after render
  // - useMemo is not used to reduce amount of creating functions and arrays of deps
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
