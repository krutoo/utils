import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { wait } from '../wait.ts';

describe('wait', () => {
  test('should return promise that resolves after timeout', async () => {
    const timeout = 300;

    const start = Date.now();
    await wait(timeout);
    const finish = Date.now();

    const passed = finish - start;
    expect(passed >= timeout).toBe(true);
  });
});
