import { EventListenerHolder } from './event-listener-holder.ts';

/**
 * Mock-implementation of `MediaQueryList` with ability to control state programmatically.
 * Useful for unit testing.
 * Can be used in any runtime that implements `EventTarget` (browsers, Node.js, Deno, Bun...).
 */
export class MediaQueryListMock extends EventTarget implements MediaQueryList {
  readonly media: string;
  readonly matches: boolean;
  protected _onchange: EventListenerHolder<
    (this: MediaQueryList, event: MediaQueryListEvent) => any
  >;

  constructor(query: string) {
    super();
    this.media = query;
    this.matches = false;

    this._onchange = new EventListenerHolder(this);
    Object.defineProperty(this, '_onchange', { enumerable: false });
  }

  /** @inheritdoc */
  get onchange(): ((this: MediaQueryList, event: MediaQueryListEvent) => any) | null {
    return this._onchange.get();
  }

  /** @inheritdoc */
  set onchange(value: ((this: MediaQueryList, event: MediaQueryListEvent) => any) | null) {
    this._onchange.set('change', value);
  }

  /** @inheritdoc */
  override addEventListener<K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, event: MediaQueryListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  /** @inheritdoc */
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  /** @inheritdoc */
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions,
  ) {
    super.addEventListener(type, listener, options);
  }

  /** @inheritdoc */
  override removeEventListener<K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, event: MediaQueryListEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  /** @inheritdoc */
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;

  /** @inheritdoc */
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions,
  ) {
    super.removeEventListener(type, listener, options);
  }

  /**
   * @inheritdoc
   * @deprecated According to MDN.
   */
  addListener(callback: ((this: MediaQueryList, event: MediaQueryListEvent) => any) | null): void {
    if (callback) {
      this.addEventListener('change', callback);
    }
  }

  /**
   * @inheritdoc
   * @deprecated According to MDN.
   */
  removeListener(
    callback: ((this: MediaQueryList, event: MediaQueryListEvent) => any) | null,
  ): void {
    if (callback) {
      this.removeEventListener('change', callback);
    }
  }

  /**
   * Changes state of matching media query.
   * Calling this method will cause dispatching `change` event.
   * @param matches Boolean.
   */
  simulateChange({ matches }: { matches: boolean }): void {
    if (matches !== this.matches) {
      (this as { matches: boolean }).matches = matches;

      this.dispatchEvent(
        new MediaQueryListEventMock('change', {
          matches,
          media: this.media,
        }),
      );
    }
  }
}

/**
 * Mock-implementation of MediaQueryListEvent.
 * Useful for unit testing.
 * Can be used in every runtime that implements `Event` (browsers, nodejs, deno, bun...).
 */
export class MediaQueryListEventMock extends Event implements MediaQueryListEvent {
  /** @inheritdoc */
  readonly matches: boolean;

  /** @inheritdoc */
  readonly media: string;

  constructor(name: string, init?: MediaQueryListEventInit) {
    super(name);
    this.matches = init?.matches ?? false;
    this.media = init?.media ?? '';
  }
}
