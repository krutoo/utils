import rspack, { type CopyRspackPluginOptions, type RspackPluginFunction } from '@rspack/core';

/**
 * This plugin was renamed from `pluginPublicFolder` to `pluginPublicFiles`
 * because you don't always need to copy folders, sometimes you need to copy single file.
 *
 * But "public" is quite good abstraction over `CopyRspackPlugin`.
 */

/**
 * Rspack plugin that copies all files by pattern to bundle folder.
 * By default all files in "public" folder in root directory of project will be copied to bundle.
 * These assets will be available in dev server via `public/<path in public folder>`.
 * It is just a wrapper of `CopyRspackPlugin` with some useful defaults.
 *
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginPublicFiles } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     // just copy "public" folder
 *     pluginPublicFiles(),
 *
 *     // copying anything else by custom patterns
 *     pluginPublicFiles({ patterns: { from: 'manifest.json', to: 'manifest.json' } }),
 *   ],
 *   // ...other config
 * };
 * ```
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginPublicFiles(options?: CopyRspackPluginOptions): RspackPluginFunction {
  return compiler => {
    const copyPlugin = new rspack.CopyRspackPlugin({
      ...options,
      patterns: options?.patterns ?? [
        {
          from: 'public',
          to: 'public',
          noErrorOnMissing: true,
        },
      ],
    });

    copyPlugin.apply(compiler);
  };
}
