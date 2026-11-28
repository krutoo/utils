import type { Status } from '../../types/remote-data.ts';

/** State of `useQuery` hook. */
export interface QueryState<T = unknown> {
  /** Current status of query. */
  status: Status;

  /** Data since last fetch. */
  data: null | T;

  /** Error since last failed query. */
  error: null | unknown;
}

/** Options of `useQuery` hook. */
export interface UseQueryOptions<T> {
  key?: string;

  /** Query implementation. */
  query: (ctx: QueryContext<T>) => Promise<T>;

  /** If false is passed the request will not be executed. */
  enabled?: boolean;
}

/** Return value type of `useQuery` hook. */
export interface UseQueryReturn<T = unknown> extends QueryState<T> {
  /** Trigger for forcing refetch data. */
  invalidate: () => void;
}

/** Options of `useMutation` hook. */
export interface UseMutationOptions<T, R> {
  key?: string;

  /** Mutation implementation. */
  mutation: (payload: T, context: QueryContext<R>) => Promise<R>;

  /** Callback that will be called after mutation is done. */
  onSuccess?: (data: R) => void;

  /** Callback that will be called after mutation is failed. */
  onError?: (error: unknown) => void;
}

/** Result value type of `useMutation` hook. */
export interface UseMutationReturn<T, R> extends QueryState<R> {
  /** Starts a mutation. */
  mutate: (payload: T) => Promise<R>;
}

export interface QueryManager {
  getQuery(key: string): Query<any>;
  invalidateQueries(keys: string[]): Promise<void>;
}

export interface Query<T> {
  events: QueryEvents<T>;

  getState(): QueryState<T>;

  /**
   * Calls query action and saves result.
   * @param action Query action.
   * @returns Promise with action result.
   */
  execute(action: (ctx: QueryContext<T>) => Promise<T>): Promise<T>;

  /**
   * Calls `execute` if not pending.
   * @param action Query action.
   * @returns Promise with result notation.
   */
  tryExecute(action: (ctx: QueryContext<T>) => Promise<T>): Promise<TryExecuteResult<T>>;

  /**
   * Invalidates query.
   * Returns boolean indicates that invalidation is performed or not.
   * @returns Boolean that indicates that invalidation is performed or not.
   */
  invalidate(): Promise<boolean>;
}

export interface QueryContext<T> {
  prevData: T | null;
  signal: AbortSignal;
}

export type TryExecuteResult<T> =
  | {
      status: 'done';
      data: T;
    }
  | {
      status: 'skip';
    }
  | {
      status: 'fail';
      error: unknown;
    };

export interface QueryEvents<T> extends EventTarget {
  addEventListener<K extends keyof QueryEventMap<T>>(
    type: K,
    listener: (event: QueryEventMap<T>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener<K extends keyof QueryEventMap<T>>(
    type: K,
    listener: (event: QueryEventMap<T>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}

export interface QueryEventMap<T> {
  done: QueryDoneEvent<T>;
  failed: QueryFailedEvent;
  changed: CustomEvent;
  invalidated: CustomEvent;
}

export type QueryDoneEvent<T> = CustomEvent<{ data: T }>;

export type QueryFailedEvent = CustomEvent<{ error: unknown }>;
