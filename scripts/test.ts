/**
 * This script runs tests.
 * By default all `*.test.{js,jsx,ts,tsx}` files in `src` folder will be run.
 * You can provide custom glob patterns by positional arguments.
 * By default tests run concurrently, you can disable it by adding `--no-concurrency`.
 * You can enabled collecting coverage by adding `--coverage`.
 */
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { parseArgs } from 'node:util';

const config = parseArgs({
  allowPositionals: true,
  allowNegative: true,
  options: {
    coverage: { type: 'boolean', default: false },
    concurrency: { type: 'boolean', default: true },
  },
});

const testGlobs =
  config.positionals.length > 0 ? config.positionals : ['src/**/*.test.{js,jsx,ts,tsx}'];

run({
  globPatterns: testGlobs,
  concurrency: config.values.concurrency,
  coverage: config.values.coverage,
  coverageExcludeGlobs: [...testGlobs, 'scripts/**/*'],
})
  .on('test:fail', () => void (process.exitCode = 1))
  .compose(spec)
  .pipe(process.stdout);
