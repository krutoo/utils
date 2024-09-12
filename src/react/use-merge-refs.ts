// @deno-types="npm:@types/react@18"
import { type Ref, useMemo } from 'react';
import { mergeRefs } from './merge-refs.ts';

/**
 * Create ref that updates all accepted refs from list.
 * @param list Refs for merge.
 * @returns Merged ref.
 */
export function useMergeRefs<T>(list: Array<Ref<T> | null | undefined>): Ref<T> {
    return useMemo(() => mergeRefs(list), list);
}
