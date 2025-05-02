import { test, describe, mock } from 'node:test';
import { expect } from '@std/expect';
import { once } from '../once.ts';

describe('once', () => {
  test('Should call wrapped function once', () => {
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
});
