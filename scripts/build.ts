/**
 * This script will build package.
 */
import fs from 'node:fs/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// clean dist folder
await fs.rm('./dist', { recursive: true, force: true });

// build esm files
await execAsync('npx tsc -p tsconfig.build-esm.json');

// build cjs files
await execAsync('npx tsc -p tsconfig.build-cjs.json');

// build d.ts files
await execAsync('npx tsc -p tsconfig.build-types.json');

// format (for reduce package size by replacing indent from 4 to 2)
await execAsync('npx prettier "dist/**/*.js" --write --ignore-path=./.nonexistent');

// add inner package.json files with type for esm and cjs
await fs.writeFile('./dist/esm/package.json', JSON.stringify({ type: 'module' }, null, 2));
await fs.writeFile('./dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }, null, 2));
