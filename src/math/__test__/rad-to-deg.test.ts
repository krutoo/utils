import { test } from '@std/testing/bdd';
import { expect } from '@std/expect/expect';
import { radToDeg } from '../rad-to-deg.ts';

test('should return degrees', () => {
  expect(radToDeg(1)).toBe(57.29577951308232);
  expect(radToDeg(20)).toBe(1145.9155902616465);
  expect(radToDeg(400)).toBe(22918.31180523293);
});
