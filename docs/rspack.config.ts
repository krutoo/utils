import fs from 'node:fs/promises';
import path from 'node:path';
import { defineStories } from '@krutoo/showcase/build';
import * as utils from '@krutoo/utils/rspack';
import type { CompileOptions } from '@mdx-js/mdx';
import { type Configuration } from '@rspack/core';
import dotenv from 'dotenv';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import { type PluginStoriesEntryOptions, pluginStoriesEntry } from './.rspack/utils.ts';
import packageJson from './package.json' with { type: 'json' };

if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}`, quiet: true });
}

const isProd = process.env.NODE_ENV === 'production';
const pkgImpl = process.env.PKG_IMPL ?? 'src';

await fs.rm('dist', { recursive: true, force: true });
await fs.rm('temp', { recursive: true, force: true });

const storiesConfig: PluginStoriesEntryOptions = {
  entryAlias: '#found-stories',
  filename: './.generated/found-stories.js',
  storiesGlob: './docs/**/*.{md,mdx,ts,tsx}',
  storiesRootDir: './docs/',
  rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
};

export default [
  // server
  {
    name: 'server',
    target: 'node',
    mode: isProd ? 'production' : 'development',
    entry: {
      index: './src/server.tsx',
    },
    output: {
      path: path.resolve(import.meta.dirname, 'temp/server'),
      filename: '[name].js',
      publicPath: process.env.PUBLIC_PATH ?? '/',
      module: true,
    },
    devtool: isProd ? false : undefined,
    // externals: utils.nodeExternals(),
    externals: Object.fromEntries(
      Object.entries(packageJson.dependencies).map(([key]) => [key, key]),
    ),
    externalsPresets: {
      node: true,
    },
    resolve: {
      alias: {
        ...(pkgImpl === 'src' && {
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
      pluginStoriesEntry(storiesConfig),
      utils.pluginTypeScript({
        tsConfig: pkgImpl === 'installed' ? false : undefined,
      }),
      utils.pluginCSS({
        extract: false,
      }),
      utils.pluginRawImport(),
      utils.pluginPublicFiles(),
      utils.pluginImportMetaEnv(['PUBLIC_PATH', 'TEMPLATES_DIR']),
      utils.pluginExec({
        script: 'node temp/server/index.js',
      }),
    ],
    experiments: {
      css: false,
    },
    devServer: {
      static: false,
      hot: false,
      liveReload: true,
      historyApiFallback: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
  },

  // client
  {
    name: 'client',
    dependencies: ['server'],
    target: 'web',
    mode: isProd ? 'production' : 'development',
    entry: {
      sandbox: './src/sandbox.tsx',
      showcase: './src/showcase.tsx',
    },
    output: {
      module: true,
      path: path.resolve(import.meta.dirname, 'dist'),
      filename: `[name].[contenthash].js`,
      publicPath: process.env.PUBLIC_PATH || undefined,
    },
    devtool: isProd ? false : undefined,
    resolve: {
      alias: {
        ...(pkgImpl === 'src' && {
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
      pluginStoriesEntry(storiesConfig),
      utils.pluginTypeScript({
        tsConfig: pkgImpl === 'installed' ? false : undefined,
      }),
      utils.pluginCSS({
        extract: { filename: '[name].[contenthash].css' },
      }),
      utils.pluginRawImport(),
      utils.pluginPublicFiles(),
      utils.pluginImportMetaEnv(['PUBLIC_PATH', 'TEMPLATES_DIR']),
      utils.pluginHTML({
        filename: 'sandbox.html',
        template: './src/index.html',
        chunks: ['sandbox'],
      }),
      utils.pluginHTML({
        template: path.join(process.env.TEMPLATES_DIR!, '_default.html'),
        filename: 'index.html',
        chunks: ['showcase'],
      }),
      ...(await defineStories(storiesConfig)).map(story =>
        utils.pluginHTML({
          template: path.join(process.env.TEMPLATES_DIR!, `.${story.storyPathname}.html`),
          filename: `.${story.storyPathname}/index.html`,
          chunks: ['showcase'],
        }),
      ),
    ],
    experiments: {
      css: false,
    },
  },
] satisfies Configuration[];
