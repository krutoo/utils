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
await execAsync('npx tsc -p tsconfig.build.json');

// format (for reduce package size by replacing indent from 4 to 2)
await execAsync('npx prettier "dist/**/*.js" --write --ignore-path=./.nonexistent');
