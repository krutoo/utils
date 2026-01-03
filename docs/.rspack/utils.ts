import path from 'node:path';
import type { RspackPluginFunction } from '@rspack/core';
import {
  type EmitStoriesEntrypointConfig,
  emitStoriesEntrypoint,
  watchStories,
} from '@krutoo/showcase/build';

export interface PluginStoriesEntryOptions extends EmitStoriesEntrypointConfig {
  entryAlias: string;
}

export function pluginStoriesEntry(config: PluginStoriesEntryOptions): RspackPluginFunction {
  return compiler => {
    let watchStarted = false;

    if (!compiler.options.resolve.alias) {
      compiler.options.resolve.alias = {};
    }

    compiler.options.resolve.alias[config.entryAlias] ??= path.resolve(
      process.cwd(),
      config.filename,
    );

    compiler.hooks.beforeRun.tapPromise('pluginStoriesEntry', async () => {
      await emitStoriesEntrypoint(config);
    });

    compiler.hooks.watchRun.tapPromise('pluginStoriesEntry', async () => {
      if (watchStarted) {
        return;
      }

      await emitStoriesEntrypoint(config);
      watchStories(config);
      watchStarted = true;
    });
  };
}
