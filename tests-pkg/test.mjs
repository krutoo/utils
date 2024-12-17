import assert from 'node:assert';
import { test } from 'node:test';

test('entrypoint should work with ESM', () => {
  assert.doesNotReject(async () => {
    const pkg = await import('@krutoo/utils');

    await pkg.wait(100).then(() => {});
  });
});
