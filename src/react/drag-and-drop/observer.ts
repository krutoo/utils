import { type Point2d, Vector2, getPositionedParentOffset } from '../../mod.ts';
import { DnDEvent } from './events.ts';
import { createPluginManager } from './plugin-manager.ts';
import type {
  DragAndDropObserverContext,
  DragAndDropObserverOptions,
  DragAndDropPluginManager,
  DragAndDropState,
} from './types.ts';

/**
 * Drag-and-drop behavior observer.
 * Allows to implement drag-and-drop by providing event handlers.
 * Don't affects element' style or any other properties, just listens some events.
 * @internal
 */
export class DragAndDropObserver {
  protected readonly options: DragAndDropObserverOptions;

  protected state: DragAndDropState;

  protected plugins: DragAndDropPluginManager;

  protected observation?: {
    readonly element: HTMLElement;
    readonly unobserve: VoidFunction;
  };

  constructor(options: DragAndDropObserverOptions = {}) {
    this.options = options;
    this.state = {
      pointerId: -1,
      pressed: false,
      grabbed: false,
      offset: Vector2.of(0, 0),
      startOffset: Vector2.of(0, 0),
      innerOffset: Vector2.of(0, 0),
    };
    this.plugins = createPluginManager(() => this.state);
  }

  /**
   * Connects instance to given element.
   * An observer can only observe one element at a time.
   * @param element Element.
   * @returns Unobserve function.
   * @throws When trying to observe second element.
   */
  observe(element: HTMLElement): VoidFunction {
    if (this.observation) {
      if (this.observation.element !== element) {
        throw new Error('Only single element can be observed');
      }

      return this.observation.unobserve;
    }

    const ctx: DragAndDropObserverContext = {
      element,
      getOffsets: (
        clientPosition: Vector2,
        innerOffset = clientPosition.clone().subtract(element.getBoundingClientRect()),
      ) => {
        const offset = clientPosition
          .clone()
          .subtract(innerOffset)
          .subtract(getPositionedParentOffset(element, this.options));

        return { offset, innerOffset };
      },
    };

    const onPointerDown = (event: PointerEvent) => this.handlePointerDown(event, ctx);
    const onPointerMove = (event: PointerEvent) => this.handlePointerMove(event, ctx);
    const onPointerRelease = (event: PointerEvent) => this.handlePointerRelease(event, ctx);

    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerRelease);
    window.addEventListener('pointercancel', onPointerRelease);
    this.plugins.actions.addPlugins(this.options.plugins ?? []);
    this.plugins.actions.hookInit(ctx);

    const disconnect = () => {
      delete this.observation;

      element.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerRelease);
      window.removeEventListener('pointercancel', onPointerRelease);
      this.plugins.actions.hookDestroy(ctx);
      this.plugins.actions.clearPlugins();
    };

    this.observation = {
      element,
      unobserve: disconnect,
    };

    return disconnect;
  }

  /**
   * Handles `pointerdown` event.
   * @param event Pointer event.
   * @param ctx Context.
   */
  protected handlePointerDown(event: PointerEvent, ctx: DragAndDropObserverContext): void {
    if (this.state.grabbed) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);
    const { offset, innerOffset } = ctx.getOffsets(clientPosition);

    this.state.pressed = true;
    this.state.pointerId = event.pointerId;
    this.state.offset = offset;
    this.state.startOffset = offset;
    this.state.innerOffset = innerOffset;

    this.dispatchGrab(ctx.element, event, clientPosition);
  }

  /**
   * Handles `pointermove` event.
   * @param event Pointer event.
   * @param ctx Context.
   */
  protected handlePointerMove(event: PointerEvent, ctx: DragAndDropObserverContext): void {
    if (this.state.pointerId !== event.pointerId) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);
    const { offset } = ctx.getOffsets(clientPosition, this.state.innerOffset);

    this.state.offset = offset;

    if (this.state.pressed && !this.state.grabbed) {
      this.dispatchGrab(ctx.element, event, clientPosition);
    }

    if (this.state.grabbed) {
      this.options.onMove?.(new DnDEvent(ctx.element, this.state, event, clientPosition));
      this.plugins.actions.hookMove(ctx);
    }
  }

  /**
   * Handles `pointerup` and `pointercancel` events.
   * @param event Pointer event.
   * @param ctx Context.
   */
  protected handlePointerRelease(event: PointerEvent, ctx: DragAndDropObserverContext): void {
    if (!this.state.pressed || this.state.pointerId !== event.pointerId) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);

    this.state.pointerId = -1;
    this.state.grabbed = false;
    this.state.pressed = false;

    this.options.onDrop?.(new DnDEvent(ctx.element, this.state, event, clientPosition));
    this.plugins.actions.hookDrop(ctx);
  }

  /**
   * Dispatches `grab` event.
   * @param element Element.
   * @param nativeEvent  Native event.
   * @param clientPosition Client position from event.
   */
  protected dispatchGrab(
    element: HTMLElement,
    nativeEvent: PointerEvent,
    clientPosition: Point2d,
  ): void {
    const nextState = { ...this.state, grabbed: true };
    const dndEvent = new DnDEvent(element, nextState, nativeEvent, clientPosition);

    this.options.onGrab?.(dndEvent);

    if (!dndEvent.defaultPrevented) {
      this.plugins.actions.hookGrab({ element });
      this.state = nextState;
    }
  }
}
