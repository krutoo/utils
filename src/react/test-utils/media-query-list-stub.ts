// @todo maybe make it public like `import {} from '@krutoo/utils/testing';`

/**
 * Implementation of MediaQueryList with ability to control state programmatically.
 */
export class MediaQueryListStub extends EventTarget implements MediaQueryList {
  readonly media: string;
  readonly matches: boolean;
  protected _onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;

  constructor(query: string) {
    super();
    this.media = query;
    this.matches = false;
    this._onchange = null;
  }

  get onchange(): ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null {
    return this._onchange;
  }

  set onchange(value: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null) {
    if (value) {
      this._onchange = value;
      this.addEventListener('change', value);
    } else {
      if (this._onchange) {
        this.removeEventListener('change', this._onchange);
      }
    }
  }

  override addEventListener<K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions,
  ) {
    super.addEventListener(type, listener, options);
  }

  override removeEventListener<K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions,
  ) {
    super.removeEventListener(type, listener, options);
  }

  /**
   * @inheritdoc
   * @deprecated
   */
  addListener(callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null): void {
    if (callback) {
      this.addEventListener('change', callback as any);
    }
  }

  /**
   * @inheritdoc
   * @deprecated
   */
  removeListener(callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null): void {
    if (callback) {
      this.removeEventListener('change', callback as any);
    }
  }

  toggle(matches: boolean): this {
    if (matches !== this.matches) {
      (this as { matches: boolean }).matches = matches;

      this.dispatchEvent(
        new MediaQueryListEvent('change', {
          matches,
          media: this.media,
        }),
      );
    }

    return this;
  }
}
