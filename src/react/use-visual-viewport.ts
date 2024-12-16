import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

/**
 * State of visual viewport.
 */
export interface VisualViewportState {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/height) */
  readonly height: number;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/offsetLeft) */
  readonly offsetLeft: number;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/offsetTop) */
  readonly offsetTop: number;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/pageLeft) */
  readonly pageLeft: number;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/pageTop) */
  readonly pageTop: number;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/scale) */
  readonly scale: number;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/VisualViewport/width) */
  readonly width: number;

  /** False by default (before mount), true when initialized (after mount). */
  readonly ready: boolean;
}

const DEFAULT_STATE: VisualViewportState = {
  offsetLeft: 0,
  offsetTop: 0,
  pageLeft: 0,
  pageTop: 0,
  scale: 1,
  width: 0,
  height: 0,
  ready: false,
};

/**
 * Hook of window.visualViewport state.
 * @returns State of visualViewport (width, height, etc).
 */
export function useVisualViewport(): VisualViewportState {
  const [size, setSize] = useState<VisualViewportState>(DEFAULT_STATE);

  useIsomorphicLayoutEffect(() => {
    const { visualViewport } = window;

    if (!visualViewport) {
      return;
    }

    const sync = () => {
      setSize({
        ready: true,
        offsetLeft: visualViewport.offsetLeft,
        offsetTop: visualViewport.offsetTop,
        pageLeft: visualViewport.pageLeft,
        pageTop: visualViewport.pageTop,
        scale: visualViewport.scale,
        width: visualViewport.width,
        height: visualViewport.height,
      });
    };

    visualViewport.addEventListener('resize', sync);
    visualViewport.addEventListener('scroll', sync);

    sync();

    return () => {
      visualViewport.removeEventListener('resize', sync);
      visualViewport.removeEventListener('scroll', sync);
    };
  }, []);

  return size;
}
