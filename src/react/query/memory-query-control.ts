import type { QueryControl, QueryControlEvents, QueryState } from './types.ts';

export class MemoryQueryControl<T> implements QueryControl<T> {
  events: QueryControlEvents;

  private state: QueryState<T>;

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

  makeQuery(query: () => Promise<T>): Promise<T> {
    this.state = { ...this.state, status: 'pending' };
    this.events.dispatchEvent(new CustomEvent('changed'));

    return query()
      .then(data => {
        this.state = { ...this.state, data, status: 'success' };
        this.events.dispatchEvent(new CustomEvent('changed'));
        return data;
      })
      .catch(error => {
        this.state = { ...this.state, error, status: 'failure' };
        this.events.dispatchEvent(new CustomEvent('changed'));
        return Promise.reject(error);
      });
  }
}
