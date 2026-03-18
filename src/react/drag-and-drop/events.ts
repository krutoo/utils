import type { Point2d } from '../../mod.ts';
import type { DragAndDropEvent, DragAndDropState } from './types.ts';

export class DnDEvent<E extends Event> implements DragAndDropEvent<E> {
  readonly target: HTMLElement;

  readonly nativeEvent: E;

  readonly clientPosition: Point2d;

  readonly grabbed: boolean;

  readonly pressed: boolean;

  readonly offset: Point2d;

  readonly startOffset: Point2d;

  readonly innerOffset: Point2d;

  protected _defaultPrevented: boolean;

  constructor(
    target: HTMLElement,
    state: DragAndDropState,
    nativeEvent: E,
    clientPosition: Point2d,
  ) {
    this.target = target;
    this.nativeEvent = nativeEvent;
    this.clientPosition = clientPosition;
    this.grabbed = state.grabbed;
    this.pressed = state.pressed;
    this.offset = state.offset;
    this.startOffset = state.startOffset;
    this.innerOffset = state.innerOffset;
    this._defaultPrevented = false;
  }

  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  preventDefault(): void {
    this._defaultPrevented = true;
  }
}
