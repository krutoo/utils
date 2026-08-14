import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { TimerPool } from '../timer-pool.ts';

describe('TimerPool', () => {
  test('constructor should not fail in env without request/cancelAnimationFrame', () => {
    expect(() => new TimerPool()).not.toThrow();
  });
});
