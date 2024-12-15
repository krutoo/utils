import { test } from '@std/testing/bdd';
import { wait } from '../wait.ts';
import { expect } from '@std/expect/expect';

test('should return promise that resolves after timeout', async () => {
  const timeout = 300;

  const start = Date.now();
  await wait(timeout);
  const finish = Date.now();

  const passed = finish - start;
  expect(passed >= timeout).toBe(true);
});
