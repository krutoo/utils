import type { RspackPluginFunction, RuleSetRule } from '@rspack/core';
import { insertRule } from './utils.ts';
import { RuleInsertOptions } from './types.ts';

export interface PluginStaticAssetsOptions extends RuleInsertOptions {
  /** Options for rule by extension. */
  byExt?: {
    /** Extensions to interpret as static files (without leading dot). */
    extensions?: string[] | ((defaults: string[]) => string[]);

    /** Rule extend/override. */
    ruleOverride?: RuleSetRule;
  };

  /** Options for rule by import attribute. */
  byImportAttr?: {
    /** Rule extend/override. */
    ruleOverride?: RuleSetRule;
  };
}

/**
 * Rspack plugin that adds support of importing files as static assets.
 * It just adds rules with `type: 'asset/resource'`.
 *
 * By default popular file extensions (image, audio, video) will be handled by this rule:
 * apng, avif, gif, jpg, jpeg, png, webp, mp3, ogg, wav, mp4, 3gp, webm.
 *
 *
 * @example You can also import any file as url by import attribute:
 * ```js
 * import fileUrl from './my-file.txt' with { type: 'url' };
 * ```
 *
 * By default static assets will be emitted to "static" folder in root of bundle folder.
 *
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
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginStaticAssets({
  byExt,
  byImportAttr,
  ruleInsert,
}: PluginStaticAssetsOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginStaticAssets', () => {
      // ВАЖНО: по умолчанию обрабатываем известные типа изображений, аудио и видео
      const defaultExtensions = [
        'apng',
        'avif',
        'gif',
        'jpg',
        'jpeg',
        'png',
        'webp',
        'mp3',
        'ogg',
        'wav',
        'mp4',
        '3gp',
        'webm',
      ];

      const extensionsList =
        typeof byExt?.extensions === 'function'
          ? byExt?.extensions(defaultExtensions)
          : [...defaultExtensions, ...(byExt?.extensions ?? [])];

      const regexp = new RegExp(`\\.(${extensionsList.join('|')})$`, 'i');

      const ruleByExt: RuleSetRule = {
        test: regexp,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]',
        },
        ...byExt?.ruleOverride,
      };

      const ruleByImportAttr: RuleSetRule = {
        with: {
          type: 'url',
        },
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]',
        },
        ...byImportAttr?.ruleOverride,
      };

      insertRule(ruleByExt, { ruleInsert }, compiler.options.module.rules);
      insertRule(ruleByImportAttr, { ruleInsert }, compiler.options.module.rules);
    });
  };
}
