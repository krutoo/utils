import { type DependencyList, useMemo, useRef, useState } from 'react';
import { isShallowEqual } from '../../mod.ts';
import { zeroDeps } from '../constants.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useStableCallback } from '../use-stable-callback.ts';
import type { Query, UseQueryOptions, UseQueryReturn } from './types.ts';
import { useQueryInstance } from './use-query-instance.ts';
import { generateId } from './utils.ts';

interface Dependencies<T> {
  instance: Query<T>;
  deps: DependencyList;

  // @todo replace by disabled for consistency between hooks in this library?
  enabled: boolean;
}

/**
 * Hook for declarative fetching some data from any source (REST API, GraphQL, etc).
 * This is a minimalistic analogue of `useQuery` from `@tanstack/react-query`.
 * @param options Query configuration.
 * @param deps Dependencies that will invalidate query.
 * @returns State of query: data, error status and more.
 */
export function useQuery<T>(
  { key: keyProp, query, enabled = true }: UseQueryOptions<T>,
  deps: DependencyList = zeroDeps,
): UseQueryReturn<T> {
  const key = useMemo(() => keyProp ?? generateId('query:'), [keyProp]);

  const instance = useQueryInstance<T>(key);

  const [state, setState] = useState(() => instance.getState());

  const depsRef = useRef<Dependencies<T> | null>(null);

  const invalidate = useStableCallback(() => {
    if (!enabled) {
      return;
    }

    instance.invalidate().catch(() => {});
  });

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const onChanged = () => {
      setState(instance.getState());
    };

    instance.events.addEventListener('changed', onChanged);

    setState(instance.getState());

    return () => {
      instance.events.removeEventListener('changed', onChanged);
    };
  }, [enabled, instance]);

  useIsomorphicLayoutEffect(() => {
    const prev = depsRef.current;

    depsRef.current = {
      instance,
      enabled,
      deps,
    };

    if (!enabled) {
      return;
    }

    const changed = prev !== null && !isShallowEqual(deps, prev.deps);
    const connecting = prev === null || prev.instance !== instance || !prev.enabled;

    if (connecting) {
      instance.tryExecute(query).catch(() => {});
    } else if (changed) {
      instance.execute(query).catch(() => {});
    }
  });

  return useMemo(
    () => ({
      ...state,
      invalidate,
    }),
    [state, invalidate],
  );
}
