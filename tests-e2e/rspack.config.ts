import path from 'node:path';
import type { Configuration } from '@rspack/core';
import * as utils from '@krutoo/utils/rspack';
import { aliasesToSource, pluginStoriesEntry } from './.rspack/utils.ts';

const PKG_IMPL = process.env.PKG_IMPL ?? 'src';

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
      ...(PKG_IMPL === 'src' && (await aliasesToSource(import.meta.dirname))),
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
      entryAlias: '#found-stories',
      filename: './.generated/found-stories.js',
      storiesGlob: './stories/**/*.story.{mdx,ts,tsx}',
      storiesRootDir: './stories/',
      rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
    }),
    utils.pluginTypeScript({
      tsConfig: PKG_IMPL === 'tarball' ? false : undefined,
    }),
    utils.pluginCSS(),
    utils.pluginRawImport(),
    utils.pluginHTML({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['showcase'],
    }),
    utils.pluginHTML({
      filename: 'sandbox.html',
      template: './src/index.html',
      chunks: ['sandbox'],
    }),
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
