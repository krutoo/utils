import type { AnyFunction } from '../mod.ts';
import { noop } from './noop.ts';

export type FunctionPipe<List extends AnyFunction[]> = List extends [
  infer F1 extends AnyFunction,
  infer F2 extends AnyFunction,
  ...infer Rest extends AnyFunction[],
]
  ? [ReturnType<F1>] extends [Parameters<F2>[0]]
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

export function pipe(): () => void;

export function pipe<F extends AnyFunction>(func: F): (...args: Parameters<F>) => ReturnType<F>;

export function pipe<Funcs extends AnyFunction[]>(
  ...funcs: FunctionPipe<Funcs> & Funcs
): (...args: FirstItemParameters<Funcs>) => LastItemReturnType<Funcs>;

/**
 * Returns function that applies given functions from left to right.
 * @param funcs Functions.
 * @returns Function.
 */
export function pipe<Funcs extends AnyFunction[]>(
  ...funcs: FunctionPipe<Funcs> & Funcs
): (...args: FirstItemParameters<Funcs>) => LastItemReturnType<Funcs> {
  if (funcs.length === 0) {
    return noop as AnyFunction;
  }

  if (funcs.length === 1) {
    return (...args: any[]) => funcs[0](...args);
  }

  return (...args: any[]): any => {
    let acc: any = funcs[0]!(...args);

    for (let i = 1; i < funcs.length; i++) {
      acc = funcs[i]!(acc);
    }

    return acc;
  };
}
