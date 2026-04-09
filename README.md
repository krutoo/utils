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

All React utilities, components and hooks are 100% SSR ready.

```jsx
import { useMatchMedia } from '@krutoo/utils/react';

function App() {
  const mobile = useMatchMedia('(max-width: 1024px)');

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
    utils.pluginTypeScript(),
    utils.pluginCSS(),
    utils.pluginHTML(),
    utils.pluginRawImport(),
    utils.pluginPublicFiles(),
    // ...and more
  ],
};
```

**Testing** utils is available from `/testing` path.

```js
import { ResizeObserverMock } from '@krutoo/utils/testing';

const mock = new ResizeObserverMock();
```

## Development

Repo description and how to work with

### File structure

- `src` folder contains files that will be compiled
- `public` folder contains files that will be added to package as is

### Writing unit-tests

Test for module `{path}/{module}.ts` should be placed in `{path}/__test__/{module}.test.ts`.

For write tests with simulating browser environment you need to name test file like `*.web.test.ts`.

### Exports convention

Any exported file from this package should not contain default exports (`export default ...`).
Defaults exports are hard to work with and less compatible between ESM and CJS.

### Environment setup

First you need to use suitable Node.js version, for example by `nvm`:

```shell
nvm use && npm install
```

### VSCode setup

This command will create/update `.vscode/settings.json`

```shell
npm run setup -- --vscode
```

## Q&A

Notable info about this package

### What is a custom `sideEffects` property in `package.json`?

This property need for bundlers like **Webpack** and **Rspack** that uses it for check that Tree Shaking is available.

Details here: https://webpack.js.org/guides/tree-shaking

TL;DR Side effects include:

- any function call on top level of module
- any mutation of imported variables on top level of module
