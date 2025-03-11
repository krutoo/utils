import type { RspackPluginFunction, RuleSetRule } from '@rspack/core';
import type { RuleInsertOptions } from './types.ts';
import { insertRule } from './utils.ts';
import { isObject } from '../misc/mod.ts';

export interface PluginRawImportOptions extends RuleInsertOptions {
  /** Allows to use `with { type: 'text' }` to import file source as string. */
  byImportAttr?:
    | boolean
    | {
        /** Rule extend/override. */
        ruleOverride?: RuleSetRule;
      };

  /** Allows to use `?raw` query to import file source as string. */
  byQuery?:
    | boolean
    | {
        /** Rule extend/override. */
        ruleOverride?: RuleSetRule;
      };
}

/**
 * Rspack plugin that that allows importing files as a string (`with { type: 'text' }` or by `?raw` query).
 * By query logic is analogue of `raw-loader` that adds rule with `resourceQuery` and `type: 'asset/source'`.
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
  byImportAttr = true,
  byQuery = true,
  ruleInsert,
}: PluginRawImportOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginRawImport', () => {
      if (byQuery) {
        const customs = isObject(byQuery) ? byQuery : undefined;

        const rule: RuleSetRule = {
          resourceQuery: /raw/,
          type: 'asset/source',
          ...customs?.ruleOverride,
        };

        insertRule(rule, { ruleInsert }, compiler.options.module.rules);
      }

      if (byImportAttr) {
        const customs =
          typeof byImportAttr === 'object' && byImportAttr !== null ? byImportAttr : undefined;

        const rule: RuleSetRule = {
          with: {
            type: 'text',
          },
          type: 'asset/source',
          ...customs?.ruleOverride,
        };

        insertRule(rule, { ruleInsert }, compiler.options.module.rules);
      }
    });
  };
}
