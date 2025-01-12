import rspack, { type CopyRspackPluginOptions, type RspackPluginFunction } from '@rspack/core';

/**
 * Rspack plugin that adds support of "public" folder.
 * All files in "public" folder in root directory of build will be copied to bundle.
 * It is just a wrapper of CopyRspackPlugin with some useful defaults.
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginPublicFolder } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginPublicFolder(),
 *   ],
 *   // ...other config
 * };
 * ```
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginPublicFolder(options?: CopyRspackPluginOptions): RspackPluginFunction {
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
