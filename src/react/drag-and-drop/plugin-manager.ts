import type { DragAndDropPluginHook, DragAndDropPluginManager, DragAndDropState } from './types.ts';

/** @inheritdoc */
export function createPluginManager(getState: () => DragAndDropState): DragAndDropPluginManager {
  const hooks = {
    init: new Set<DragAndDropPluginHook>(),
    grab: new Set<DragAndDropPluginHook>(),
    move: new Set<DragAndDropPluginHook>(),
    drop: new Set<DragAndDropPluginHook>(),
    destroy: new Set<DragAndDropPluginHook>(),
  };

  const manager: DragAndDropPluginManager = {
    api: {
      hooks: {
        init: hooks.init,
        grab: hooks.grab,
        move: hooks.move,
        drop: hooks.drop,
        destroy: hooks.destroy,
      },
      getState,
    },
    actions: {
      addPlugins(list) {
        for (const item of list) {
          item(manager.api);
        }
      },
      clearPlugins() {
        hooks.init.clear();
        hooks.grab.clear();
        hooks.move.clear();
        hooks.drop.clear();
        hooks.destroy.clear();
      },
      hookInit: ctx => hooks.init.forEach(fn => fn(ctx)),
      hookGrab: ctx => hooks.grab.forEach(fn => fn(ctx)),
      hookMove: ctx => hooks.move.forEach(fn => fn(ctx)),
      hookDrop: ctx => hooks.drop.forEach(fn => fn(ctx)),
      hookDestroy: ctx => hooks.destroy.forEach(fn => fn(ctx)),
    },
  };

  return manager;
}
