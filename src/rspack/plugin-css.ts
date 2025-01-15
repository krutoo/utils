import rspack, {
  type CssExtractRspackPluginOptions,
  type RspackPluginFunction,
} from '@rspack/core';

export interface PluginCssOptions {
  /** Options for `CssExtractRspackPlugin` or false if you want to disable extracting styles to file. */
  extract?: CssExtractRspackPluginOptions | false;

  /** CSS modules options. See `modules` option of `css-loader`. */
  cssModules?: any; // @todo убрать any
}

/**
 * Rspack plugin that adds support of importing CSS files.
 * CSS-modules enabled by default for files like `some.module.css` and `some.m.css`.
 * It uses `css-loader` and `CssExtractRspackPlugin` under the hood.
 *
 * The `css-loader` is optional peer dependency of this package, so you need to install it.
 * @example
 * ```bash
 * npm install --dev css-loader
 * ```
 *
 * You can use this plugin like regular plugins.
 * @example
 * ```js
 * // rspack.config.js
 * import { pluginCSS } from '@krutoo/utils/rspack';
 *
 * export default {
 *   plugins: [
 *     pluginCSS(),
 *   ],
 *   // ...other config
 * };
 * ```
 *
 * @param options Options.
 * @returns Plugin function.
 * @todo SCSS support.
 */
export function pluginCSS({ extract, cssModules }: PluginCssOptions = {}): RspackPluginFunction {
  return compiler => {
    compiler.hooks.afterEnvironment.tap('krutoo:pluginCSS', () => {
      compiler.options.module.rules.push({
        test: /\.css$/i,
        use: [
          ...(extract !== false ? [rspack.CssExtractRspackPlugin.loader] : []),
          {
            loader: 'css-loader',
            options: {
              url: {
                // ВАЖНО: делаем поведение таким же как в HtmlRspackPlugin
                filter: (url: string): boolean => {
                  if (url.startsWith('/')) {
                    return false;
                  }

                  return true;
                },
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
      });
    });

    if (extract !== false) {
      const extractPlugin = new rspack.CssExtractRspackPlugin(extract);

      extractPlugin.apply(compiler);
    }
  };
}
