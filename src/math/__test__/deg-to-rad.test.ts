import { test } from '@std/testing/bdd';
import { expect } from '@std/expect/expect';
import { degToRad } from '../deg-to-rad.ts';

test('should return radians', () => {
  expect(degToRad(1)).toBe(0.017453292519943295);
  expect(degToRad(30)).toBe(0.5235987755982988);
  expect(degToRad(45)).toBe(0.7853981633974483);
  expect(degToRad(60)).toBe(1.0471975511965976);
  expect(degToRad(90)).toBe(1.5707963267948966);
});
