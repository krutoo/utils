/**
 * Distributive version of Omit.
 * Useful for intersection of types.
 * @link https://stackoverflow.com/a/72790170/13166471
 */
export type DistributiveOmit<T, K extends string> = T extends any ? Omit<T, K> : never;
