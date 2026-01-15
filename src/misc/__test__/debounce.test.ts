import { describe, test, mock } from 'node:test';
import { debounce } from '../debounce.ts';
import { expect } from '@std/expect';

describe('debounce', () => {
  test('should work properly', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const spy = mock.fn();
    const debounced = debounce(spy, 200);

    // check initial call delay
    debounced();
    expect(spy.mock.callCount()).toEqual(0);

    mock.timers.tick(200);
    expect(spy.mock.callCount()).toEqual(1);

    spy.mock.resetCalls();

    // check debounce when multiple calls with delay < timeout
    debounced();
    mock.timers.tick(100);
    expect(spy.mock.callCount()).toEqual(0);

    debounced();
    mock.timers.tick(100);
    expect(spy.mock.callCount()).toEqual(0);

    debounced();
    mock.timers.tick(100);
    expect(spy.mock.callCount()).toEqual(0);

    mock.timers.tick(100);
    expect(spy.mock.callCount()).toEqual(1);

    mock.timers.reset();
  });

  test('.cancel() should works correctly', () => {
    mock.timers.enable({ apis: ['setTimeout'] });

    const spy = mock.fn();
    const debounced = debounce(spy, 200);

    expect(spy.mock.callCount()).toEqual(0);

    debounced();
    expect(spy.mock.callCount()).toEqual(0);

    mock.timers.tick(200);
    expect(spy.mock.callCount()).toEqual(1);

    debounced();
    expect(spy.mock.callCount()).toEqual(1);

    debounced.cancel();
    expect(spy.mock.callCount()).toEqual(1);

    mock.timers.tick(200);
    expect(spy.mock.callCount()).toEqual(1);
  });
});
