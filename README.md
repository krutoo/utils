# Utils

Collection of useful utils for JavaScript/TypeScript projects. Some utilities are created for training and educational purposes.

## Installation

```bash
# Node (from NPM)
npm add @krutoo/utils

# Deno (from JSR)
deno add jsr:@krutoo/utils

# Bun (from NPM)
bun add @krutoo/utils
```

## Development

Minimum Node.js version is 22. Primarily It's because of `test` script in `package.json` which uses glob pattern.

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
