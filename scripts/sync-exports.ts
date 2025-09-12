/**
 * This script updates "exports" field in package.json according to "src" folder.
 * Each `mod.ts` in "src" folder will be interpreted as entrypoint.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { EOL } from 'node:os';

type ExportsEntry = [
  string,
  {
    types?: string;
    import?: string;
    require?: string;
  },
];

class JsonFile {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async setProperty(key: string, value: any) {
    const data = JSON.parse(await fs.readFile(this.filename, 'utf-8'));

    data[key] = value;

    await fs.writeFile(this.filename, `${JSON.stringify(data, null, 2)}${EOL}`);
  }
}

async function glob(pattern: string) {
  const result: string[] = [];

  for await (const pathname of fs.glob(pattern)) {
    result.push(path.relative('./', pathname));
  }

  return result;
}

function formatPathname(pathname: string) {
  if (pathname === '.' || pathname.startsWith('./') || pathname.startsWith('/')) {
    return pathname;
  }

  return `./${pathname}`;
}

function exportsEntryFromEntrypoint(pathname: string): ExportsEntry {
  const basename = path.basename(pathname, path.extname(pathname));
  const srcRelativePath = path.relative('./src', pathname);
  const distRelativePath = path.join(path.dirname(srcRelativePath), `${basename}.js`);
  const distRelativePathDts = path.join(path.dirname(srcRelativePath), `${basename}.d.ts`);

  return [
    formatPathname(path.dirname(srcRelativePath)),
    {
      import: formatPathname(path.join('dist/esm', distRelativePath)),
      require: formatPathname(path.join('dist/cjs', distRelativePath)),

      // According to https://mayank.co/blog/dual-packages
      types: formatPathname(path.join('dist/types', distRelativePathDts)),
    },
  ];
}

function exportsEntryFromTyping(pathname: string): ExportsEntry {
  return [
    formatPathname(path.relative('./public', pathname).replace(/\.d\.ts$/, '')),
    {
      types: formatPathname(path.relative('./', pathname)),
    },
  ];
}

function compareEntries(a: ExportsEntry, b: ExportsEntry) {
  return a[0].localeCompare(b[0]);
}

const entrypoints = await glob('./src/**/mod.ts');
const typings = await glob('./public/**/*.d.ts');

const exports = {
  ...Object.fromEntries(entrypoints.map(exportsEntryFromEntrypoint).sort(compareEntries)),
  ...Object.fromEntries(typings.map(exportsEntryFromTyping).sort(compareEntries)),
};

await new JsonFile('./package.json').setProperty('exports', exports);

// eslint-disable-next-line no-console
console.log('Exports synced');
