import { type DependencyList, useCallback, useEffect, useMemo, useState } from 'react';
import type { Status } from '../types/mod.ts';
import { useIdentityRef } from './use-identity-ref.ts';

/** Options of `useQuery` hook. */
export interface UseQueryOptions<T> {
  /** Query implementation. */
  query: () => Promise<T>;

  /** If false is passed the request will not be executed. */
  enabled?: boolean;
}

/** State of `useQuery` hook. */
export interface QueryState<T = unknown> {
  /** Current status of query. */
  status: Status;

  /** Data since last fetch. */
  data?: null | T;

  /** Error since last failed query. */
  error?: null | unknown;
}

/** Return value type of `useQuery` hook. */
export interface UseQueryReturn<T = unknown> extends QueryState<T> {
  /** Trigger for forcing refetch data. */
  invalidate: () => void;
}

/**
 * Hook for fetching some data from any source.
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
  { query, enabled = true }: UseQueryOptions<T>,
  deps: DependencyList = [],
): UseQueryReturn<T> {
  const [state, setState] = useState<QueryState<T>>(() => ({
    status: enabled ? 'fetching' : 'initial',
    data: null,
    error: null,
  }));

  const [count, setCount] = useState(0);

  const queryFnRef = useIdentityRef(query);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setState(current => ({
      ...current,
      status: 'fetching',
    }));

    const request = queryFnRef.current;

    request()
      .then(result => {
        setState(current => ({
          ...current,
          data: result,
          status: 'success',
        }));
      })
      .catch(error => {
        setState(current => ({
          ...current,
          error,
          status: 'failure',
        }));
      });
  }, [enabled, count, ...deps]);

  const invalidate = useCallback((): void => {
    setCount(c => c + 1);
  }, []);

  return useMemo<UseQueryReturn<T>>(() => {
    return {
      ...state,
      invalidate,
    };
  }, [state, invalidate]);
}
