/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

const config = parseArgs({
  options: {
    vscode: { type: 'boolean' },
    'vscode-eslint': { type: 'boolean' },
    'vscode-typescript': { type: 'boolean' },
  },
  allowNegative: true,
});

async function setVscodeSettings(update: (actual: Record<string, any>) => Record<string, any>) {
  const settingsPath = path.resolve(import.meta.dirname, '../.vscode/settings.json');

  const currentSettings = await fs
    .readFile(settingsPath, 'utf-8')
    .then(JSON.parse)
    .catch(() => ({}));

  const updatedSettings = {
    ...currentSettings,
    ...update(currentSettings),
  };

  await fs.mkdir(path.dirname(settingsPath), { recursive: true });
  await fs.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2));
}

if (config.values['vscode-typescript'] ?? config.values.vscode) {
  await setVscodeSettings(actual => ({
    ...actual,
    'typescript.tsdk': 'node_modules/typescript/lib',
  }));

  console.log('setup: vscode typescript - done');
} else {
  console.log('setup: vscode typescript - skip');
}

if (config.values['vscode-eslint'] ?? config.values.vscode) {
  await setVscodeSettings(actual => ({
    'eslint.execArgv': ['--experimental-strip-types'],
    'eslint.options': {
      ...actual?.['eslint.options'],
      flags: ['unstable_native_nodejs_ts_config'],
    },
  }));
  console.log('setup: vscode eslint - done');
} else {
  console.log('setup: vscode eslint - skip');
}
