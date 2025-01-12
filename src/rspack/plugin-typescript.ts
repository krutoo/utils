import type { RspackPluginFunction, SwcLoaderOptions } from '@rspack/core';

export interface PluginTypeScriptOptions {
  /** Extensions, that will be added to `resolve.extensions`. */
  resolveExtensions?: string[] | false;

  /** Configuration for `builtin:swc-loader`. */
  swcLoaderOptions?: SwcLoaderOptions;
}

/**
 * Rspack plugin that adds support of TypeScript.
 * It adds rule for handling TypeScript source files.
 * It also adds items to `resolve.extensions` in configuration (by default `.ts, .tsx` will be added).
 * By default it uses `automatic` React runtime in SWC config.
 *
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginTypeScript } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginTypeScript(),
 *   ],
 *   // ...other config
 * };
 * ```
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginTypeScript({
  resolveExtensions = ['.ts', '.tsx'],
  swcLoaderOptions,
}: PluginTypeScriptOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginTypeScript', () => {
      if (resolveExtensions !== false) {
        if (!compiler.options.resolve.extensions) {
          compiler.options.resolve.extensions = [];
        }

        for (const ext of resolveExtensions) {
          if (!compiler.options.resolve.extensions.includes(ext)) {
            compiler.options.resolve.extensions.push(ext);
          }
        }
      }

      const swcConfig: SwcLoaderOptions = {
        ...swcLoaderOptions,
        jsc: {
          ...swcLoaderOptions?.jsc,
          parser: swcLoaderOptions?.jsc?.parser ?? {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            ...swcLoaderOptions?.jsc?.transform,
            react: {
              ...swcLoaderOptions?.jsc?.transform?.react,
              runtime: swcLoaderOptions?.jsc?.transform?.react?.runtime ?? 'automatic',
            },
          },
        },
      };

      compiler.options.module.rules.push({
        test: /\.(js|jsx|ts|tsx|mts|cts)$/i,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: swcConfig,
        type: 'javascript/auto',
      });
    });
  };
}
