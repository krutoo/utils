import path from 'node:path';
import fs from 'node:fs/promises';
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

export async function aliasesToSource(fromPath: string): Promise<Record<string, string>> {
  const packageJson = JSON.parse(
    await fs.readFile(path.resolve(import.meta.dirname, '../../package.json'), 'utf-8'),
  );

  return {
    ...Object.fromEntries(
      Object.keys(packageJson.exports)
        .filter(key => !key.startsWith('./typings'))
        .map(key => [`${key}$`, path.resolve(fromPath, `${key}/mod.ts`)]),
    ),

    // for avoiding errors about multiple react versions on the page
    react$: path.resolve(fromPath, 'node_modules/react'),
  };
}
