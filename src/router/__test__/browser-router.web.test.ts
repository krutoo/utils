import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { BrowserRouter, type BrowserRouterWindowAPI } from '../browser-router.ts';

class WindowApiMock {
  protected listeners = new Map<string, Set<VoidFunction>>();
  protected currentHref: string;
  protected scrollToCallCount = 0;

  constructor(href: string) {
    this.currentHref = href;
  }

  get api(): BrowserRouterWindowAPI {
    return this as unknown as BrowserRouterWindowAPI;
  }

  get href(): string {
    return this.currentHref;
  }

  get scrollToCalls(): number {
    return this.scrollToCallCount;
  }

  get location(): URL {
    return new URL(this.currentHref);
  }

  set location(value: URL) {
    this.currentHref = value.href;
  }

  readonly history = {
    pushState: (...args: unknown[]) => this.pushState(...args),
    go: () => {},
  };

  scrollTo(): void {
    this.scrollToCallCount++;
  }

  addEventListener(type: string, listener: VoidFunction): void {
    const listeners = this.listeners.get(type) ?? new Set<VoidFunction>();

    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type: string, listener: VoidFunction): void {
    this.listeners.get(type)?.delete(listener);
  }

  protected pushState(...args: unknown[]): void {
    const url = args[2];

    this.currentHref =
      url === undefined || url === null
        ? this.currentHref
        : new URL(String(url), this.currentHref).href;
  }
}

describe('BrowserRouter', () => {
  test('should handle second connect call correctly', () => {
    window.history.replaceState(null, '', `/tests/router`);

    const spy = mock.fn();
    const addEventListenerSpy = mock.method(window, 'addEventListener');
    const router = new BrowserRouter();

    router.subscribe(spy);
    expect(spy.mock.callCount()).toBe(0);
    expect(addEventListenerSpy.mock.callCount()).toBe(0);

    const disconnect1 = router.connect();

    expect(addEventListenerSpy.mock.callCount()).toBe(2);
    expect(addEventListenerSpy.mock.calls.map(call => call.arguments[0])).toEqual([
      'popstate',
      'hashchange',
    ]);
    expect(spy.mock.callCount()).toBe(1);

    const disconnect2 = router.connect();

    expect(addEventListenerSpy.mock.callCount()).toBe(2);
    expect(Object.is(disconnect1, disconnect2)).toBe(true);
  });

  test('should preserve trailing slash in URL and location', () => {
    const win = new WindowApiMock('http://localhost/docs');
    const router = new BrowserRouter();
    const disconnect = router.connect({ api: win.api });

    router.navigate('/catalog/');

    expect(win.href).toBe('http://localhost/catalog/');
    expect(router.getLocation().pathname).toBe('/catalog/');
    expect(win.scrollToCalls).toBe(1);

    disconnect();
  });

  test('should keep raw pathname from URL on connect', () => {
    const win = new WindowApiMock('http://localhost/docs/');
    const router = new BrowserRouter();

    const disconnect = router.connect({ api: win.api });

    expect(router.getLocation().pathname).toBe('/docs/');

    disconnect();
  });

  test('should notify but not scroll when only trailing slash changes', () => {
    const win = new WindowApiMock('http://localhost/docs');
    const router = new BrowserRouter();
    const spy = mock.fn();

    router.subscribe(spy);

    const disconnect = router.connect({ api: win.api });

    expect(spy.mock.callCount()).toBe(1);
    spy.mock.resetCalls();

    router.navigate('/docs/');

    expect(win.href).toBe('http://localhost/docs/');
    expect(router.getLocation().pathname).toBe('/docs/');
    expect(spy.mock.callCount()).toBe(1);
    expect(win.scrollToCalls).toBe(0);

    router.navigate('/docs');

    expect(win.href).toBe('http://localhost/docs');
    expect(router.getLocation().pathname).toBe('/docs');
    expect(spy.mock.callCount()).toBe(2);
    expect(win.scrollToCalls).toBe(0);

    disconnect();
  });
});
