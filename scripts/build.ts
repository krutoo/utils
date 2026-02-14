/**
 * This script will build package.
 */
import fs from 'node:fs/promises';
import { execAsync } from './utils.ts';

// clean dist folder
await fs.rm('./dist', { recursive: true, force: true });

// build .js files
await execAsync('npx tsc -p tsconfig.build-js.json');

// build .d.ts files
await execAsync('npx tsc -p tsconfig.build-dts.json');

// format (for reduce package size by replacing indent from 4 to 2)
await execAsync('npx prettier "dist/**/*.js" -w --log-level=error --ignore-path=./.nonexistent');
