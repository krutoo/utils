import { type DependencyList, useMemo, useState } from 'react';
import type { UseQueryOptions, UseQueryReturn } from './types.ts';
import { useQueryInstance } from './use-query-instance.ts';
import { generateId } from './utils.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useStableCallback } from '../use-stable-callback.ts';

/**
 * Hook for declarative fetching some data from any source (REST API, GraphQL, etc).
 * This is a minimalistic analogue of `useQuery` from `@tanstack/react-query`.
 * @param options Query configuration.
 * @param deps Dependencies that will invalidate query.
 * @returns State of query: data, error status and more.
 */
export function useQuery<T>(
  { key: keyProp, query, enabled = true }: UseQueryOptions<T>,
  deps: DependencyList = [],
): UseQueryReturn<T> {
  const key = useMemo(() => keyProp ?? generateId('query:'), [keyProp]);

  const instance = useQueryInstance<T>(key);

  const [state, setState] = useState(() => instance.getState());

  const tryExecute = useStableCallback(() => {
    // skip if disabled
    if (!enabled) {
      return;
    }

    instance.tryExecute(query).catch(() => {});
  });

  useIsomorphicLayoutEffect(() => {
    // skip if disabled
    if (!enabled) {
      return;
    }

    const onChanged = () => {
      setState(instance.getState());
    };

    instance.events.addEventListener('changed', onChanged);
    instance.events.addEventListener('invalidated', tryExecute);

    setState(instance.getState());

    return () => {
      instance.events.removeEventListener('changed', onChanged);
      instance.events.removeEventListener('invalidated', tryExecute);
    };
  }, [
    enabled,
    instance,

    // stable:
    tryExecute,
  ]);

  useIsomorphicLayoutEffect(() => {
    tryExecute();
  }, [
    enabled,
    instance,

    // stable:
    tryExecute,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);

  return useMemo(
    () => ({
      ...state,
      invalidate: tryExecute,
    }),
    [state, tryExecute],
  );
}
