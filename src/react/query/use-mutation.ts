import { useCallback, useMemo, useState } from 'react';
import { useLatestRef } from '../use-latest-ref.ts';
import type { MutationState, UseMutationOptions, UseMutationReturn } from './types.ts';

/**
 * Returns initial state of mutation hook.
 * @returns State.
 */
function getInitialState<T>(): MutationState<T> {
  return {
    status: 'initial',
    data: null,
    error: null,
  };
}

/**
 * Mutation hook. Mutation is changing (create/update/delete) some entity in data source.
 *
 * This is a minimalistic analogue of `useMutation` from `@tanstack/react-query` made for educational purposes.
 *
 * @param options Mutation options.
 * @returns Mutation.
 *
 * @example
 * ```tsx
 * import { useMutation } from '@krutoo/utils/react';
 *
 * function App () {
 *   const creating = useMutation({
 *     async mutation (data: { name: string, price: number }) {
 *       const response = await fetch('api/item', {
 *         method: 'POST',
 *         body: JSON.stringify(data),
 *       });
 *
 *       if (!response.ok) {
 *         throw "Error during fetching data";
 *       }
 *
 *       return await response.json();
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={() => creating.mutate({ name: 'foo', price: 99 })}>
 *       <input name="name" />
 *       <input name="price" />
 *       <button type="submit" disabled={creating.status === 'fetching'}>
 *         Submit
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useMutation<T, R = unknown>({
  mutation,
  onSuccess,
  onError,
}: UseMutationOptions<T, R>): UseMutationReturn<T, R> {
  const [state, setState] = useState<MutationState<R>>(getInitialState);

  const mutationRef = useLatestRef(mutation);
  const onSuccessRef = useLatestRef(onSuccess);
  const onErrorRef = useLatestRef(onError);

  const mutate = useCallback(
    async (payload: T): Promise<R> => {
      setState(current => ({
        ...current,
        status: 'pending',
      }));

      try {
        const result = await mutationRef.current(payload);

        onSuccessRef.current?.(result);

        setState(current => ({
          ...current,
          data: result,
          status: 'success',
          error: null,
        }));

        return result;
      } catch (error) {
        onErrorRef.current?.(error);

        setState(current => ({
          ...current,
          error: error,
          status: 'failure',
        }));

        // we do not mute error
        throw error;
      }
    },
    [mutationRef, onSuccessRef, onErrorRef],
  );

  return useMemo<UseMutationReturn<T, R>>(() => {
    return {
      ...state,
      mutate,
    };
  }, [state, mutate]);
}
