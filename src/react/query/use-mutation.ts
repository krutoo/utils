import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLatestRef } from '../use-latest-ref.ts';
import type { MutationState, UseMutationOptions, UseMutationReturn } from './types.ts';
import { useQueryControl } from './use-query-control.ts';
import { generateId } from './utils.ts';

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
  key: keyProp,
  mutation,
  onSuccess,
  onError,
}: UseMutationOptions<T, R>): UseMutationReturn<T, R> {
  const key = useMemo(() => keyProp ?? generateId('mutation:'), [keyProp]);
  const control = useQueryControl<R>(key);
  const [state, setState] = useState<MutationState<R>>(() => control.getState());

  const mutationRef = useLatestRef(mutation);
  const onSuccessRef = useLatestRef(onSuccess);
  const onErrorRef = useLatestRef(onError);

  useEffect(() => {
    const onChanged = () => {
      const newState = control.getState();

      setState(newState);

      if (newState.status === 'success') {
        onSuccessRef.current?.(newState.data as R);
      }

      if (newState.status === 'failure') {
        onErrorRef.current?.(newState.error);
      }
    };

    setState(control.getState());

    control.events.addEventListener('changed', onChanged);

    return () => {
      control.events.removeEventListener('changed', onChanged);
    };
  }, [control, onSuccessRef, onErrorRef]);

  const mutate = useCallback(
    async (payload: T): Promise<R> => {
      return control.makeQuery(() => mutationRef.current(payload));
    },
    [control, mutationRef],
  );

  return useMemo<UseMutationReturn<T, R>>(() => {
    return {
      ...state,
      mutate,
    };
  }, [state, mutate]);
}
