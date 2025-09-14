import { type DependencyList, useCallback, useEffect, useMemo, useState } from 'react';
import type { UseQueryOptions, UseQueryReturn } from './types.ts';
import { useLatestRef } from '../use-latest-ref.ts';
import { useQueryControl } from './use-query-control.ts';
import { generateId } from './utils.ts';

/**
 * Hook for declarative fetching some data from any source (REST API, GraphQL, etc).
 * This is a minimalistic analogue of `useQuery` from `@tanstack/react-query` made for educational purposes.
 * @param options Query configuration.
 * @param deps Dependencies that will invalidate query.
 * @returns State of query: data, error status and more.
 */
export function useQuery<T>(
  { key: keyProp, query, enabled = true }: UseQueryOptions<T>,
  deps: DependencyList = [],
): UseQueryReturn<T> {
  const key = useMemo(() => keyProp ?? generateId('query:'), [keyProp]);
  const control = useQueryControl<T>(key);
  const [state, setState] = useState(() => control.getState());

  const queryRef = useLatestRef(query);

  const invalidate = useCallback(() => {
    // skip if disabled
    if (!enabled) {
      return;
    }

    // skip if already pending
    if (control.getState().status === 'pending') {
      return;
    }

    control.makeQuery(queryRef.current);
  }, [enabled, control, queryRef]);

  const invalidateRef = useLatestRef(invalidate);

  useEffect(() => {
    // skip if disabled
    if (!enabled) {
      return;
    }

    const onChanged = () => {
      setState(control.getState());
    };

    const onInvalidated = () => {
      invalidateRef.current();
    };

    control.events.addEventListener('changed', onChanged);
    control.events.addEventListener('invalidated', onInvalidated);

    setState(control.getState());

    return () => {
      control.events.removeEventListener('changed', onChanged);
      control.events.removeEventListener('invalidated', onInvalidated);
    };
  }, [enabled, control, invalidateRef]);

  useEffect(() => {
    // skip if disabled
    if (!enabled) {
      return;
    }

    // skip if already pending
    if (control.getState().status === 'pending') {
      return;
    }

    control.makeQuery(queryRef.current).catch(() => {});
  }, [
    enabled,
    control,
    queryRef,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);

  return useMemo(
    () => ({
      ...state,
      invalidate,
    }),
    [state, invalidate],
  );
}
