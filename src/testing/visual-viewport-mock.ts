export interface VisualViewportValues {
  height: number;
  offsetLeft: number;
  offsetTop: number;
  pageLeft: number;
  pageTop: number;
  scale: number;
  width: number;
}

const valueKeys: Array<keyof VisualViewportValues> = [
  'height',
  'offsetLeft',
  'offsetTop',
  'pageLeft',
  'pageTop',
  'scale',
  'width',
];

/**
 * Mock-implementation of VisualViewport with ability to control state programmatically.
 * Useful for unit testing.
 * Can be used in every runtime that implements `EventTarget` (browsers, nodejs, deno, bun...).
 */
export class VisualViewportMock extends EventTarget implements VisualViewport {
  /** @inheritdoc */
  readonly height: number;

  /** @inheritdoc */
  readonly offsetLeft: number;

  /** @inheritdoc */
  readonly offsetTop: number;

  /** @inheritdoc */
  readonly pageLeft: number;

  /** @inheritdoc */
  readonly pageTop: number;

  /** @inheritdoc */
  readonly scale: number;

  /** @inheritdoc */
  readonly width: number;

  protected _onresize: ((this: VisualViewport, event: Event) => any) | null;
  protected _onscroll: ((this: VisualViewport, event: Event) => any) | null;

  constructor(defaults: Partial<VisualViewportValues> = {}) {
    super();
    this.width = defaults.width ?? 1280;
    this.height = defaults.height ?? 720;
    this.scale = defaults.scale ?? 1;
    this.offsetLeft = defaults.offsetLeft ?? 0;
    this.offsetTop = defaults.offsetTop ?? 0;
    this.pageLeft = defaults.pageLeft ?? 0;
    this.pageTop = defaults.pageTop ?? 0;

    this._onresize = null;
    this._onscroll = null;
  }

  /** @inheritdoc */
  get onresize(): ((this: VisualViewport, event: Event) => any) | null {
    return this._onresize;
  }

  /** @inheritdoc */
  set onresize(value: ((this: VisualViewport, event: Event) => any) | null) {
    if (!value) {
      if (this._onresize) {
        this.removeEventListener('change', this._onresize);
      }
      return;
    }

    if (this._onresize && value !== this._onresize) {
      this.removeEventListener('change', this._onresize);
    }

    this.addEventListener('change', value);
    this._onresize = value;
  }

  /** @inheritdoc */
  get onscroll(): ((this: VisualViewport, event: Event) => any) | null {
    return null;
  }

  /** @inheritdoc */
  set onscroll(value: ((this: VisualViewport, event: Event) => any) | null) {
    if (!value) {
      if (this._onscroll) {
        this.removeEventListener('change', this._onscroll);
      }
      return;
    }

    if (this._onscroll && value !== this._onscroll) {
      this.removeEventListener('change', this._onscroll);
    }

    this.addEventListener('change', value);
    this._onscroll = value;
  }

  /** @inheritdoc */
  override addEventListener<K extends keyof VisualViewportEventMap>(
    type: K,
    listener: (this: VisualViewport, event: VisualViewportEventMap[K]) => any,
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
  override removeEventListener<K extends keyof VisualViewportEventMap>(
    type: K,
    listener: (this: VisualViewport, event: VisualViewportEventMap[K]) => any,
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
   * Sets numeric values.
   * @param values Values.
   */
  protected setValues(values: Partial<VisualViewportValues>): void {
    for (const key of valueKeys) {
      if (typeof values[key] !== 'undefined') {
        (this as any)[key] = values[key];
      }
    }
  }

  /**
   * Dispatches `resize` event. If values provided then applies it before dispatching.
   * @param values Values.
   */
  simulateResize(values?: Partial<VisualViewportValues>): void {
    if (values) {
      this.setValues(values);
    }

    this.dispatchEvent(new Event('resize'));
  }

  /**
   * Dispatches `scroll` event. If values provided then applies it before dispatching.
   * @param values Values.
   */
  simulateScroll(values?: Partial<VisualViewportValues>): void {
    if (values) {
      this.setValues(values);
    }

    this.dispatchEvent(new Event('scroll'));
  }
}
