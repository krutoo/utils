import { type RefObject } from 'react';
import { noop } from '../../mod.ts';
import { zeroDeps } from '../constants.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useLatestRef } from '../use-latest-ref.ts';
import { useStableCallback } from '../use-stable-callback.ts';
import { DragAndDropBuiltinPlugins } from './builtin-plugins.ts';
import { DragAndDropObserver } from './observer.ts';
import type { UseDragAndDropOptions } from './types.ts';

/**
 * Hook of simple "drag and drop".
 * @param ref Target element.
 * @param options Options.
 */
export function useDragAndDrop<T extends HTMLElement>(
  ref: RefObject<T> | RefObject<T | null> | RefObject<T | undefined>,
  {
    strategy,
    disabled,
    onGrab,
    onMove,
    onDrop,
    plugins,
    extraDeps = zeroDeps,
  }: UseDragAndDropOptions = {},
): void {
  const pluginsRef = useLatestRef(plugins);
  const handleGrab = useStableCallback(onGrab ?? noop);
  const handleMove = useStableCallback(onMove ?? noop);
  const handleDrop = useStableCallback(onDrop ?? noop);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (disabled || !element) {
      return;
    }

    const observer = new DragAndDropObserver({
      strategy,
      onGrab: handleGrab,
      onMove: handleMove,
      onDrop: handleDrop,
      plugins: pluginsRef.current ?? [
        DragAndDropBuiltinPlugins.cleanSelection(),
        DragAndDropBuiltinPlugins.preventClick(),
        DragAndDropBuiltinPlugins.touchScroll(),
      ],
    });

    return observer.observe(element);
  }, [
    ref,
    disabled,
    strategy,

    // stable:
    handleGrab,
    handleMove,
    handleDrop,
    pluginsRef,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);
}
