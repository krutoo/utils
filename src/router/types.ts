import type { Subscribable } from '../store/types.ts';

export interface RouterLocation {
  pathname: string;
  hash: string;
  search: string;
}

/**
 * Router. Extends Subscribable.
 * Calls listeners passed to `subscribe` when location changes.
 */
export interface Router extends Subscribable {
  /**
   * Get current location.
   * @returns Location.
   */
  getLocation(): RouterLocation;

  /**
   * Go to given url.
   * @param url URL.
   */
  navigate(url: string): void;

  /**
   * Move over history by delta (for example to move back pass -1).
   * @param delta Delta.
   */
  go(delta: number): void;

  /**
   * Connect router to environment.
   * @returns Disconnect function.
   */
  connect(): () => void;
}
