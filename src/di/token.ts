import type { Token } from './types.ts';

class TokenImpl<T> implements Token<T> {
  readonly key: symbol;

  constructor(name?: string) {
    this.key = Symbol(name);
  }

  resolve(source: unknown): T {
    return (source as Map<symbol, any>).get(this.key);
  }

  toString(): string {
    return `Token(${this.key.description ?? 'unknown'})`;
  }
}

/**
 * Creates new token.
 * @param name Optional name, useful in debug.
 * @returns Token.
 */
export function createToken<T = never>(name?: string): Token<T> {
  return new TokenImpl(name);
}
