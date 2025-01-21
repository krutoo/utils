import { describe, test, mock } from 'node:test';
import { debounce } from '../debounce.ts';
import { expect } from '@std/expect';

const wait = (ms: number) => new Promise(done => setTimeout(done, ms));

describe('debounce', () => {
  test('should work properly', async () => {
    const spy = mock.fn();
    const debounced = debounce(spy, 200);

    // check initial call delay
    debounced();
    expect(spy.mock.callCount()).toEqual(0);

    await wait(200);
    expect(spy.mock.callCount()).toEqual(1);

    spy.mock.resetCalls();

    // check debounce when multiple calls with delay < timeout
    debounced();
    await wait(100);
    expect(spy.mock.callCount()).toEqual(0);

    debounced();
    await wait(100);
    expect(spy.mock.callCount()).toEqual(0);

    debounced();
    await wait(100);
    expect(spy.mock.callCount()).toEqual(0);

    await wait(100);
    expect(spy.mock.callCount()).toEqual(1);
  });
});
