const { test } = require('node:test');
const assert = require('node:assert');

test('entrypoint should works with CommonJS', () => {
  assert.doesNotThrow(() => {
    const pkg = require('@krutoo/utils');

    pkg.wait(100).then(() => {});
  });
});
