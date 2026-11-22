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
  async invalidateQueries(keys: string[]): Promise<void> {
    await Promise.all([...new Set(keys)].map(key => this.pool.get(key)?.invalidate()));
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
