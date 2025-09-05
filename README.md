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

## Usage

Most of the utils are available from package root:

```js
import { pairs } from '@krutoo/utils';

const list = [1, 2, 3];

for (const [a, b] of pairs(list)) {
  console.log(a, b);
}

// output:
// 1 2
// 1 3
// 2 3
```

**React** utils is available from `/react` path.

[React](https://react.dev/) must be installed in your project.

```jsx
import { useMatchMedia } from '@krutoo/utils/react';

function App() {
  const isMobile = useMatchMedia('(max-width: 1024px)');

  return <>...</>;
}
```

**Rspack** utils is available from `/rspack` path.

[Rspack](https://rspack.dev/) must be installed in your project.

```js
// rspack.config.js
import * as utils from '@krutoo/utils/rspack';

export default {
  entry: './src/index.ts',
  plugins: [
    // typescript support (with alias from "paths" of tsconfig and `resolve.alias` extending)
    utils.pluginTypeScript(),

    // css and css-modules support ("css-loader" must be added to your project)
    utils.pluginCSS(),

    // html file will be added to bundle
    utils.pluginHTML({ template: './src/index.html' }),

    // import file source code by `?raw` query or `with { type: 'text' }`
    utils.pluginRawImport(),

    // "public" folder will be copied to bundle
    utils.pluginPublicFiles(),

    // ...and other
  ],
};
```

**Testing** utils is available from `/testing` path.

```js
import { ResizeObserverMock } from '@krutoo/utils/testing';

const mock = new ResizeObserverMock();
```

## Development

Minimum Node.js version is `22.6.0`, minimum NPM version is `10.9.3`. Primarily It's because of `test` script in `package.json` which uses glob pattern.

### How to write unit-tests?

Test for module `{path}/{module}.ts` should be placed in `{path}/__test__/{module}.test.ts`.

By default test environment is just Node.js environment.

For write tests with simulating browser environment you need to name test file like `a.web.test.ts`.

### Package structure

- `src` folder contains files that will be compiled
- `public` folder contains files that will be added to package as is

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
# delete tsimp cache and stop daemon
npx tsimp --clear
```

### NPM-script shows irrelevant type check errors

```bash
# delete tsimp cache and stop daemon
npx tsimp --clear
```

### `npm install <something>` is infinite

Temporary comment this line in `.npmrc`:

```
node-options='--import tsimp/import'
```
