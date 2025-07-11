import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { identity } from '../identity.ts';

describe('identity', () => {
  test('should return first argument', () => {
    expect(identity(null)).toBe(null);
    expect(identity(undefined)).toBe(undefined);

    expect(identity(true)).toBe(true);
    expect(identity(false)).toBe(false);

    expect(identity(0)).toBe(0);
    expect(identity(1)).toBe(1);
    expect(identity(2)).toBe(2);

    expect(identity('')).toBe('');
    expect(identity('foo')).toBe('foo');

    const obj = { a: 1, b: 2, c: 3 };
    expect(identity(obj) === obj).toBe(true);
  });
});
