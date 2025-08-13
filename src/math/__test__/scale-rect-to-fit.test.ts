import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { scaleRectToFit } from '../scale-rect-to-fit.ts';

describe('scaleRectToFit', () => {
  test('should scale target rect to fit area rect', () => {
    expect(scaleRectToFit({ width: 10, height: 10 }, { width: 5, height: 5 })).toEqual({
      width: 5,
      height: 5,
    });

    expect(scaleRectToFit({ width: 10, height: 5 }, { width: 5, height: 5 })).toEqual({
      width: 5,
      height: 2.5,
    });

    expect(scaleRectToFit({ width: 5, height: 5 }, { width: 10, height: 10 })).toEqual({
      width: 10,
      height: 10,
    });

    expect(scaleRectToFit({ width: 4, height: 3 }, { width: 10, height: 10 })).toEqual({
      width: 10,
      height: 7.5,
    });
  });
});
