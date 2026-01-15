import { describe, test, mock } from 'node:test';
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
});
