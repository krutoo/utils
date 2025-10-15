import { describe, mock, test } from 'node:test';
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

  test('should handle abort signal', async () => {
    const spy = mock.fn();
    const controller = new AbortController();

    wait(20000, { signal: controller.signal })
      .then(() => {
        spy('resolved');
      })
      .catch(reason => {
        spy(`rejected, reason: ${reason}`);
      });

    controller.abort('test');
    await Promise.resolve();
    await Promise.resolve();

    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments[0]).toBe('rejected, reason: test');
  });
});
