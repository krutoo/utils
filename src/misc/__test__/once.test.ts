import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { once } from '../once.ts';

describe('once', () => {
  test('should call wrapped function once', () => {
    const spy = mock.fn(() => Math.random());
    const func = once(spy);

    expect(spy.mock.callCount()).toBe(0);

    const firstResult = func();
    expect(spy.mock.callCount()).toBe(1);

    let secondResult = func();
    expect(spy.mock.callCount()).toBe(1);
    expect(Object.is(firstResult, secondResult)).toBe(true);

    secondResult = func();
    secondResult = func();
    expect(spy.mock.callCount()).toBe(1);
    expect(Object.is(firstResult, secondResult)).toBe(true);

    secondResult = func();
    secondResult = func();
    secondResult = func();
    expect(spy.mock.callCount()).toBe(1);
    expect(Object.is(firstResult, secondResult)).toBe(true);
  });

  test('should throw on first call and return undefined after failure', () => {
    const error = new Error('boom');
    const spy = mock.fn(() => {
      throw error;
    });
    const func = once(spy);

    let caught: unknown;
    try {
      func();
    } catch (thrown) {
      caught = thrown;
    }

    expect(caught).toBe(error);
    expect(func()).toBeUndefined();
    expect(func()).toBeUndefined();
    expect(spy.mock.callCount()).toBe(1);
  });
});
