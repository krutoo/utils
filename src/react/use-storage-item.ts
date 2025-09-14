import { useCallback, useMemo, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useLatestRef } from './use-latest-ref.ts';

/** Storage item processor for parse/stringify value from storage automatically. */
export interface StorageValueProcessor<T> {
  /** Receives item from storage and should return what you want to receive from hook as value. */
  parse: (item: string | null) => T;

  /** Receives value and should return string for passing it as item to storage. */
  stringify: (item: T) => string;
}

/** Options of `useStorageItem` hook.  */
export interface UseStorageItemOptions<T> {
  /** Storage. Usually localStorage or sessionStorage. */
  storage: Storage | (() => Storage);

  /** Item value processor. */
  processor: StorageValueProcessor<T>;

  /** Default value. */
  defaultValue?: string | null;
}

/** Return value type of `useStorageItem` hook. */
export type UseStorageItemReturn<T> = [T, (value: T | null) => void];

/** Processor for using value from storage as is. */
const identityProcessor: StorageValueProcessor<string | null> = {
  parse: value => value,
  stringify: value => String(value),
};

/**
 * Hook for working with storage item.
 * You need to provide key and storage for getting actual value from storage.
 *
 * By default result value is raw value from storage.
 * You can provide processor for parse/stringify value automatically.
 *
 * @param key Storage item key.
 * @param options Options.
 * @returns Tuple like `[state, setState]`.
 */
export function useStorageItem(
  key: string,
  options: {
    storage: Storage | (() => Storage);
    processor?: StorageValueProcessor<string | null>;
    defaultValue?: string | null;
  },
): UseStorageItemReturn<string | null>;

/**
 * Hook for working with storage item.
 *
 * You need to provide key and storage for getting actual value from storage.
 *
 * By default result value is raw value from storage.
 *
 * You can provide processor for parse/stringify value automatically.
 *
 * @param key Storage item key.
 * @param options Options.
 * @returns Tuple like `[state, setState]`.
 */
export function useStorageItem<T>(
  key: string,
  options: UseStorageItemOptions<T>,
): UseStorageItemReturn<T>;

/**
 * Hook for working with storage item.
 *
 * You need to provide key and storage for getting actual value from storage.
 *
 * By default result value is raw value from storage.
 *
 * You can provide processor for parse/stringify value automatically.
 *
 * @param key Storage item key.
 * @param options Options.
 * @returns Tuple like `[state, setState]`.
 */
export function useStorageItem<T>(
  key: string,
  {
    storage,
    processor = identityProcessor as unknown as StorageValueProcessor<T>,
    defaultValue = null,
  }: {
    storage: Storage | (() => Storage);
    processor?: StorageValueProcessor<T>;
    defaultValue?: string | null;
  },
): UseStorageItemReturn<T> {
  const [state, setState] = useState<string | null>(defaultValue);

  const getStorage = useCallback(() => {
    return typeof storage === 'function' ? storage() : storage;
  }, [storage]);

  const processorRef = useLatestRef(processor);

  const value = useMemo(() => {
    return processorRef.current.parse(state);
  }, [state, processorRef]);

  const updateState = useCallback(
    (newValue: string | null) => {
      setState(newValue);

      if (newValue === null) {
        getStorage().removeItem(key);
        return;
      }

      const exist = getStorage().getItem(key);

      if (exist !== newValue) {
        getStorage().setItem(key, newValue);
      }
    },
    [key, getStorage],
  );

  const setValue = useCallback(
    (newValue: T | null): void => {
      if (newValue === null) {
        updateState(null);
        return;
      }

      updateState(processorRef.current.stringify(newValue));
    },
    [updateState, processorRef],
  );

  // when key or storage changes we need to update state
  useIsomorphicLayoutEffect(() => {
    setState(getStorage().getItem(key));
  }, [key, getStorage]);

  return [value, setValue];
}

/**
 * Returns JSON value processor for using in `useStorageItem` options.
 * @param placeholder Placeholder. Will be used when storage item is empty or when JSON.parse is failed.
 * @returns Processor.
 */
export function getJsonProcessor<T>(placeholder: T): StorageValueProcessor<T> {
  return {
    parse: value => {
      if (value === null) {
        return placeholder;
      }

      try {
        return JSON.parse(value);
      } catch {
        return placeholder;
      }
    },
    stringify: value => JSON.stringify(value),
  };
}
