import type { RspackPluginFunction, RuleSetCondition } from '@rspack/core';

export interface PluginStaticAssetsOptions {
  test?: RuleSetCondition;
  filename?: string;
}

/**
 * Rspack plugin that adds support of importing files as static assets.
 * It just adds rule with `type: 'asset'`.
 * By default popular file extensions will be handled by this rule:
 * apng, avif, gif, jpg, jpeg, png, webp, mp3, ogg, wav, mp4, 3gp, webm.
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginStaticAssets } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginStaticAssets(),
 *   ],
 *   // ...other config
 * };
 * ```
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginStaticAssets({
  test,
  filename,
}: PluginStaticAssetsOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginStaticAssets', () => {
      compiler.options.module.rules.push({
        // ВАЖНО: по умолчанию обрабатываем известные типа изображений, аудио и видео
        test: test ?? /\.(apng|avif|gif|jpg|jpeg|png|webp|mp3|ogg|wav|mp4|3gp|webm)$/i,
        type: 'asset',
        generator: {
          filename: filename ?? 'static/[name].[contenthash:5][ext]',
        },
      });
    });
  };
}
