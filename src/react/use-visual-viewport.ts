// @deno-types="npm:@types/react@18"
import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

/**
 * State of visual viewport.
 */
export interface VisualViewportState {
  readonly height: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly scale: number;
  readonly width: number;

  /** True when computed, false by default (when state is default - empty). */
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

    if (visualViewport) {
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

      sync();

      return () => {
        visualViewport.removeEventListener('resize', sync);
      };
    }
  }, []);

  return size;
}
