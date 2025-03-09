import { describe, test, mock } from 'node:test';
import { expect } from '@std/expect';
import { throttle } from '../throttle.ts';

describe('throttle', () => {
  test('should throttle calls and pass just first call during timeout', () => {
    mock.timers.enable({ apis: ['setTimeout'] });

    const log: number[] = [];

    const fn = throttle(() => {
      log.push(log.length + 1);
    }, 1000);

    expect(log).toEqual([]);

    fn();
    expect(log).toEqual([1]);

    fn();
    expect(log).toEqual([1]);

    fn();
    fn();
    expect(log).toEqual([1]);

    fn();
    fn();
    fn();
    expect(log).toEqual([1]);

    mock.timers.tick(500);
    expect(log).toEqual([1]);

    fn();
    expect(log).toEqual([1]);

    fn();
    fn();
    expect(log).toEqual([1]);

    mock.timers.tick(500);
    expect(log).toEqual([1]);

    fn();
    expect(log).toEqual([1, 2]);

    fn();
    expect(log).toEqual([1, 2]);

    mock.timers.tick(1000);
    expect(log).toEqual([1, 2]);

    fn();
    expect(log).toEqual([1, 2, 3]);

    mock.timers.reset();
  });
});
