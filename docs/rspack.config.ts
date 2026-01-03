import path from 'node:path';
import type { Configuration } from '@rspack/core';
import type { CompileOptions } from '@mdx-js/mdx';
import * as utils from '@krutoo/utils/rspack';
import { pluginStoriesEntry } from './.rspack/utils.ts';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';

const PKG_IMPL = process.env.PKG_IMPL ?? 'src';

export default {
  entry: {
    sandbox: './src/sandbox.tsx',
    showcase: './src/showcase.tsx',
  },
  output: {
    path: path.resolve(import.meta.dirname, 'dist'),
    filename: `[name].js`,
    publicPath: process.env.PUBLIC_PATH || undefined,
  },
  resolve: {
    alias: {
      ...(PKG_IMPL === 'src' && {
        // for avoiding errors about multiple react versions on the page
        react$: path.resolve('./node_modules/react'),
      }),
    },
  },
  module: {
    rules: [
      {
        test: /\.mdx?$/,
        loader: '@mdx-js/loader',
        options: {
          providerImportSource: '@mdx-js/react',
          rehypePlugins: [rehypeMdxCodeProps],
        } satisfies CompileOptions,
      },
    ],
  },
  plugins: [
    pluginStoriesEntry({
      entryAlias: '#found-stories',
      filename: './.generated/found-stories.js',
      storiesGlob: './docs/**/*.{md,mdx,ts,tsx}',
      storiesRootDir: './docs/',
      rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
    }),
    utils.pluginTypeScript({
      tsConfig: PKG_IMPL === 'installed' ? false : undefined,
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
    utils.pluginPublicFiles(),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
  devServer: {
    port: 3000,
    static: false,
    hot: false,
    liveReload: true,
  },
} satisfies Configuration;
