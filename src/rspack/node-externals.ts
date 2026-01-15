import type { ExternalItem, ExternalsType, ExternalItemFunctionData } from '@rspack/core';
import { isObject } from '../misc/is-object.ts';

type ResolveAsync = (context: string, request: string) => Promise<string>;

export type AllowlistItemFunction = (request: string) => boolean;

export type AllowlistItem = string | RegExp | AllowlistItemFunction;

export interface NodeExternalsOptions {
  /** Method of importing requested module. */
  importType?: ExternalsType;

  /** Defines modules that should be included to bundle. */
  allow?: AllowlistItem | AllowlistItem[];
}

/**
 * Simple analogue of `webpack-node-externals`.
 * Marks all files from node_modules as externals.
 * @param options Options.
 * @returns Externals function.
 */
export function nodeExternals({
  importType = 'commonjs',
  allow,
}: NodeExternalsOptions = {}): ExternalItem {
  const allowPredicates = allowToPredicates(allow);

  const isAllowed = (request: string): boolean => {
    for (const predicate of allowPredicates) {
      if (predicate(request)) {
        return true;
      }
    }

    return false;
  };

  return async ({ request, context, getResolve }: ExternalItemFunctionData) => {
    // @todo по идее isAllowed надо применять только после проверки node_modules
    if (!context || !request || isAllowed(request)) {
      return;
    }

    const resolve = getResolve?.() as ResolveAsync | undefined;

    // IMPORTANT: try is needed because resolve throws when request is like "node:path"
    try {
      const filename = await resolve?.(context, request);

      if (filename && filename.includes('node_modules')) {
        return `${importType} ${request}`;
      }
    } catch {
      // noop
    }
  };
}

/**
 * Takes `allow` option value and returns list of predicate functions.
 * @param allow Option value.
 * @returns Function list.
 */
function allowToPredicates(allow: NodeExternalsOptions['allow']): AllowlistItemFunction[] {
  const result: AllowlistItemFunction[] = [];

  for (const item of allowToArray(allow)) {
    if (typeof item === 'string') {
      result.push(request => request === item);
    }

    if (isRegExpLike(item)) {
      result.push(request => item.test(request));
    }

    if (typeof item === 'function') {
      result.push(item);
    }
  }

  return result;
}

/**
 * Takes `allow` option value and returns array.
 * @param allow Option value.
 * @returns Array.
 */
function allowToArray(allow: NodeExternalsOptions['allow']) {
  if (Array.isArray(allow)) {
    return allow;
  }

  return allow ? [allow] : [];
}

/**
 * Checks that value is Regexp like.
 * @param value Value.
 * @returns Boolean.
 */
function isRegExpLike(value: unknown): value is RegExp {
  return isObject(value) && 'test' in value && typeof value.test === 'function';
}
