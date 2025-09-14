import rspack, {
  type RuleSetRule,
  type CssExtractRspackPluginOptions,
  type RspackPluginFunction,
} from '@rspack/core';
import type { RuleInsertOptions } from './types.ts';
import { insertRule } from './utils.ts';

export interface PluginCssOptions extends RuleInsertOptions {
  /** Options for `CssExtractRspackPlugin` or false if you want to disable extracting styles to file. */
  extract?: CssExtractRspackPluginOptions | false;

  /** CSS modules options. See `modules` option of `css-loader`. */
  cssModules?: any; // @todo убрать any
}

/**
 * Rspack plugin that adds support of importing CSS files.
 * CSS-modules enabled by default for files like `some.module.css` and `some.m.css`.
 *
 * It uses `css-loader` and `CssExtractRspackPlugin` under the hood.
 * The `css-loader` is optional peer dependency of this package, so you need to install it.
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginCSS({
  extract,
  cssModules,
  ruleInsert,
}: PluginCssOptions = {}): RspackPluginFunction {
  // @todo scss support
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginCSS', () => {
      const rule: RuleSetRule = {
        test: /\.css$/i,
        use: [
          ...(extract !== false ? [rspack.CssExtractRspackPlugin.loader] : []),
          {
            loader: 'css-loader',
            options: {
              url: {
                // IMPORTANT: make behavior same as in HtmlRspackPlugin
                filter: (url: string): boolean => !url.startsWith('/'),
              },
              modules: {
                ...cssModules,
                auto: cssModules?.auto ?? /\.(module|m)\.css$/i,
                exportLocalsConvention: cssModules?.exportLocalsConvention ?? 'as-is',
                namedExport: cssModules?.namedExport ?? false,
                localIdentName: cssModules?.localIdentName ?? '[name]__[local]--[hash:3]',
              },
            },
          },
        ],
      };

      insertRule(rule, { ruleInsert }, compiler.options.module.rules);
    });

    if (extract !== false) {
      const extractPlugin = new rspack.CssExtractRspackPlugin(extract);

      extractPlugin.apply(compiler);
    }
  };
}
