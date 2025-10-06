import { test, describe, mock } from 'node:test';
import { expect } from '@std/expect';
import { createStore } from '../create-store.ts';

describe('createStore', () => {
  test('should create working store', () => {
    const store = createStore<number>(1);
    const spy = mock.fn();

    // initial value
    expect(store.get()).toBe(1);

    // value changes
    store.set(15);
    expect(store.get()).toBe(15);

    // value changes again
    store.set(9000);
    expect(store.get()).toBe(9000);

    // subscribe to value change
    const unsubscribe = store.subscribe(spy);

    // no calls after subscribe
    expect(spy.mock.callCount()).toBe(0);

    // no calls after change value to exact same
    store.set(9000);
    expect(spy.mock.callCount()).toBe(0);

    // calls when value changes
    store.set(-20);
    expect(spy.mock.callCount()).toBe(1);

    // no calls after unsubscribe
    unsubscribe();
    expect(spy.mock.callCount()).toBe(1);
    store.set(-100);
    expect(spy.mock.callCount()).toBe(1);
  });
});
