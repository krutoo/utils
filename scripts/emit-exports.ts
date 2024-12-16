import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';

function formatRelative(pathname: string): string {
  return pathname === '.' ? pathname : `./${pathname}`;
}

const srcDir = path.resolve(process.cwd(), './src');

const filenames = await glob(path.resolve(srcDir, './**/mod.ts'), {
  absolute: true,
});

const entrypoints = filenames
  .map(absolutePath => {
    const relativePath = path.relative(srcDir, absolutePath);
    const relativeDir = path.dirname(relativePath);
    const basename = path.basename(relativePath, path.extname(relativePath));
    const relativeOutputPath = path.join(relativeDir, `${basename}.js`);

    return {
      absolutePath,
      relativePath,
      relativeDir,
      relativeOutputPath,
    };
  })
  .sort((a, b) => {
    return a.relativeDir > b.relativeDir ? 1 : -1;
  });

const exports: Record<string, { import: string; require: string }> = {};

for (const item of entrypoints) {
  exports[formatRelative(item.relativeDir)] = {
    import: formatRelative(path.join('dist/esm', item.relativeOutputPath)),
    require: formatRelative(path.join('dist/cjs', item.relativeOutputPath)),
  };
}

await fs.rm('./temp', { recursive: true, force: true });
await fs.mkdir('./temp');
await fs.writeFile('./temp/exports.json', JSON.stringify(exports, null, 2));
