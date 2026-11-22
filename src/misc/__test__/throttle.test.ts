import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { throttle } from '../throttle.ts';

describe('throttle', () => {
  test('should throttle calls and pass just first call during timeout', () => {
    mock.timers.enable({ apis: ['setTimeout'] });

    const log: number[] = [];
    const fn = throttle((msg: number) => {
      log.push(msg);
    }, 1000);

    expect(log).toEqual([]);

    fn(1);
    expect(log).toEqual([1]);

    fn(2);
    expect(log).toEqual([1]);

    fn(3);
    fn(4);
    expect(log).toEqual([1]);

    fn(5);
    fn(6);
    fn(7);
    expect(log).toEqual([1]);

    mock.timers.tick(500);
    expect(log).toEqual([1]);

    fn(8);
    expect(log).toEqual([1]);

    fn(9);
    fn(10);
    expect(log).toEqual([1]);

    mock.timers.tick(500);
    expect(log).toEqual([1]);

    fn(11);
    expect(log).toEqual([1, 11]);

    fn(12);
    expect(log).toEqual([1, 11]);

    mock.timers.tick(1000);
    expect(log).toEqual([1, 11]);

    fn(13);
    expect(log).toEqual([1, 11, 13]);

    mock.timers.reset();
  });

  test('should delay a single call when only trailing is enabled', context => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const calls: number[] = [];
    const fn = throttle((value: number) => calls.push(value), 100, {
      leading: false,
      trailing: true,
    });

    fn(1);
    expect(calls).toEqual([]);

    context.mock.timers.tick(99);
    expect(calls).toEqual([]);

    context.mock.timers.tick(1);
    expect(calls).toEqual([1]);

    context.mock.timers.tick(100);
    expect(calls).toEqual([1]);
  });

  test('should use the latest arguments without postponing the trailing call', context => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const calls: Array<[number, string]> = [];
    const fn = throttle((...args: [number, string]) => calls.push(args), 100, {
      leading: false,
      trailing: true,
    });

    fn(1, 'first');
    context.mock.timers.tick(50);
    fn(2, 'second');
    context.mock.timers.tick(49);
    fn(3, 'last');
    expect(calls).toEqual([]);

    context.mock.timers.tick(1);
    expect(calls).toEqual([[3, 'last']]);
  });

  test('should not repeat an isolated leading call when trailing is enabled', context => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const calls: number[] = [];
    const fn = throttle((value: number) => calls.push(value), 100, {
      leading: true,
      trailing: true,
    });

    fn(1);
    expect(calls).toEqual([1]);

    context.mock.timers.tick(100);
    expect(calls).toEqual([1]);

    fn(2);
    expect(calls).toEqual([1, 2]);
  });

  test('should invoke the first call immediately and the last call at the trailing edge', context => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const calls: number[] = [];
    const fn = throttle((value: number) => calls.push(value), 100, {
      leading: true,
      trailing: true,
    });

    fn(1);
    fn(2);
    context.mock.timers.tick(50);
    fn(3);
    expect(calls).toEqual([1]);

    context.mock.timers.tick(50);
    expect(calls).toEqual([1, 3]);

    context.mock.timers.tick(100);
    expect(calls).toEqual([1, 3]);
  });

  test('should wait a full interval after a trailing invocation', context => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const calls: number[] = [];
    const fn = throttle((value: number) => calls.push(value), 100, {
      leading: true,
      trailing: true,
    });

    fn(1);
    fn(2);
    context.mock.timers.tick(100);
    expect(calls).toEqual([1, 2]);

    context.mock.timers.tick(1);
    fn(3);
    expect(calls).toEqual([1, 2]);

    context.mock.timers.tick(98);
    expect(calls).toEqual([1, 2]);

    context.mock.timers.tick(1);
    expect(calls).toEqual([1, 2, 3]);
  });

  test('should not invoke the callback when both edges are disabled', context => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const calls: number[] = [];
    const fn = throttle((value: number) => calls.push(value), 100, {
      leading: false,
      trailing: false,
    });

    fn(1);
    fn(2);
    context.mock.timers.tick(100);
    fn(3);
    context.mock.timers.tick(100);

    expect(calls).toEqual([]);
  });
});
