import path from 'node:path';
import type {
  ResolveTsConfig,
  RspackPluginFunction,
  RuleSetRule,
  SwcLoaderOptions,
} from '@rspack/core';
import type { RuleInsertOptions } from './types.ts';
import { insertRule } from './utils.ts';

export interface PluginTypeScriptOptions extends RuleInsertOptions {
  /** Extensions, that will be added to `resolve.extensions`. */
  resolveExtensions?: string[] | false;

  /** TypeScript config file path, see `resolve.tsConfig` of Rspack configuration. */
  tsConfig?: ResolveTsConfig | false;

  /** Configuration for `builtin:swc-loader`. */
  swcLoaderOptions?: SwcLoaderOptions;

  /** When false passed, rule for TypeScript files will not be added to configuration. */
  ruleEnabled?: boolean;

  /** Rule extension/override. */
  ruleOverride?: RuleSetRule;
}

/**
 * Rspack plugin that adds support of TypeScript.
 * It adds rule for handling TypeScript source files.
 * It adds items to `resolve.extensions` in configuration (by default `.ts, .tsx` will be added).
 * It adds `resolve.tsConfig` with path to `tsconfig.json` in project root (when it is not provided in config).
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
  tsConfig = {
    configFile: path.resolve(process.cwd(), 'tsconfig.json'),
  },
  ruleEnabled = true,
  ruleInsert,
  ruleOverride,
  swcLoaderOptions,
}: PluginTypeScriptOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginTypeScript', () => {
      // resolve.extensions option enhance
      if (resolveExtensions !== false) {
        // ВАЖНО: не работает если в конфиге не указан resolve.extensions по непонятной причине
        // ждем ответа тут: https://github.com/web-infra-dev/rspack/discussions/8994
        if (!compiler.options.resolve.extensions) {
          compiler.options.resolve.extensions = [];
        }

        for (const ext of resolveExtensions) {
          if (compiler.options.resolve.extensions.includes(ext)) {
            continue;
          }

          compiler.options.resolve.extensions.push(ext);
        }
      }

      // `tsconfig.json` path to build config
      if (tsConfig !== false && compiler.options.resolve.tsConfig === undefined) {
        compiler.options.resolve.tsConfig = tsConfig;
      }

      if (ruleEnabled) {
        // rule for handling TypeScript source files
        const ruleOptions: SwcLoaderOptions = {
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

        const rule: RuleSetRule = {
          test: /\.(js|jsx|ts|tsx|mts|cts)$/i,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: ruleOptions,

          // IMPORTANT: `type: 'javascript/auto'` missed by default
          // because it not working correctly with pluginRawImport

          ...ruleOverride,
        };

        insertRule(rule, { ruleInsert }, compiler.options.module.rules);
      }
    });
  };
}
