import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import { EOL } from 'node:os';

interface Entrypoint {
  importPath: string;
  srcRelativePath: string;
}

function task<A, B>(func: (ctx: A) => Promise<B>): <T extends A>(ctx: T) => Promise<T & B> {
  return async <T extends A>(ctx: T): Promise<T & B> => {
    return { ...ctx, ...(await func(ctx)) };
  };
}

function formatRelative(pathname: string) {
  if (pathname === '.') {
    return '.';
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

function getExportsEntryNPM(data: Entrypoint): [string, { import: string; require: string }] {
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

const defineEntrypoints = task(async (ctx: { filenames: string[] }) => {
  return {
    entrypoints: ctx.filenames
      .map(getEntrypoint)
      .sort((a, b) => (a.importPath > b.importPath ? 1 : -1)),
  };
});

const defineExportsNPM = task(async (ctx: { entrypoints: Entrypoint[] }) => {
  return {
    npmExports: Object.fromEntries(ctx.entrypoints.map(getExportsEntryNPM)),
  };
});

const emitExportsNPM = task(async (ctx: { npmExports: any }) => {
  const filename = './package.json';
  const data = JSON.parse(await fs.readFile(filename, 'utf-8'));

  data.exports = ctx.npmExports;
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
  await fs.appendFile(filename, EOL);
});

const defineExportsJSR = task(async (ctx: { entrypoints: Entrypoint[] }) => {
  return {
    jsrExports: Object.fromEntries(ctx.entrypoints.map(getExportsEntryJSR)),
  };
});

const emitExportsJSR = task(async (ctx: { jsrExports: any }) => {
  const filename = './jsr.json';
  const data = JSON.parse(await fs.readFile(filename, 'utf-8'));

  data.exports = ctx.jsrExports;
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
  await fs.appendFile(filename, EOL);
});

await glob('./src/**/mod.ts', { absolute: true })
  .then(filenames => ({ filenames }))
  .then(defineEntrypoints)
  .then(defineExportsNPM)
  .then(emitExportsNPM)
  .then(defineExportsJSR)
  .then(emitExportsJSR)
  .then(() => {
    console.log('Exports synced with "src" folder');
  });
