import type { Query, QueryContext, QueryEvents, QueryState, TryExecuteResult } from './types.ts';

export class MemoryQuery<T> implements Query<T> {
  events: QueryEvents<T>;

  /** Actual state. */
  protected state: QueryState<T>;

  /** Last action that was used to run execute. */
  protected action: ((ctx: QueryContext<T>) => Promise<T>) | null;

  /** Last controller that was used to run execute. */
  protected controller: AbortController | null;

  constructor() {
    this.events = new EventTarget();
    this.state = {
      status: 'initial',
      data: null,
      error: null,
    };
    this.action = null;
    this.controller = null;
  }

  getState(): QueryState<T> {
    return this.state;
  }

  async execute(action: (ctx: QueryContext<T>) => Promise<T>): Promise<T> {
    this.action = action;
    const prevController = this.controller;
    const controller = new AbortController();
    const { signal } = controller;

    this.controller = controller;
    prevController?.abort();

    try {
      if (!signal.aborted) {
        this.setState({ ...this.state, status: 'pending', error: null });
      }

      const data = await action({
        prevData: this.state.data,
        signal,
      });

      if (!signal.aborted) {
        this.setState({ ...this.state, data, status: 'success', error: null });
      }

      return data;
    } catch (error) {
      if (!signal.aborted) {
        this.setState({ ...this.state, error, status: 'failure' });
      }

      // IMPORTANT: do not mute original error
      throw error;
    } finally {
      if (!signal.aborted) {
        this.controller = null;
      }
    }
  }

  async tryExecute(action: (ctx: QueryContext<T>) => Promise<T>): Promise<TryExecuteResult<T>> {
    if (this.state.status === 'pending') {
      return { status: 'skip' };
    }

    try {
      return { status: 'done', data: await this.execute(action) };
    } catch (error) {
      return { status: 'fail', error };
    }
  }

  // @todo maybe move to abstract class?
  async invalidate(): Promise<boolean> {
    const action = this.action;

    if (action) {
      await this.execute(action);

      return true;
    }

    return false;
  }

  protected setState(state: QueryState<T>): void {
    this.state = state;

    if (state.status === 'success') {
      this.events.dispatchEvent(new CustomEvent('done', { detail: { data: state.data } }));
    } else if (state.status === 'failure') {
      this.events.dispatchEvent(new CustomEvent('failed', { detail: { error: state.error } }));
    }

    this.events.dispatchEvent(new CustomEvent('changed'));
  }
}
