# Utils

Collection of useful utils for JavaScript/TypeScript projects. Some utilities are created for training and educational purposes.

## Installation

```bash
# In Node.js
npm add @krutoo/utils

# In Deno
deno add npm:@krutoo/utils

# In Bun
bun add @krutoo/utils
```

## Development

Minimum Node.js version is 22. Primarily It's because of `test` script in `package.json` which uses glob pattern.

### How to write unit-tests?

Test for module `src/a.ts` should be placed in `src/__test__/a.test.ts`

By default test environment is simulates browser.

For write tests without browser environment simulate you need to name it like `a.node.test.ts`.

## Q&A

Notable info about this package

### How Node.js scripts works with TypeScript?

In `package.json` you can see something like:

```json
{
  "scripts": {
    "hello": "node ./scripts/hello.ts"
  }
}
```

It is working because in `.npmrc` there is:

```
node-options='--import tsimp/import'
```

### What is a custom `sideEffects` property in `package.json`?

This property need for bundlers like **Webpack** and **Rspack** that uses it for check that Tree Shaking is available.

Details here: https://webpack.js.org/guides/tree-shaking

TL;DR Side effects include:

- any function call on top level of module
- any mutation of imported variables on top level of module

## Troubleshoot

Solutions to known problems when working with repository

### NPM-script terminates immediately without doing anything

```bash
# delete tsimp cache
rm -rf .tsimp
```

### NPM-script shows irrelevant type check errors

```bash
# delete tsimp cache
rm -rf .tsimp
```
