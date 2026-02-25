import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { keys } from '../keys.ts';

describe('keys', () => {
  test('should return all keys', () => {
    const a = { foo: 1 };
    const b = { bar: 3 };

    expect([...keys(a, b)]).toEqual(['foo', 'bar']);
  });

  test('should return unique keys array', () => {
    const a = { foo: 1, bar: 2 };
    const b = { bar: 3, baz: 4 };

    expect([...keys(a, b)]).toEqual(['foo', 'bar', 'baz']);
  });

  test('should return empty array', () => {
    const a = {};
    const b = {};

    expect([...keys(a, b)]).toEqual([]);
  });

  test('should pick keys from three objects', () => {
    const a = { name: 'John' };
    const b = { age: 23 };
    const c = { sex: 'male' };
    const d = { role: 'guest' };

    expect([...keys(a, b, c, d)]).toEqual(['name', 'age', 'sex', 'role']);
  });

  test('should handle empty key properly', () => {
    const a = { '': 'FooBar' };

    expect([...keys(a)]).toEqual(['']);
  });

  test('should handle reserved keys properly', () => {
    const a = { toString: 1 };
    const b = { valueOf: 2 };

    expect([...keys(a, b)]).toEqual(['toString', 'valueOf']);
  });

  test('should handle arrays', () => {
    const a = [1, 1, 1];
    const b = [2, 2, 2, 2, 2];

    expect([...keys(a, b)]).toEqual(['0', '1', '2', '3', '4']);
  });
});
