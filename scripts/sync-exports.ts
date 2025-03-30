/**
 * This script updates "exports" field in package.json according to "src" folder.
 * Each `mod.ts` in "src" folder will be interpreted as entrypoint.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import { EOL } from 'node:os';

interface Entrypoint {
  importPath: string;
  srcRelativePath: string;
}

interface ImportDefinition {
  import: string;
  require: string;
}

class JsonFile {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async set(key: string, value: any) {
    const data = JSON.parse(await fs.readFile(this.filename, 'utf-8'));

    data[key] = value;

    await fs.writeFile(this.filename, `${JSON.stringify(data, null, 2)}${EOL}`);
  }
}

function formatRelative(pathname: string) {
  if (pathname === '.') {
    return pathname;
  }

  return pathname.startsWith('./') ? pathname : `./${pathname}`;
}

function getEntrypoint(pathname: string): Entrypoint {
  const relativePath = path.relative('./src', pathname);

  return {
    importPath: path.dirname(relativePath),
    srcRelativePath: relativePath,
  };
}

function getExportsEntryNPM(data: Entrypoint): [string, ImportDefinition] {
  const basename = path.basename(data.srcRelativePath, path.extname(data.srcRelativePath));
  const relativeDistPath = path.join(path.dirname(data.srcRelativePath), `${basename}.js`);

  return [
    formatRelative(data.importPath),
    {
      import: formatRelative(path.join('dist/esm', relativeDistPath)),
      require: formatRelative(path.join('dist/cjs', relativeDistPath)),
    },
  ];
}

function getExportsEntryJSR(entrypoint: Entrypoint): [string, string] {
  return [
    formatRelative(entrypoint.importPath),
    formatRelative(path.join('src', entrypoint.srcRelativePath)),
  ];
}

await glob('./src/**/mod.ts', { absolute: true })
  .then(filenames => ({
    entrypoints: filenames
      .map(getEntrypoint)
      .sort((a, b) => (a.importPath > b.importPath ? 1 : -1)),
  }))
  .then(ctx => ({
    exportsNPM: Object.fromEntries(ctx.entrypoints.map(getExportsEntryNPM)),
    exportsJSR: Object.fromEntries(ctx.entrypoints.map(getExportsEntryJSR)),
  }))
  .then(async ctx => {
    await new JsonFile('./package.json').set('exports', ctx.exportsNPM);
    await new JsonFile('./jsr.json').set('exports', ctx.exportsJSR);
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Exports synced with "src" folder');
  });
