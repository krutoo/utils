import type { RspackPluginFunction, RuleSetRule } from '@rspack/core';
import { insertRule } from './utils.ts';
import type { RuleInsertOptions } from './types.ts';

export interface PluginStaticAssetsOptions extends RuleInsertOptions {
  /** Result filename of the asset in bundle. By default `'static/[name][ext]'`. */
  filename?: string;

  /** Options for rule by extension. Or false for disabling rule. */
  byExt?:
    | {
        /** Extensions to interpret as static files (without leading dot). */
        extensions?: string[] | ((defaults: string[]) => string[]);

        /** Rule extend/override. */
        ruleOverride?: RuleSetRule;
      }
    | false;

  /** Options for rule by import attribute. Or false for disabling rule. */
  byImportAttr?:
    | {
        /** Rule extend/override. */
        ruleOverride?: RuleSetRule;
      }
    | false;
}

/**
 * Rspack plugin that adds support of importing files as static assets.
 * It just adds rules with `type: 'asset/resource'`.
 *
 * By default popular file extensions (image, audio, video) will be handled by this rule:
 * apng, avif, gif, jpg, jpeg, png, webp, mp3, ogg, wav, mp4, 3gp, webm.
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginStaticAssets({
  filename = 'static/[name][ext]',
  byExt,
  byImportAttr,
  ruleInsert,
}: PluginStaticAssetsOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginStaticAssets', () => {
      if (byExt !== false) {
        // IMPORTANT: by default we process known types of images, audio and video
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

        const rule: RuleSetRule = {
          test: regexp,
          type: 'asset/resource',
          generator: {
            filename,
          },
          ...byExt?.ruleOverride,
        };

        insertRule(rule, { ruleInsert }, compiler.options.module.rules);
      }

      if (byImportAttr !== false) {
        const rule: RuleSetRule = {
          with: {
            type: 'url',
          },
          type: 'asset/resource',
          generator: {
            filename,
          },
          ...byImportAttr?.ruleOverride,
        };

        insertRule(rule, { ruleInsert }, compiler.options.module.rules);
      }
    });
  };
}
