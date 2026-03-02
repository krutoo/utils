import { useContext, useState } from 'react';
import { RouterContext } from '../context/router-context.ts';
import type { RouterLocation } from '../../router/types.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';

/**
 * Returns current router location state.
 * @returns Location.
 */
export function useLocation(): RouterLocation {
  const router = useContext(RouterContext);
  const [location, setLocation] = useState<RouterLocation>(() => router.getLocation());

  useIsomorphicLayoutEffect(() => {
    const sync = () => {
      setLocation(router.getLocation());
    };

    sync();

    return router.subscribe(sync);
  }, [router]);

  return location;
}
