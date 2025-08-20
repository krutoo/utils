import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { TimerPool } from '../timer-pool.ts';

class TestTimerPool extends TimerPool {
  getEntries() {
    return this.timers;
  }
}

describe('TimerPool', () => {
  test('setTimeout() should work correctly', () => {
    mock.timers.enable({ apis: ['setTimeout'] });

    const spy = mock.fn();
    const pool = new TestTimerPool();

    expect(spy.mock.callCount()).toBe(0);
    expect(pool.getEntries().size).toBe(0);

    // register timeout
    pool.setTimeout(spy, 1000);
    expect(spy.mock.callCount()).toBe(0);
    expect(pool.getEntries().size).toBe(1);

    // activate timeout
    mock.timers.tick(1000);
    expect(spy.mock.callCount()).toBe(1);
    expect(pool.getEntries().size).toBe(0);

    // register timeout
    pool.setTimeout(spy, 1000);
    expect(spy.mock.callCount()).toBe(1);
    expect(pool.getEntries().size).toBe(1);

    // clear all timers
    pool.clearAll();
    expect(spy.mock.callCount()).toBe(1);
    expect(pool.getEntries().size).toBe(0);

    // wait for unregistered timeout
    mock.timers.tick(1000);
    expect(spy.mock.callCount()).toBe(1);
    expect(pool.getEntries().size).toBe(0);

    mock.timers.reset();
  });

  test('setInterval() should work correctly', () => {
    mock.timers.enable({ apis: ['setInterval'] });

    const spy = mock.fn();
    const pool = new TestTimerPool();

    expect(spy.mock.callCount()).toBe(0);
    expect(pool.getEntries().size).toBe(0);

    // register interval
    pool.setInterval(spy, 1000);
    expect(spy.mock.callCount()).toBe(0);
    expect(pool.getEntries().size).toBe(1);

    // wait for interval
    mock.timers.tick(1000);
    expect(spy.mock.callCount()).toBe(1);
    expect(pool.getEntries().size).toBe(1);

    // wait for interval
    mock.timers.tick(1000);
    expect(spy.mock.callCount()).toBe(2);
    expect(pool.getEntries().size).toBe(1);

    // wait for interval
    mock.timers.tick(1000);
    expect(spy.mock.callCount()).toBe(3);
    expect(pool.getEntries().size).toBe(1);

    // clear all timers
    pool.clearAll();
    expect(spy.mock.callCount()).toBe(3);
    expect(pool.getEntries().size).toBe(0);

    // wait for interval
    mock.timers.tick(1000);
    expect(spy.mock.callCount()).toBe(3);
    expect(pool.getEntries().size).toBe(0);
  });
});
