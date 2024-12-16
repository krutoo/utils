import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { getPseudoRandom } from '../get-pseudo-random.ts';

describe('getPseudoRandom', () => {
  // maybe this is working differently depends on JS runtime
  test('value check', () => {
    const random = getPseudoRandom(0);

    expect(random()).toBe(0.21132115912208504);
    expect(random()).toBe(0.7094221536351166);
    expect(random()).toBe(0.5467721193415638);
  });

  test('result value should be in range 0-1', () => {
    const random = getPseudoRandom(Math.random() * 100);

    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value >= 0).toBe(true);
      expect(value <= 1).toBe(true);
    }
  });

  test('generators that based on same seed should return same values', () => {
    const first = getPseudoRandom(123);
    const second = getPseudoRandom(123);

    for (let i = 0; i < 100; i++) {
      const a = first();
      const b = second();

      expect(typeof a === 'number').toBe(true);
      expect(typeof b === 'number').toBe(true);
      expect(a).toBe(b);
    }
  });
});
