import type { DragAndDropPlugin } from './types.ts';

export const DragAndDropBuiltinPlugins = {
  /**
   * Returns plugin that cleans selection during drag-and-drop.
   * @returns Plugin.
   */
  cleanSelection(): DragAndDropPlugin {
    return api => {
      const cleanSelection = () => {
        document.getSelection()?.removeAllRanges();
      };

      api.hooks.grab.add(cleanSelection);
      api.hooks.move.add(cleanSelection);
    };
  },

  /**
   * Returns plugin that prevents click if target element was moved by drag-and-drop.
   * @returns Plugin.
   */
  preventClick(): DragAndDropPlugin {
    return api => {
      const onClickCapture = (event: MouseEvent) => {
        const state = api.getState();
        const distance = state.offset.getDistance(state.startOffset);

        if (distance > 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      api.hooks.init.add(ctx => {
        ctx.element.addEventListener('click', onClickCapture, { capture: true });
      });
      api.hooks.destroy.add(ctx => {
        ctx.element.addEventListener('click', onClickCapture, { capture: true });
      });
    };
  },

  /**
   * Returns plugin that prevents page scroll and "pull-to-refresh" on draggable element.
   * @returns Plugin.
   */
  touchScroll(): DragAndDropPlugin {
    return api => {
      let onTouchMove: (event: TouchEvent) => void;

      api.hooks.init.add(ctx => {
        onTouchMove = (event: TouchEvent) => {
          // IMPORTANT: check only inside target
          if (!(event.target instanceof Element) || !ctx.element.contains(event.target)) {
            return false;
          }

          if (api.getState().grabbed) {
            event.preventDefault();
          }
        };

        window.addEventListener('touchmove', onTouchMove, { passive: false });
      });
      api.hooks.destroy.add(() => {
        window.removeEventListener('touchmove', onTouchMove);
      });
    };
  },
};
