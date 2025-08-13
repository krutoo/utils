/**
 * This script runs tests.
 * By default all `*.test.{js,jsx,ts,tsx}` files in `src` folder will be run.
 * You can provide custom pattern by first stdin argument (like in Jest).
 * You can also provide `--coverage` to collect coverage.
 */
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { parseArgs } from 'node:util';

const config = parseArgs({
  allowPositionals: true,
  options: {
    coverage: {
      type: 'boolean',
      default: false,
    },
  },
});

const testsGlob = config.positionals[0] ?? 'src/**/*.test.{js,jsx,ts,tsx}';

run({
  globPatterns: [testsGlob],
  coverage: config.values.coverage,
  coverageExcludeGlobs: [testsGlob],
})
  .on('test:fail', () => void (process.exitCode = 1))
  .compose(spec)
  .pipe(process.stdout);
