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
    const navigate: UseNavigateReturn = (url: string) => router.navigate(url);

    // IMPORTANT: arrow function is needed here to  prevent lost call context
    // eslint-disable-next-line react-hooks/immutability
    navigate.go = delta => router.go(delta);

    return navigate;
  }, [router]);
}
