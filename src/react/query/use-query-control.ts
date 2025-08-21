import { useContext, useMemo } from 'react';
import type { QueryControl } from './types.ts';
import { MemoryQueryControl } from './memory-query-control.ts';
import { QueryMangerContext } from './query-manager.tsx';

/**
 * Returns query control from manager from context.
 * When context is empty returns MemoryQueryControl.
 * @param key Key.
 * @returns QueryControl.
 */
export function useQueryControl<T>(key: string): QueryControl<T> {
  const manager = useContext(QueryMangerContext);

  return useMemo<QueryControl<T>>(() => {
    // when manager is not provided - use in memory query control instance
    if (!manager) {
      return new MemoryQueryControl<T>();
    }

    return manager.getQueryControl(key);
  }, [key, manager]);
}
