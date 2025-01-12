import type { RspackPluginFunction, RuleSetCondition } from '@rspack/core';
import type { Config } from 'svgo';

export interface PluginReactSVG {
  /** Rule test pattern. */
  test?: RuleSetCondition;

  /** Configuration for SVGO. */
  svgoConfig?: Config;
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
  test,
  svgoConfig = SVGO_DEFAULTS,
}: PluginReactSVG = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginReactSVG', () => {
      compiler.options.module.rules.push({
        test: test ?? /\.svg$/i,
        issuer: /\.(js|jsx|ts|tsx)$/i,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig,
            },
          },
        ],
      });
    });
  };
}
