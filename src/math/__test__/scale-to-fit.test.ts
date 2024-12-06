import { test } from '@std/testing/bdd';
import { expect } from '@std/expect/expect';
import { scaleToFit } from '../scale-to-fit.ts';

test('should scale target rect to fit area rect', () => {
  expect(scaleToFit({ width: 10, height: 10 }, { width: 5, height: 5 })).toEqual({
    width: 5,
    height: 5,
  });

  expect(scaleToFit({ width: 10, height: 5 }, { width: 5, height: 5 })).toEqual({
    width: 5,
    height: 2.5,
  });

  expect(scaleToFit({ width: 5, height: 5 }, { width: 10, height: 10 })).toEqual({
    width: 10,
    height: 10,
  });

  expect(scaleToFit({ width: 4, height: 3 }, { width: 10, height: 10 })).toEqual({
    width: 10,
    height: 7.5,
  });
});
