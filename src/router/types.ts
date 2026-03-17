export interface RouterLocation {
  pathname: string;
  hash: string;
  search: string;
}

export interface Router {
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

  /**
   * Register location change handler.
   * @param listener Listener.
   * @returns Unsubscribe function.
   */
  subscribe(listener: VoidFunction): () => void;
}
