import { pipe } from '../pipe.ts';

// Compile-time checks. This file is not matched by the runtime test glob.

pipe(
  (x: number) => x,
  (value: number) => value * 2,
);
pipe(
  (x: number) => x,
  (value: number, extra?: number) => value + (extra ?? 0),
);
pipe(
  (x: number) => x,
  (...values: number[]) => values.length,
);

// @ts-expect-error second function requires two arguments
// prettier-ignore
pipe((x: number) => x, (a: number, b: number) => a + b);

// @ts-expect-error incompatible argument type
// prettier-ignore
pipe((x: number) => x, (a: string) => a);

const withThis = pipe(
  function (this: { name: string }, value: number) {
    return value;
  },
  function (this: { name: string }, value: number) {
    return value + 1;
  },
);

withThis.call({ name: 'ctx' }, 1);

// @ts-expect-error wrong this type
withThis.call({ other: 'ctx' }, 1);

const single = pipe(function (this: { name: string }, value: number) {
  return value;
});

single.call({ name: 'ctx' }, 1);

// @ts-expect-error wrong this type
single.call({ other: 'ctx' }, 1);
