import path from 'node:path';
import { RspackPluginFunction, type Configuration } from '@rspack/core';
import * as plugins from '@krutoo/utils/rspack';
import {
  type EmitStoriesEntrypointConfig,
  emitStoriesEntrypoint,
  watchStories,
} from '@krutoo/showcase/build';

function pluginStoriesEntry(config: EmitStoriesEntrypointConfig): RspackPluginFunction {
  return compiler => {
    let watchStarted = false;

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

export default {
  entry: {
    sandbox: './src/sandbox.tsx',
    showcase: './src/showcase.tsx',
  },
  output: {
    path: path.resolve(import.meta.dirname, 'dist'),
    filename: `[name].js`,
  },
  resolve: {
    alias: {
      '#found-stories': path.resolve(import.meta.dirname, './.generated/found-stories.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mdx?$/,
        loader: '@mdx-js/loader',
      },
    ],
  },
  plugins: [
    pluginStoriesEntry({
      filename: './.generated/found-stories.js',
      storiesGlob: './stories/**/*.story.{mdx,ts,tsx}',
      storiesRootDir: './stories/',
      rawImport: (mod: any) => ({ importPath: `!${mod.importPath}?raw` }),
    }),
    plugins.pluginTypeScript(),
    plugins.pluginCSS(),
    plugins.pluginRawImport(),
    plugins.pluginHTML({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['showcase'],
    }),
    plugins.pluginHTML({
      filename: 'sandbox.html',
      template: './src/index.html',
      chunks: ['sandbox'],
    }),
    plugins.pluginPublicFolder(),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
  devServer: {
    port: 3000,
    hot: false,
    liveReload: true,
  },
} satisfies Configuration;
