import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { scaleRectToContain } from '../scale-rect-to-contain.ts';

describe('scaleRectToContain', () => {
  test('should scale target rect to fit area rect', () => {
    expect(scaleRectToContain({ width: 10, height: 10 }, { width: 5, height: 5 })).toEqual({
      width: 5,
      height: 5,
    });

    expect(scaleRectToContain({ width: 10, height: 5 }, { width: 5, height: 5 })).toEqual({
      width: 5,
      height: 2.5,
    });

    expect(scaleRectToContain({ width: 5, height: 5 }, { width: 10, height: 10 })).toEqual({
      width: 10,
      height: 10,
    });

    expect(scaleRectToContain({ width: 4, height: 3 }, { width: 10, height: 10 })).toEqual({
      width: 10,
      height: 7.5,
    });
  });
});
