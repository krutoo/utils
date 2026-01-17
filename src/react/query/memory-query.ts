import type { Query, QueryContext, QueryEvents, QueryState, TryExecuteResult } from './types.ts';

export class MemoryQuery<T> implements Query<T> {
  events: QueryEvents<T>;

  protected state: QueryState<T>;

  constructor() {
    this.events = new EventTarget();
    this.state = {
      status: 'initial',
      data: null,
      error: null,
    };
  }

  getState(): QueryState<T> {
    return this.state;
  }

  async execute(action: (ctx: QueryContext<T>) => Promise<T>): Promise<T> {
    this.setState({ ...this.state, status: 'pending' });

    try {
      const data = await action({ prevData: this.state.data });

      this.setState({ ...this.state, data, status: 'success' });

      return data;
    } catch (error) {
      this.setState({ ...this.state, error, status: 'failure' });

      // IMPORTANT: do not mute original error
      throw error;
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
