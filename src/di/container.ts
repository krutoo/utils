import type { Container, Provider, Token } from './types.ts';

/**
 * Very basic implementation of DI-container.
 *
 * Re-registration of component not allowed (second call `.set` with same token).
 * When provider not found error will thrown.
 *
 * Cycle dependency detection performs during resolving (inside `.get`).
 * When cycle dependency found error will thrown.
 *
 * Resolved components are cached, so second resolving will get same value.
 * To make component always new on resolving, just make factory wrapper.
 */
class ContainerImpl implements Container {
  protected registry: Map<symbol, Provider<any>>;
  protected cache: Map<symbol, any>;

  constructor() {
    this.registry = new Map();
    this.cache = new Map();
  }

  set<T>(token: Token<T>, provider: Provider<T>): void {
    if (this.registry.has(token.key)) {
      throw new Error(`Already registered ${token}`);
    }

    this.registry.set(token.key, provider);
  }

  get<T>(token: Token<T>): T {
    const resolve = <C>(tkn: Token<C>, chain: Token<any>[] = []): C => {
      if (this.cache.has(tkn.key)) {
        return this.cache.get(tkn.key);
      }

      if (chain.includes(tkn)) {
        throw Error(`Cycle dependency found: ${[...chain, tkn].join(', ')}`);
      }

      chain.push(tkn);

      const provider = this.registry.get(tkn.key);

      if (!provider) {
        throw Error(`Provider for ${tkn} not found`);
      }

      const component = provider(t => resolve(t, chain));

      this.cache.set(tkn.key, component);

      return component;
    };

    return resolve(token);
  }
}

/**
 * Creates new DI-container.
 * @returns Container.
 */
export function createContainer(): Container {
  return new ContainerImpl();
}
