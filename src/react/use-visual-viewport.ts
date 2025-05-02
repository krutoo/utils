import { useContext, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { VisualViewportContext } from './context/visual-viewport-context.ts';

/*
 * @todo Сделать возможность следить функцией а не состоянием
 * например так:
 * - useVisualViewport(callback: (state: VisualViewportState) => void): void
 * - useVisualViewportSync(): VisualViewportState
 * но это обратно несовместимо поэтому мб так:
 * - useVisualViewport(): VisualViewportState
 * - useVisualViewportChange(callback: (state: VisualViewportState) => void): void
 */

/**
 * State of visual viewport.
 */
export interface VisualViewportState {
  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/height). */
  readonly height: number;

  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/offsetLeft). */
  readonly offsetLeft: number;

  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/offsetTop). */
  readonly offsetTop: number;

  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/pageLeft). */
  readonly pageLeft: number;

  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/pageTop). */
  readonly pageTop: number;

  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/scale). */
  readonly scale: number;

  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/width). */
  readonly width: number;

  /** False by default (before mount), true when initialized (after mount). */
  readonly ready: boolean;
}

export interface UseVisualViewportOptions {
  /** Initial returned state. Used before subscription effect applied. */
  defaultState?: VisualViewportState | (() => VisualViewportState);
}

/**
 * Returns default state for `useVisualViewport` hook.
 * @returns Default state.
 */
function getInitialState(): VisualViewportState {
  return {
    ready: false,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    width: 0,
    height: 0,
  };
}

/**
 * Returns current state of given `VisualViewport` instance.
 * @param viewport Instance.
 * @returns State.
 */
function getState(viewport: VisualViewport): VisualViewportState {
  return {
    ready: true,
    offsetLeft: viewport.offsetLeft,
    offsetTop: viewport.offsetTop,
    pageLeft: viewport.pageLeft,
    pageTop: viewport.pageTop,
    scale: viewport.scale,
    width: viewport.width,
    height: viewport.height,
  };
}

/**
 * Observes given `VisualViewport`.
 * @param viewport `VisualViewport` instance.
 * @param callback Callback that will be fired when viewport state changes.
 * @returns Unsubscribe function.
 */
function observe(viewport: VisualViewport, callback: () => void): () => void {
  const listener = () => {
    callback();
  };

  viewport.addEventListener('resize', listener);
  viewport.addEventListener('scroll', listener);

  return () => {
    viewport.removeEventListener('resize', listener);
    viewport.removeEventListener('scroll', listener);
  };
}

/**
 * Hook of window.visualViewport state.
 *
 * @example
 * ```tsx
 * import { useVisualViewport } from '@krutoo/utils/react';
 *
 * export function App() {
 *   const viewport = useVisualViewport();
 *
 *   return (
 *     <p>
 *       Your viewport size is {viewport.width} x {viewport.height}px
 *     </p>
 *   );
 * }
 * ```
 *
 * @param options Options.
 * @returns State of visualViewport (width, height, etc).
 */
export function useVisualViewport({
  defaultState = getInitialState,
}: UseVisualViewportOptions = {}): VisualViewportState {
  const { getVisualViewport } = useContext(VisualViewportContext);
  const [state, setState] = useState<VisualViewportState>(defaultState);

  useIsomorphicLayoutEffect(() => {
    const visualViewport = getVisualViewport();

    if (!visualViewport) {
      return;
    }

    const sync = () => {
      setState(getState(visualViewport));
    };

    sync();

    return observe(visualViewport, sync);
  }, [getVisualViewport]);

  return state;
}
