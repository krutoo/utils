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

const args = parseArgs({
  allowPositionals: true,
  allowNegative: true,
  options: {
    coverage: { type: 'boolean', default: false },
    concurrency: { type: 'boolean', default: true },
  },
});

const testGlobs = args.positionals.length ? args.positionals : ['src/**/*.test.{js,jsx,ts,tsx}'];

run({
  globPatterns: testGlobs,
  concurrency: args.values.concurrency,
  coverage: args.values.coverage,
  coverageExcludeGlobs: [...testGlobs, 'scripts/**/*'],
  lineCoverage: 80,
  branchCoverage: 80,
  functionCoverage: 80,
})
  .on('test:fail', () => void (process.exitCode = 1))
  .compose(spec)
  .pipe(process.stdout);
