/**
 * This script will setup dev environment.
 * Currently only VSCode supported.
 */
import { parseArgs } from 'node:util';
import { JsonFile } from './utils.ts';

const config = parseArgs({
  options: {
    vscode: { type: 'boolean' },
    'vscode-eslint': { type: 'boolean' },
    'vscode-typescript': { type: 'boolean' },
  },
  allowNegative: true,
});

const entries = [
  {
    name: 'vscode-typescript',
    enabled: config.values['vscode-typescript'] ?? config.values.vscode,
    async apply() {
      await new JsonFile('.vscode/settings.json').setProperty(
        'typescript.tsdk',
        'node_modules/typescript/lib',
      );
    },
  },
  {
    name: 'vscode-eslint',
    enabled: config.values['vscode-eslint'] ?? config.values.vscode,
    async apply() {
      await new JsonFile('.vscode/settings.json').setContent((actual: any) => ({
        ...actual,
        'eslint.execArgv': ['--experimental-strip-types'],
        'eslint.options': {
          ...actual?.['eslint.options'],
          flags: ['unstable_native_nodejs_ts_config'],
        },
      }));
    },
  },
];

for (const entry of entries) {
  if (!entry.enabled) {
    console.log(`setup: ${entry.name} - skip`); // eslint-disable-line no-console
    continue;
  }

  await entry.apply();
  console.log(`setup: ${entry.name} - done`); // eslint-disable-line no-console
}
