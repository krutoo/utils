import type { RspackPluginFunction, RuleSetRule } from '@rspack/core';
import type { RuleInsertOptions } from './types.ts';

export interface PluginRawImportOptions extends RuleInsertOptions {
  /** Rule extension/override. */
  ruleOverride?: RuleSetRule;
}

/**
 * Rspack plugin that that allows importing files as a string.
 * It is analogue of `raw-loader` that adds rule with `resourceQuery` and `type: 'asset/source'`.
 * By default it uses `?raw` query so every file can be imported as string with this query.
 *
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginRawImport } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginRawImport(),
 *   ],
 *   // ...other config
 * };
 * ```
 *
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginRawImport({
  ruleInsert: insertRule = 'to-end',
  ruleOverride,
}: PluginRawImportOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginRawImport', () => {
      const rule: RuleSetRule = {
        resourceQuery: /raw/,
        type: 'asset/source',
        ...ruleOverride,
      };

      if (insertRule === 'to-start') {
        compiler.options.module.rules.unshift(rule);
      }

      if (insertRule === 'to-end') {
        compiler.options.module.rules.push(rule);
      }
    });
  };
}
