import { useContext, useMemo } from 'react';
import type { Query } from './types.ts';
import { MemoryQuery } from './memory-query.ts';
import { QueryMangerContext } from './query-manager-context.tsx';

/**
 * Returns query instance from manager that provided context.
 * If context is empty or not provided, returns `MemoryQuery`.
 * @param key Key.
 * @returns Query instance.
 * @internal
 */
export function useQueryInstance<T>(key: string): Query<T> {
  const manager = useContext(QueryMangerContext);

  return useMemo<Query<T>>(() => {
    // when manager is not provided - use in memory query instance
    if (!manager) {
      return new MemoryQuery<T>();
    }

    return manager.getQuery(key);
  }, [key, manager]);
}
