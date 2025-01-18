import { MemoryQueryControl } from './memory-query-control.ts';
import type { QueryControl, QueryManager } from './types.ts';

/**
 * Simple implementation of `QueryManager` to store queries in memory.
 */
export class MemoryQueryManager implements QueryManager {
  private pool: Map<string, QueryControl<any>>;

  constructor() {
    this.pool = new Map();
  }

  /**
   * Invalidates queries by keys.
   * @param keys Keys.
   */
  invalidateQueries(keys: string[]): void {
    for (const key of keys) {
      this.pool.get(key)?.events.dispatchEvent(new CustomEvent('invalidated'));
    }
  }

  /**
   * Returns query control instance by key.
   * @param key Key.
   * @returns Query control instance.
   */
  getQueryControl<T>(key: string): QueryControl<T> {
    let result = this.pool.get(key);

    if (result) {
      return result;
    }

    result = new MemoryQueryControl<T>();

    this.pool.set(key, result);

    return result;
  }
}
