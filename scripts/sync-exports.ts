/**
 * This script updates "exports" field in package.json according to "src" folder.
 * Each `mod.ts` in "src" folder will be interpreted as entrypoint.
 */
import path from 'node:path';
import { JsonFile, normalizePathname } from './utils.ts';
import { glob } from 'node:fs/promises';

type ExportsEntry = [string, string | { types?: string }];

function exportsEntryFromEntrypoint(pathname: string): ExportsEntry {
  const basename = path.basename(pathname, path.extname(pathname));
  const srcRelativePath = path.relative('./src', pathname);
  const distRelativePath = path.join(path.dirname(srcRelativePath), `${basename}.js`);

  return [
    normalizePathname(path.dirname(srcRelativePath)),
    normalizePathname(path.join('dist', distRelativePath)),
  ];
}

function exportsEntryFromTyping(pathname: string): ExportsEntry {
  return [
    normalizePathname(path.relative('./public', pathname).replace(/\.d\.ts$/, '')),
    {
      types: normalizePathname(path.relative('./', pathname)),
    },
  ];
}

function compareEntries([a]: ExportsEntry, [b]: ExportsEntry) {
  return a.localeCompare(b);
}

const entrypoints = await Array.fromAsync(glob('./src/**/mod.ts'));
const typings = await Array.fromAsync(glob('./public/**/*.d.ts'));

const exports = {
  ...Object.fromEntries(entrypoints.map(exportsEntryFromEntrypoint).sort(compareEntries)),
  ...Object.fromEntries(typings.map(exportsEntryFromTyping).sort(compareEntries)),
};

await new JsonFile('./package.json').setProperty('exports', exports);

// eslint-disable-next-line no-console
console.log('Exports synced');
