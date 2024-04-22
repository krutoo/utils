// https://stackoverflow.com/a/72790170/13166471
// deno-lint-ignore no-explicit-any
export type DistributiveOmit<T, K extends string> = T extends any
  ? Omit<T, K>
  : never;
