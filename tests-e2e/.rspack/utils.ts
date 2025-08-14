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

    compiler.options.resolve.alias ??= {};

    if (compiler.options.resolve.alias) {
      compiler.options.resolve.alias[config.entryAlias] ??= path.resolve(
        process.cwd(),
        config.filename,
      );
    }

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

export async function aliasesToSource(fromPath: string) {
  return {
    '@krutoo/utils$': path.resolve(fromPath, '../src/mod.ts'),
    '@krutoo/utils/dom$': path.resolve(fromPath, '../src/dom/mod.ts'),
    '@krutoo/utils/math$': path.resolve(fromPath, '../src/math/mod.ts'),
    '@krutoo/utils/misc$': path.resolve(fromPath, '../src/misc/mod.ts'),
    '@krutoo/utils/react$': path.resolve(fromPath, '../src/react/mod.ts'),
    '@krutoo/utils/rspack$': path.resolve(fromPath, '../src/rspack/mod.ts'),
    '@krutoo/utils/types$': path.resolve(fromPath, '../src/types/mod.ts'),

    // for avoiding errors about multiple react versions on the page
    react$: path.resolve(fromPath, 'node_modules/react'),
  };
}
