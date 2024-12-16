import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { plural } from '../plural.ts';

describe('plural', () => {
  test('should return correct word', () => {
    const words = ['товар', 'товара', 'товаров'];

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
});
