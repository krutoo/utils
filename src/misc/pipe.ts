import type { AnyFunction } from '../types/functions.ts';
import { noop } from './noop.ts';

export type FunctionPipe<List extends AnyFunction[]> = List extends [
  infer F1 extends AnyFunction,
  infer F2 extends AnyFunction,
  ...infer Rest extends AnyFunction[],
]
  ? [ReturnType<F1>] extends Parameters<F2>
    ? [F1, ...FunctionPipe<[F2, ...Rest]>]
    : never
  : List;

export type FirstItemParameters<List extends AnyFunction[]> = List extends [
  infer FirstFn extends AnyFunction,
  ...AnyFunction[],
]
  ? Parameters<FirstFn>
  : never;

export type LastItemReturnType<List extends AnyFunction[]> = List extends [
  ...AnyFunction[],
  infer LastFn extends AnyFunction,
]
  ? ReturnType<LastFn>
  : never;

export type FirstItemThisParameterType<List extends AnyFunction[]> = List extends [
  infer FirstFn extends AnyFunction,
  ...AnyFunction[],
]
  ? ThisParameterType<FirstFn>
  : unknown;

export function pipe(): () => void;

export function pipe<F extends AnyFunction>(
  func: F,
): (this: ThisParameterType<F>, ...args: Parameters<F>) => ReturnType<F>;

export function pipe<Funcs extends AnyFunction[]>(
  ...funcs: FunctionPipe<Funcs> & Funcs
): (
  this: FirstItemThisParameterType<Funcs>,
  ...args: FirstItemParameters<Funcs>
) => LastItemReturnType<Funcs>;

/**
 * Returns function that applies given functions from left to right.
 * @param funcs Functions.
 * @returns Function.
 */
export function pipe<Funcs extends AnyFunction[]>(
  ...funcs: FunctionPipe<Funcs> & Funcs
): (
  this: FirstItemThisParameterType<Funcs>,
  ...args: FirstItemParameters<Funcs>
) => LastItemReturnType<Funcs> {
  if (funcs.length === 0) {
    return noop as AnyFunction;
  }

  if (funcs.length === 1) {
    return function (...args: unknown[]) {
      return funcs[0].call(this, ...args);
    };
  }

  return function (...args: unknown[]): unknown {
    let acc: unknown = funcs[0]!.call(this, ...args);

    for (let i = 1; i < funcs.length; i++) {
      acc = funcs[i]!.call(this, acc);
    }

    return acc;
  } as (
    this: FirstItemThisParameterType<Funcs>,
    ...args: FirstItemParameters<Funcs>
  ) => LastItemReturnType<Funcs>;
}
