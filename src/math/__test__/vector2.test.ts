import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { Vector2 } from '../vector2.ts';

describe('Vector2', () => {
  test('setX', () => {
    expect(new Vector2(0, 0).setX(10)).toEqual(new Vector2(10, 0));
  });

  test('setY', () => {
    expect(new Vector2(0, 0).setY(20)).toEqual(new Vector2(0, 20));
  });

  test('add', () => {
    expect(new Vector2(1, 2).add(new Vector2(3, 4))).toEqual(new Vector2(4, 6));
  });

  test('subtract', () => {
    expect(new Vector2(5, 6).subtract(new Vector2(2, 3))).toEqual(new Vector2(3, 3));
  });

  test('scale', () => {
    expect(new Vector2(2, 3).scale(3)).toEqual(new Vector2(6, 9));
  });

  test('normalize', () => {
    expect(new Vector2(0, 10).normalize()).toStrictEqual(new Vector2(0, 1));
    expect(new Vector2(2, 3).normalize().getLength().toFixed(2)).toEqual('1.00');
    expect(new Vector2(10, 11).normalize().getLength().toFixed(2)).toEqual('1.00');
  });

  test('equalsTo', () => {
    expect(new Vector2(1, 2).equalsTo({ x: 1, y: 2 })).toBe(true);
    expect(new Vector2(1, 2).equalsTo(new Vector2(1, 2))).toBe(true);

    expect(new Vector2(1, 2).equalsTo({ x: 2, y: 2 })).toBe(false);
    expect(new Vector2(1, 2).equalsTo(new Vector2(3, 1))).toBe(false);
  });

  test('getDistance', () => {
    expect(new Vector2(-5, 0).getDistance(new Vector2(5, 0))).toBe(10);
  });

  test('getLength', () => {
    expect(new Vector2(0, 6).getLength()).toBe(6);
    expect(new Vector2(6, 0).getLength()).toBe(6);
    expect(new Vector2(1, 0).getLength()).toBe(1);
    expect(new Vector2(0, 1).getLength()).toBe(1);
    expect(new Vector2(1, 1).getLength()).toBe(Math.sqrt(2));
  });

  test('toJSON', () => {
    const result = new Vector2(20, 30).toJSON();

    expect(result).toStrictEqual({ x: 20, y: 30 });
  });

  test('clone', () => {
    const a = new Vector2(20, 30);
    const b = a.clone();

    expect(a instanceof Vector2).toBe(true);
    expect(b instanceof Vector2).toBe(true);
    expect(a.x === b.x && a.y === b.y).toBe(true);
    expect(a !== b).toBe(true);
    expect(a.equalsTo(b)).toBe(true);
    expect(b.equalsTo(a)).toBe(true);
  });

  test('static method "of"', () => {
    expect(Vector2.of(1, 2)).toStrictEqual(new Vector2(1, 2));
  });

  test('static method "from"', () => {
    const rect = {
      x: 2,
      y: 3,
      width: 10,
      height: 20,
    };

    expect(Vector2.from(rect)).toStrictEqual(new Vector2(2, 3));
  });
});
