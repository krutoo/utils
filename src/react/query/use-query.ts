import { type DependencyList, useCallback, useEffect, useMemo, useState, useContext } from 'react';
import type { QueryControl, UseQueryOptions, UseQueryReturn } from './types.ts';
import { useLatestRef } from '../use-latest-ref.ts';
import { QueryMangerContext } from './query-manager.tsx';
import { MemoryQueryControl } from './memory-query-control.ts';

/**
 * Hook for declarative fetching some data from any source (REST API, GraphQL, etc).
 *
 * This is a minimalistic analogue of `useQuery` from `@tanstack/react-query` made for educational purposes.
 *
 * @param options Query configuration.
 * @param deps Dependencies that will invalidate query.
 * @returns State of query: data, error status and more.
 *
 * @example
 * ```tsx
 * import { useQuery } from '@krutoo/utils/react';
 *
 * function App () {
 *   const user = useQuery({
 *     async query() {
 *       return fetch('/api/user/current').then(res => res.json());
 *     },
 *   });
 *
 *   if (user.status === 'fetching') {
 *     return 'Loading...';
 *   }
 *
 *   if (user.status === 'failure') {
 *     return `Error: ${user.error}`;
 *   }
 *
 *   return <div>Hello, {user.name}!</div>;
 * }
 * ```
 */
export function useQuery<T>(
  { key: keyProp, query, enabled = true }: UseQueryOptions<T>,
  deps: DependencyList = [],
): UseQueryReturn<T> {
  const key = useMemo(() => keyProp ?? `query:${Math.random().toString(16).slice(2)}`, [keyProp]);

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

    control.makeQuery(queryRef.current);
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

/**
 * Returns query control from manager from context.
 * When context is empty returns MemoryQueryControl.
 * @param key Key.
 * @returns QueryControl.
 */
function useQueryControl<T>(key: string): QueryControl<T> {
  const manager = useContext(QueryMangerContext);

  return useMemo<QueryControl<T>>(() => {
    // when manager is not provided - use in memory query control instance
    if (!manager) {
      return new MemoryQueryControl<T>();
    }

    return manager.getQueryControl(key);
  }, [key, manager]);
}
