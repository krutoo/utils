import { EventListenerHolder } from './event-listener-holder.ts';

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
 * Mock-implementation of `VisualViewport` with ability to control state programmatically.
 * Useful for unit testing.
 * Can be used in any runtime that implements `EventTarget` (browsers, Node.js, Deno, Bun...).
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

  protected _onresize: EventListenerHolder<(this: VisualViewport, event: Event) => any>;
  protected _onscroll: EventListenerHolder<(this: VisualViewport, event: Event) => any>;
  protected _onscrollend: EventListenerHolder<(this: VisualViewport, event: Event) => any>;

  constructor(defaults: Partial<VisualViewportValues> = {}) {
    super();
    this.width = defaults.width ?? 1280;
    this.height = defaults.height ?? 720;
    this.scale = defaults.scale ?? 1;
    this.offsetLeft = defaults.offsetLeft ?? 0;
    this.offsetTop = defaults.offsetTop ?? 0;
    this.pageLeft = defaults.pageLeft ?? 0;
    this.pageTop = defaults.pageTop ?? 0;

    this._onresize = new EventListenerHolder(this);
    this._onscroll = new EventListenerHolder(this);
    this._onscrollend = new EventListenerHolder(this);
  }

  /** @inheritdoc */
  get onresize(): ((this: VisualViewport, event: Event) => any) | null {
    return this._onresize.get();
  }

  /** @inheritdoc */
  set onresize(value: ((this: VisualViewport, event: Event) => any) | null) {
    this._onresize.set('resize', value);
  }

  /** @inheritdoc */
  get onscroll(): ((this: VisualViewport, event: Event) => any) | null {
    return this._onscroll.get();
  }

  /** @inheritdoc */
  set onscroll(value: ((this: VisualViewport, event: Event) => any) | null) {
    this._onscroll.set('scroll', value);
  }

  /** @inheritdoc */
  get onscrollend(): ((this: VisualViewport, event: Event) => any) | null {
    return this._onscrollend.get();
  }

  /** @inheritdoc */
  set onscrollend(value: ((this: VisualViewport, event: Event) => any) | null) {
    this._onscrollend.set('scrollend', value);
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
    this.dispatchEvent(new Event('scrollend'));
  }
}
