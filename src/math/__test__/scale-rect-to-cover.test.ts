import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { scaleRectToCover } from '../scale-rect-to-cover.ts';

describe('scaleRectToCover', () => {
  test('should scale target rect to fit area rect', () => {
    expect(scaleRectToCover({ width: 5, height: 5 }, { width: 10, height: 20 })).toEqual({
      width: 20,
      height: 20,
    });

    expect(scaleRectToCover({ width: 5, height: 5 }, { width: 30, height: 20 })).toEqual({
      width: 30,
      height: 30,
    });
  });
});
