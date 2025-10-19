/**
 * Token. Tokens can be used to register components in DI-container.
 * Basically it is extended unique identifier.
 */
export interface Token<T> {
  readonly key: symbol;
  resolve(source: unknown): T;
}

/**
 * Resolver - function to resolve component by token.
 * You can think about resolver as about an analogue of `require('name')` from CommonJS.
 */
export interface Resolve {
  <T>(token: Token<T>): T;
}

/**
 * Provider - function that returns implementation of component.
 * You can think about resolver as about an module in CommonJS.
 */
export interface Provider<T> {
  (resolve: Resolve): T;
}

/**
 * DI container - object to set or get components that can be depends on each other.
 * You can register components by calling `.set(token, provider)` where:
 * - token is identifier that later will be used to resolve component.
 * - provider is function that returns component implementation.
 */
export interface Container {
  /**
   * Add component by providing `token` and `provider`.
   */
  set: <T>(token: Token<T>, provider: Provider<T>) => void;

  /**
   * Get component by token.
   */
  get: Resolve;
}
