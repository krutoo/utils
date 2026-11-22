import { type DependencyList, useRef } from 'react';
import { isShallowEqual } from '../misc/is-shallow-equal.ts';

/**
 * Calls callback immediately (during render) if dependencies changed since last render.
 * Useful when you don't need to wait for DOM changes.
 * Inspired by this article: https://react.dev/learn/you-might-not-need-an-effect.
 *
 * IMPORTANT: because "instant effect" runs immediately - it runs both on server and client side,
 * so you need to check window/document/etc before use.
 *
 * Destructors (cleanup functions returned from effects) are not supported by design. For subscriptions
 * useEffect/useLayoutEffect/useIsomorphicLayoutEffect should be used.
 *
 * @param callback Effect callback.
 * @param deps Dependency list.
 */
export function useInstantEffect(callback: () => void, deps?: DependencyList): void {
  const depsRef = useRef<DependencyList>(null);

  if (!deps || !depsRef.current || !isShallowEqual(deps, depsRef.current)) {
    depsRef.current = deps ?? null;

    callback();
  }
}
