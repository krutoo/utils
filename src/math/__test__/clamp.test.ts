import { test } from '@std/testing/bdd';
import { expect } from '@std/expect/expect';
import { clamp } from '../clamp.ts';

test('should clamp value properly', () => {
  // NaN
  expect(clamp(NaN, 0, 10)).toBe(NaN);

  // all arguments equal
  expect(clamp(1, 1, 1)).toBe(1);
  expect(clamp(2, 2, 2)).toBe(2);
  expect(clamp(10, 10, 10)).toBe(10);

  // bound values
  expect(clamp(0, 0, 2)).toBe(0);
  expect(clamp(1, 0, 2)).toBe(1);
  expect(clamp(2, 0, 2)).toBe(2);

  // outside values
  expect(clamp(-12, 0, 2)).toBe(0);
  expect(clamp(14, 0, 2)).toBe(2);

  // negative values
  expect(clamp(-5, -10, 10)).toBe(-5);
  expect(clamp(5, -10, 10)).toBe(5);

  // float
  expect(clamp(0.98, 1, 2)).toBe(1);
  expect(clamp(0.98, 0.98, 1)).toBe(0.98);
});
