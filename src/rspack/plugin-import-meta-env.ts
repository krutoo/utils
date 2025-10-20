import rspack, { type RspackPluginFunction } from '@rspack/core';

/**
 * Rspack plugin that defines variables as properties of `import.meta.env` during compile time.
 * It's same as `EnvironmentPlugin` but instead `process.env.{key}` it defines `import.meta.env.{key}`.
 * @param keys Keys, that will be used to copy variables from build environment to bundle.
 * @param options Options.
 * @returns Plugin function.
 */
export function pluginImportMetaEnv(
  keys: string[],
  {
    source = process.env,
  }: {
    source?: Record<string, string | undefined> | ((varName: string) => string | undefined);
  } = {},
): RspackPluginFunction {
  return compiler => {
    const values: Record<string, string | undefined> = {};
    const getValue: (varName: string) => string | undefined =
      typeof source === 'function' ? source : key => source[key];

    for (const key of keys) {
      values[`import.meta.env.${key}`] = JSON.stringify(getValue(key));
    }

    const definePlugin = new rspack.DefinePlugin(values);

    definePlugin.apply(compiler);
  };
}
