import rspack, { type HtmlRspackPluginOptions, type RspackPluginFunction } from '@rspack/core';

/**
 * Rspack plugin that adds emit of HTML-file based.
 * It is just a wrapper of `HtmlRspackPlugin` with some useful defaults.
 *
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginHTML } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginHTML(),
 *   ],
 *   // ...other config
 * };
 * ```
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginHTML(options?: HtmlRspackPluginOptions): RspackPluginFunction {
  return compiler => {
    const htmlPlugin = new rspack.HtmlRspackPlugin({
      ...options,

      // by default uses modern JS format
      scriptLoading: options?.scriptLoading ?? 'module',

      // scripts with `type="module"` are deferred by default
      // so we can inject to head instead body to start loading as soon as possible
      inject: options?.inject ?? 'head',

      // by default disable minify for better DX
      minify: options?.minify ?? false,
    });

    htmlPlugin.apply(compiler);
  };
}
