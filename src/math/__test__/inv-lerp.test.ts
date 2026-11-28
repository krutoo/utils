import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { invLerp } from '../inv-lerp.ts';
import { lerp } from '../lerp.ts';

describe('invLerp', () => {
  test('should return interpolation factor', () => {
    expect(invLerp(0, 10, 0)).toBe(0);
    expect(invLerp(0, 10, 10)).toBe(1);
    expect(invLerp(0, 10, 2.5)).toBe(0.25);
    expect(invLerp(2, 12, 7)).toBe(0.5);
  });

  test('should support reversed range', () => {
    expect(invLerp(10, 0, 10)).toBe(-0);
    expect(invLerp(10, 0, 0)).toBe(1);
    expect(invLerp(10, 0, 5)).toBe(0.5);
    expect(invLerp(10, 0, 2.5)).toBe(0.75);
  });

  test('should preserve signed zero', () => {
    expect(invLerp(0, -10, 0)).toBe(-0);
  });

  test('should not clamp factor', () => {
    expect(invLerp(0, 10, -2.5)).toBe(-0.25);
    expect(invLerp(0, 10, 12.5)).toBe(1.25);
  });

  test('should return neutral factor for empty range', () => {
    expect(invLerp(5, 5, 5)).toBe(0);
    expect(invLerp(5, 5, 100)).toBe(0);
  });

  test('should be inverse of lerp', () => {
    expect(lerp(0, 10, invLerp(0, 10, 2.5))).toBe(2.5);
    expect(lerp(2, 12, invLerp(2, 12, 7))).toBe(7);
    expect(lerp(10, 0, invLerp(10, 0, 2.5))).toBe(2.5);
  });
});
