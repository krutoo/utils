import { useMemo, useState } from 'react';
import { useLatestRef } from '../use-latest-ref.ts';
import type {
  QueryState,
  QueryDoneEvent,
  QueryFailedEvent,
  UseMutationOptions,
  UseMutationReturn,
} from './types.ts';
import { useQueryInstance } from './use-query-instance.ts';
import { generateId } from './utils.ts';
import { useStableCallback } from '../use-stable-callback.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';

/**
 * Mutation hook. Mutation is changing (create/update/delete) something in data source.
 * This is a minimalistic analogue of `useMutation` from `@tanstack/react-query`.
 * @param options Mutation options.
 * @returns Mutation.
 */
export function useMutation<P, R = unknown>({
  key: keyProp,
  mutation: mutationProp,
  onSuccess,
  onError,
}: UseMutationOptions<P, R>): UseMutationReturn<P, R> {
  const key = useMemo(() => keyProp ?? generateId('mutation:'), [keyProp]);
  const instance = useQueryInstance<R>(key);
  const [state, setState] = useState<QueryState<R>>(() => instance.getState());

  const mutation = useStableCallback(mutationProp);
  const onSuccessRef = useLatestRef(onSuccess);
  const onErrorRef = useLatestRef(onError);

  useIsomorphicLayoutEffect(() => {
    const onDone = (event: QueryDoneEvent<R>) => {
      setState(instance.getState());
      onSuccessRef.current?.(event.detail.data);
    };

    const onFailed = (event: QueryFailedEvent) => {
      setState(instance.getState());
      onErrorRef.current?.(event.detail.error);
    };

    const onChanged = () => {
      setState(instance.getState());
    };

    setState(instance.getState());

    instance.events.addEventListener('done', onDone);
    instance.events.addEventListener('failed', onFailed);
    instance.events.addEventListener('changed', onChanged);

    return () => {
      instance.events.removeEventListener('done', onDone);
      instance.events.removeEventListener('failed', onFailed);
      instance.events.removeEventListener('changed', onChanged);
    };
  }, [
    instance,

    // stable:
    onSuccessRef,
    onErrorRef,
  ]);

  const mutate = useStableCallback(async (payload: P): Promise<R> => {
    return await instance.execute(() => mutation(payload));
  });

  return useMemo<UseMutationReturn<P, R>>(() => {
    return {
      ...state,
      mutate,
    };
  }, [state, mutate]);
}
