import type { Status } from '../../types/mod.ts';

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
  query: () => Promise<T>;

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
  mutation: (payload: T) => Promise<R>;

  /** Callback that will be called after mutation is done. */
  onSuccess?: (data: R) => void;

  /** Callback that will be called after mutation is failed. */
  onError?: (error: unknown) => void;
}

/** Result value type of `useMutation` hook. */
export interface UseMutationReturn<T, R> extends MutationState<R> {
  /** Starts a mutation. */
  mutate: (payload: T) => Promise<R>;
}

/** State of mutation. */
export interface MutationState<T = unknown> {
  /** Status of mutation. */
  status: Status;

  /** Data from last successful mutation. */
  data: null | T;

  /** Error from last failed mutation. */
  error: null | unknown;
}

export interface QueryManager {
  getQueryControl(key: string): QueryControl<any>;
  invalidateQueries(keys: string[]): void;
}

export interface QueryControl<T> {
  makeQuery(query: () => Promise<T>): Promise<T>;
  getState(): QueryState<T>;
  events: QueryControlEvents;
}

export interface QueryControlEvents extends EventTarget {
  addEventListener<K extends keyof QueryControlEventMap>(
    type: K,
    listener: (event: QueryControlEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener<K extends keyof QueryControlEventMap>(
    type: K,
    listener: (event: QueryControlEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}

export interface QueryControlEventMap {
  changed: CustomEvent;
  invalidated: CustomEvent;
}
