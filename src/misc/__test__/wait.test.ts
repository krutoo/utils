import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { wait } from '../wait.ts';

describe('wait', () => {
  mock.timers.enable();

  test('should return promise that resolves after timeout', () => {
    const timeout = 300;
    const start = Date.now();

    const promise = wait(timeout).then(() => {
      const finish = Date.now();
      const passed = finish - start;

      expect(passed >= timeout).toBe(true);
    });

    mock.timers.tick(timeout);

    return promise;
  });

  test('should handle abort signal', () => {
    const spy = mock.fn();
    const controller = new AbortController();

    const promise = wait(20000, { signal: controller.signal })
      .then(() => {
        spy('resolved');
      })
      .catch(reason => {
        spy(`rejected, reason: ${reason}`);
      })
      .then(() => {
        expect(spy.mock.callCount()).toBe(1);
        expect(spy.mock.calls[0]?.arguments[0]).toBe('rejected, reason: test');
      });

    controller.abort('test');

    return promise;
  });
});
