import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { mergeKeys } from '../merge-keys.ts';

describe('mergeKeys', () => {
  test('should return all keys', () => {
    const a = { foo: 1 };
    const b = { bar: 3 };

    expect(mergeKeys(a, b)).toEqual(['foo', 'bar']);
  });

  test('should return unique keys array', () => {
    const a = { foo: 1, bar: 2 };
    const b = { bar: 3, baz: 4 };

    expect(mergeKeys(a, b)).toEqual(['foo', 'bar', 'baz']);
  });

  test('should return empty array', () => {
    const a = {};
    const b = {};

    expect(mergeKeys(a, b)).toEqual([]);
  });

  test('should pick keys from three objects', () => {
    const a = { name: 'John' };
    const b = { age: 23 };
    const c = { sex: 'male' };
    const d = { role: 'guest' };

    expect(mergeKeys(a, b, c, d)).toEqual(['name', 'age', 'sex', 'role']);
  });
});
