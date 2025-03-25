import { test, describe } from 'node:test';
import { isObject } from '../is-object.ts';
import { expect } from '@std/expect';

describe('isObject', () => {
  test('should works correctly for all values', () => {
    // object
    expect(isObject({ count: 123 })).toBe(true);
    expect(isObject(new Boolean(false))).toBe(true);
    expect(isObject(new Number(1))).toBe(true);
    expect(isObject(new String(''))).toBe(true);

    // array
    expect(isObject([1, 2, 3])).toBe(true);

    // function
    expect(isObject(() => {})).toBe(true);

    // boolean
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);

    // number
    expect(isObject(1)).toBe(false);

    // bigint
    expect(isObject(123n)).toBe(false);

    // string
    expect(isObject('2')).toBe(false);

    // null
    expect(isObject(null)).toBe(false);

    // undefined
    expect(isObject(undefined)).toBe(false);

    // symbol
    expect(isObject(Symbol())).toBe(false);
  });
});
