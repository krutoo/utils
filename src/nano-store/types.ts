/**
 * Simple state container interface.
 */
export interface StateContainer<T> {
  /** Get value. */
  get(): T;

  /** Set value. */
  set(value: T): void;
}

/**
 * Simple subscribable interface.
 */
export interface Subscribable {
  /**
   * Subscribe.
   * @param listener Function.
   * @returns Unsubscribe function.
   */
  subscribe(listener: VoidFunction): VoidFunction;
}

/**
 * Store - subscribable state container.
 */
export interface Store<T> extends Subscribable, StateContainer<T> {}
