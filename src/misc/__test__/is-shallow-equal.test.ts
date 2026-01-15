import { test, describe } from 'node:test';
import { expect } from '@std/expect';
import { isShallowEqual } from '../is-shallow-equal.ts';

describe('isShallowEqual', () => {
  test('should works correctly', () => {
    // numbers
    expect(isShallowEqual(0, 0)).toBe(true);
    expect(isShallowEqual(1, 1)).toBe(true);
    expect(isShallowEqual(2.3, 2.3)).toBe(true);

    expect(isShallowEqual(1, 0)).toBe(false);
    expect(isShallowEqual(0, 1)).toBe(false);
    expect(isShallowEqual(0.0001, 0.0)).toBe(false);
    expect(isShallowEqual(NaN, NaN)).toBe(true);

    // booleans
    expect(isShallowEqual(true, true)).toBe(true);
    expect(isShallowEqual(false, false)).toBe(true);

    expect(isShallowEqual(true, false)).toBe(false);
    expect(isShallowEqual(false, true)).toBe(false);

    // strings
    expect(isShallowEqual('', '')).toBe(true);
    expect(isShallowEqual('aaa', 'aaa')).toBe(true);

    expect(isShallowEqual('aaa', 'bbb')).toBe(false);
    expect(isShallowEqual('', 'ccc')).toBe(false);
    expect(isShallowEqual('ddd', '')).toBe(false);

    // objects
    expect(isShallowEqual({}, {})).toBe(true);
    expect(isShallowEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isShallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true);

    expect(isShallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isShallowEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(isShallowEqual({ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 6 })).toBe(false);
    expect(isShallowEqual({ a: 1, b: 2, c: 3 }, { d: 1, e: 2, f: 3 })).toBe(false);

    // objects with different amount of entries
    expect(isShallowEqual({ a: 1, b: 2 }, { c: 3 })).toBe(false);

    // mixed
    expect(isShallowEqual(1, {})).toBe(false);
    expect(isShallowEqual(1, '1')).toBe(false);
    expect(isShallowEqual(false, 'false')).toBe(false);
    expect(isShallowEqual({ a: 123 }, 123)).toBe(false);

    // same object
    const obj = { id: 1 };
    expect(isShallowEqual(obj, obj)).toBe(true);

    // same function
    const func = () => {};
    expect(isShallowEqual(func, func)).toBe(true);
  });
});
