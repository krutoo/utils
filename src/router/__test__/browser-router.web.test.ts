import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { BrowserRouter } from '../browser-router.ts';

describe('BrowserRouter', () => {
  test('should handle second connect call correctly', () => {
    const spy = mock.fn();
    const addEventListenerSpy = mock.method(window, 'addEventListener');
    const router = new BrowserRouter();

    router.subscribe(spy);
    expect(spy.mock.callCount()).toBe(0);
    expect(addEventListenerSpy.mock.callCount()).toBe(0);

    const disconnect1 = router.connect();

    expect(addEventListenerSpy.mock.callCount()).toBe(1);
    expect(spy.mock.callCount()).toBe(1);

    const disconnect2 = router.connect();

    expect(addEventListenerSpy.mock.callCount()).toBe(1);
    expect(Object.is(disconnect1, disconnect2)).toBe(true);
  });
});
