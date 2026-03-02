import { useContext, useMemo } from 'react';
import type { Router } from '../../router/types.ts';
import { RouterContext } from '../context/router-context.ts';

export type UseNavigateReturn = Router['navigate'] & {
  go: Router['go'];
};

/**
 * Returns navigate function with extra methods.
 * @returns Navigate function.
 */
export function useNavigate(): UseNavigateReturn {
  const router = useContext(RouterContext);

  return useMemo<UseNavigateReturn>(() => {
    const navigateWrapper: UseNavigateReturn = (url: string) => router.navigate(url);

    // eslint-disable-next-line react-hooks/immutability
    navigateWrapper.go = router.go;

    return navigateWrapper;
  }, [router]);
}
