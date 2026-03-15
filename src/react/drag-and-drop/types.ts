import type { DependencyList } from 'react';
import type { Point2d, Vector2 } from '../../mod.ts';

export interface DragAndDropEvent<E extends Event = Event> {
  /** True during user presses target element. */
  readonly pressed: boolean;

  /** True during element grabbed. */
  readonly grabbed: boolean;

  /** Current offset relative to positioned parent. */
  readonly offset: Point2d;

  /** Started offset relative to positioned parent. */
  readonly startOffset: Point2d;

  /** Current offset relative target element from top left corner to grab point. */
  readonly innerOffset: Point2d;

  /** Draggable element. */
  readonly target: HTMLElement;

  /** Client position (clientX, clientY). */
  readonly clientPosition: Point2d;

  /** Cause event. */
  readonly nativeEvent: E;

  /** True if default behavior vas prevented by calling `preventDefault`. */
  readonly defaultPrevented: boolean;

  /** Prevents default behavior for event. */
  preventDefault(): void;
}

export interface DragAndDropEventHandler<E extends Event> {
  (event: DragAndDropEvent<E>): void;
}

export interface UseDragAndDropOptions {
  /** Positioning strategy. Should be same that css `position` property of target element. */
  strategy?: 'fixed' | 'absolute';

  /** When true, Drag-And-Drop will be disabled. */
  disabled?: boolean;

  /** Will be called when element is grabbed. */
  onGrab?: DragAndDropEventHandler<PointerEvent>;

  /** Will be called when element is dragging. */
  onMove?: DragAndDropEventHandler<PointerEvent>;

  /** Will be called when element is dropped. */
  onDrop?: DragAndDropEventHandler<PointerEvent>;

  /** Plugins. */
  plugins?: DragAndDropPlugin[];

  /** Extra deps for useEffect hook. */
  extraDeps?: DependencyList;
}

export interface UseDragAndDropReturn {
  captured: boolean;
  offset: Point2d;
}

export interface DragAndDropPluginAPI {
  getState(): DragAndDropState;
  hooks: Record<
    'init' | 'grab' | 'move' | 'drop' | 'destroy',
    {
      add(hook: DragAndDropPluginHook): void;
    }
  >;
}

export interface DragAndDropPlugin {
  (api: DragAndDropPluginAPI): void;
}

export interface DragAndDropPluginHook {
  (ctx: DragAndDropPluginHookContext): void;
}

export interface DragAndDropPluginHookContext {
  element: HTMLElement;
}

export interface DragAndDropState {
  /** Pointer id that changes `pressed` to true. */
  pointerId: number;

  /** True during user presses target element. */
  pressed: boolean;

  /** True during element grabbed. */
  grabbed: boolean;

  /** Current offset relative to positioned parent. */
  offset: Vector2;

  /** Started offset relative to positioned parent. */
  startOffset: Vector2;

  /** Current offset relative target element from top left corner to grab point. */
  innerOffset: Vector2;
}

/** @internal */
export interface DragAndDropPluginManager {
  api: DragAndDropPluginAPI;
  actions: {
    addPlugins(list: DragAndDropPlugin[]): void;
    clearPlugins(): void;
    hookInit(ctx: DragAndDropPluginHookContext): void;
    hookGrab(ctx: DragAndDropPluginHookContext): void;
    hookMove(ctx: DragAndDropPluginHookContext): void;
    hookDrop(ctx: DragAndDropPluginHookContext): void;
    hookDestroy(ctx: DragAndDropPluginHookContext): void;
  };
}

/** @internal */
export interface DragAndDropObserverOptions {
  strategy?: 'fixed' | 'absolute';
  onGrab?: DragAndDropEventHandler<PointerEvent>;
  onMove?: DragAndDropEventHandler<PointerEvent>;
  onDrop?: DragAndDropEventHandler<PointerEvent>;
  plugins?: DragAndDropPlugin[];
}

/** @internal */
export interface DragAndDropObserverContext {
  element: HTMLElement;
  getOffsets(
    clientPosition: Vector2,
    innerOffset?: Vector2,
  ): { offset: Vector2; innerOffset: Vector2 };
}
