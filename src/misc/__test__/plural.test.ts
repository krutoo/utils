import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { plural } from '../plural.ts';

const words = ['товар', 'товара', 'товаров'];

describe('plural', () => {
  test('should return correct word', () => {
    expect(plural(0, words)).toBe('товаров');

    expect(plural(1, words)).toBe('товар');
    expect(plural(2, words)).toBe('товара');
    expect(plural(3, words)).toBe('товара');
    expect(plural(4, words)).toBe('товара');
    expect(plural(5, words)).toBe('товаров');
    expect(plural(6, words)).toBe('товаров');
    expect(plural(7, words)).toBe('товаров');
    expect(plural(8, words)).toBe('товаров');
    expect(plural(9, words)).toBe('товаров');
    expect(plural(10, words)).toBe('товаров');
    expect(plural(20, words)).toBe('товаров');
    expect(plural(21, words)).toBe('товар');
    expect(plural(22, words)).toBe('товара');
    expect(plural(23, words)).toBe('товара');
    expect(plural(24, words)).toBe('товара');
    expect(plural(25, words)).toBe('товаров');

    expect(plural(100, words)).toBe('товаров');
    expect(plural(101, words)).toBe('товар');
    expect(plural(102, words)).toBe('товара');
  });

  test('should use second form for decimal fractions', () => {
    expect(plural(0.5, words)).toBe('товара');
    expect(plural(1.5, words)).toBe('товара');
    expect(plural(2.5, words)).toBe('товара');
    expect(plural(5.5, words)).toBe('товара');
    expect(plural(11.5, words)).toBe('товара');
    expect(plural(-1.72, words)).toBe('товара');
  });

  test('should return undefined for non-finite numbers', () => {
    expect(plural(Number.NaN, words)).toBeUndefined();
    expect(plural(Number.POSITIVE_INFINITY, words)).toBeUndefined();
    expect(plural(Number.NEGATIVE_INFINITY, words)).toBeUndefined();
  });

  test('should apply integer rules to large integers', () => {
    expect(plural(2 ** 53 + 4, words)).toBe('товаров');
    expect(plural(-(2 ** 53 + 4), words)).toBe('товаров');
  });
});
