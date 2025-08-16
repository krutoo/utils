import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { randomInteger, createRandomInteger } from '../random-integer.ts';

describe('randomInteger', () => {
  test('should return number in bounds', () => {
    const min = -11;
    const max = 78;
    const value = randomInteger(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });
});

describe('createRandomInteger', () => {
  test('should return generator', () => {
    const min = -11;
    const max = 78;
    const value = createRandomInteger()(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });

  test('should return generator with custom random', () => {
    const min = -1;
    const max = 1;
    const value = createRandomInteger(() => 0.5)(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });
});
