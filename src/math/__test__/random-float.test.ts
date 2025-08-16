import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { randomFloat, createRandomFloat } from '../random-float.ts';

describe('randomFloat', () => {
  test('should return number in bounds', () => {
    const min = -20.3;
    const max = 5.8;
    const value = randomFloat(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });
});

describe('createRandomFloat', () => {
  test('should return generator', () => {
    const min = -20.3;
    const max = 5.8;
    const value = createRandomFloat()(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });

  test('should return generator with custom random', () => {
    const min = -20.3;
    const max = 5.8;
    const value = createRandomFloat(() => 0.5)(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });
});
