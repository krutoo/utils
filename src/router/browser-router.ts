import type { Router, RouterLocation } from './types.ts';
import { cloneLocation, getStubLocation, isEqualLocations, normalizeLocation } from './utils.ts';

export interface BrowserRouterConfig {
  /** Useful when you use BrowserRouter on server. */
  defaultLocation?: RouterLocation;
}

export interface BrowserRouterWindowAPI extends Pick<
  Window,
  'location' | 'history' | 'scrollTo' | 'addEventListener' | 'removeEventListener'
> {}

export interface BrowserRouterConnectOptions {
  api?: BrowserRouterWindowAPI;
}

/**
 * Router implementation for using in browser environment.
 * Can be used in Node.js (or other server environment: Deno, Bun etc.) while `.connect()` is not called.
 */
export class BrowserRouter implements Router {
  protected location: RouterLocation;

  protected listeners: Set<VoidFunction>;

  protected connection?: {
    readonly api: BrowserRouterWindowAPI;
    readonly disconnect: VoidFunction;
  };

  constructor(options?: BrowserRouterConfig) {
    this.location = options?.defaultLocation
      ? cloneLocation(options.defaultLocation)
      : getStubLocation();
    this.listeners = new Set();
  }

  protected setLocation(location: RouterLocation): void {
    if (isEqualLocations(location, this.location)) {
      return;
    }

    this.location = cloneLocation(location);

    for (const listener of this.listeners) {
      listener();
    }
  }

  getLocation(): RouterLocation {
    return this.location;
  }

  navigate(url: string): void {
    if (!this.connection) {
      return;
    }

    const { api } = this.connection;
    const currentUrl = new URL(api.location.href);
    const nextUrl = new URL(url, api.location.href);

    // if origin is changed - immediately change location
    if (nextUrl.origin !== currentUrl.origin) {
      api.location.href = nextUrl.href;

      // however, it is still important to update inner state (for custom apis)
      this.setLocation(nextUrl);

      return;
    }

    const current = normalizeLocation(currentUrl);
    const next = normalizeLocation(nextUrl);

    // IMPORTANT: URL comparison must be done over URLs and not over normalized locations
    // because URL keeps trailing slash
    if (!isEqualLocations(currentUrl, nextUrl)) {
      api.history.pushState(null, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
      this.setLocation(nextUrl);

      // reset scroll only when route actually changed, not when trailing slash changed,
      // so normalized locations used here instead URLs
      if (!isEqualLocations(current, next, 'ignoreHash')) {
        api.scrollTo(0, 0);
      }
    }
  }

  go(delta: number): void {
    this.connection?.api.history.go(delta);
  }

  connect(options?: BrowserRouterConnectOptions): VoidFunction {
    if (this.connection) {
      return this.connection.disconnect;
    }

    const api = options?.api ?? globalThis.window;

    const sync = () => {
      const url = new URL(api.location.href);

      this.setLocation(cloneLocation(url));
    };

    sync();

    api.addEventListener('popstate', sync);
    api.addEventListener('hashchange', sync);

    const disconnect = () => {
      delete this.connection;

      api.removeEventListener('popstate', sync);
      api.removeEventListener('hashchange', sync);
    };

    this.connection = {
      api,
      disconnect,
    };

    return disconnect;
  }

  subscribe(listener: VoidFunction): VoidFunction {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}
