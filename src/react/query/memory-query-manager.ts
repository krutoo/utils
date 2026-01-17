import { MemoryQuery } from './memory-query.ts';
import type { Query, QueryManager } from './types.ts';

/**
 * Simple implementation of `QueryManager` to store queries in memory.
 */
export class MemoryQueryManager implements QueryManager {
  private pool: Map<string, Query<any>>;

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
   * Returns query instance by key.
   * @param key Key.
   * @returns Query instance.
   */
  getQuery<T>(key: string): Query<T> {
    let result = this.pool.get(key);

    if (result) {
      return result;
    }

    result = new MemoryQuery<T>();

    this.pool.set(key, result);

    return result;
  }
}
