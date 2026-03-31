import type { Router, RouterLocation } from './types.ts';
import { getStubLocation, normalizeLocation } from './utils.ts';

export interface BrowserRouterConfig {
  /** Useful when you use BrowserRouter on server. */
  defaultLocation?: RouterLocation;
}

/**
 * Router implementation for using in browser environment.
 * Can be used in Node.js (or other server environment: Deno, Bun etc.) while `.connect()` is not called.
 */
export class BrowserRouter implements Router {
  private location: RouterLocation;

  private listeners: Set<VoidFunction>;

  private connection?: {
    readonly disconnect: VoidFunction;
  };

  constructor({ defaultLocation }: BrowserRouterConfig = {}) {
    this.location = defaultLocation ?? getStubLocation();
    this.listeners = new Set();
  }

  private setLocation(location: RouterLocation): void {
    // @todo skip if given location is same as current?
    this.location = normalizeLocation(location);

    for (const listener of this.listeners) {
      listener();
    }
  }

  getLocation(): RouterLocation {
    return this.location;
  }

  navigate(url: string): void {
    const currentUrl = new URL(window.location.href);
    const nextUrl = new URL(url, window.location.href);

    if (nextUrl.origin !== currentUrl.origin) {
      window.location.href = nextUrl.href;
      return;
    }

    const location = normalizeLocation(nextUrl);

    window.history.pushState(null, '', `${location.pathname}${location.search}${location.hash}`);
    window.scrollTo(0, 0);
    this.setLocation(location);
  }

  go(delta: number): void {
    window.history.go(delta);
  }

  // @todo add argument `window: Window`?
  connect(): VoidFunction {
    if (this.connection) {
      return this.connection.disconnect;
    }

    const sync = () => {
      const url = new URL(window.location.href);

      this.setLocation({
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      });
    };

    sync();

    window.addEventListener('popstate', sync);

    const disconnect = () => {
      delete this.connection;

      window.removeEventListener('popstate', sync);
    };

    this.connection = {
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
