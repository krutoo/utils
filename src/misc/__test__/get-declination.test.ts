import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { getDeclination } from '../get-declination.ts';

describe('getDeclination', () => {
  test('should return correct word', () => {
    const words = ['товар', 'товара', 'товаров'];

    expect(getDeclination(1, words)).toBe('товар');
    expect(getDeclination(2, words)).toBe('товара');
    expect(getDeclination(3, words)).toBe('товара');
    expect(getDeclination(4, words)).toBe('товара');
    expect(getDeclination(5, words)).toBe('товаров');
    expect(getDeclination(6, words)).toBe('товаров');
    expect(getDeclination(7, words)).toBe('товаров');
    expect(getDeclination(8, words)).toBe('товаров');
    expect(getDeclination(9, words)).toBe('товаров');
    expect(getDeclination(10, words)).toBe('товаров');
    expect(getDeclination(20, words)).toBe('товаров');
    expect(getDeclination(21, words)).toBe('товар');
    expect(getDeclination(22, words)).toBe('товара');
    expect(getDeclination(23, words)).toBe('товара');
    expect(getDeclination(24, words)).toBe('товара');
    expect(getDeclination(25, words)).toBe('товаров');

    expect(getDeclination(100, words)).toBe('товаров');
    expect(getDeclination(101, words)).toBe('товар');
    expect(getDeclination(102, words)).toBe('товара');
  });
});
