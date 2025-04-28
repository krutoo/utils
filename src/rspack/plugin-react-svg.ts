import type { RspackPluginFunction, RuleSetRule } from '@rspack/core';
import type { Config } from 'svgo';
import type { RuleInsertOptions } from './types.ts';
import { insertRule } from './utils.ts';

export interface PluginReactSVG extends RuleInsertOptions {
  /** Configuration for SVGO. */
  svgoConfig?: Config;

  /** Rule extension/override. */
  ruleOverride?: RuleSetRule;
}

export const SVGO_DEFAULTS: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          removeViewBox: false,
          collapseGroups: false,
        },
      },
    },
    {
      name: 'mergePaths',
    },
    {
      name: 'prefixIds',
    },
  ],
};

/**
 * Rspack plugin that adds support of importing svg files as React-components.
 * It uses `@svgr/webpack` so this package should be installed in your project.
 *
 * The `@svgr/webpack` is optional peer dependency of this package, so you need to install it.
 * @example
 * ```bash
 * npm install --save-dev @svgr/webpack
 * ```
 *
 * You can use this plugin like regular plugins.
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginReactSVG } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginReactSVG(),
 *   ],
 *   // ...other config
 * };
 * ```
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginReactSVG({
  svgoConfig = SVGO_DEFAULTS,
  ruleOverride,
  ruleInsert,
}: PluginReactSVG = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginReactSVG', () => {
      const rule: RuleSetRule = {
        test: /\.svg$/i,
        issuer: /\.(js|jsx|ts|tsx|mts|cts)$/i,
        loader: '@svgr/webpack',
        options: {
          svgoConfig,
        },
        ...ruleOverride,
      };

      insertRule(rule, { ruleInsert }, compiler.options.module.rules);
    });
  };
}
