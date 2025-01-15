import { useCallback, useMemo, useState } from 'react';
import type { Status } from '../types/mod.ts';
import { useIdentityRef } from './use-identity-ref.ts';

/** Options of `useMutation` hook. */
export interface UseMutationOptions<T, R> {
  /** Mutation implementation. */
  mutation: (payload: T) => Promise<R>;

  /** Callback that will be called after mutation is done. */
  onSuccess?: (data: R) => void;

  /** Callback that will be called after mutation is failed. */
  onError?: (error: unknown) => void;
}

/** State of mutation. */
export interface MutationState<T> {
  /** Status of mutation. */
  status: Status;

  /** Data from last successful mutation. */
  data: null | T;

  /** Error from last failed mutation. */
  error: null | unknown;
}

/** Result value type of `useMutation` hook. */
export interface UseMutationReturn<T, R> extends MutationState<R> {
  /** Starts a mutation. */
  mutate: (payload: T) => Promise<R>;
}

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

  const mutationRef = useIdentityRef(mutation);
  const onSuccessRef = useIdentityRef(onSuccess);
  const onErrorRef = useIdentityRef(onError);

  const mutate = useCallback(
    async (payload: T): Promise<R> => {
      setState(current => ({
        ...current,
        status: 'fetching',
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
