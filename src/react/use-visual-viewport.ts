import { useState } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

export interface VisualViewportState {
  readonly ready: boolean;
  readonly height: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly scale: number;
  readonly width: number;
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

      visualViewport.addEventListener("resize", sync);

      sync();

      return () => {
        visualViewport.removeEventListener("resize", sync);
      };
    }
  }, []);

  return size;
}
