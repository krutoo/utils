import { useCallback, useMemo, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useIdentityRef } from './use-identity-ref.ts';

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
  storage: Storage;

  /** Item value processor. */
  processor: StorageValueProcessor<T>;
}

/** Return value type of `useStorageItem` hook. */
export type UseStorageItemReturn<T> = [T, (value: T | null) => void];

const identityProcessor: StorageValueProcessor<string | null> = {
  parse: value => value,
  stringify: value => String(value),
};

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
 *
 * @example By default state type is `string | null`.
 * ```tsx
 * import { useStorageItem } from "@krutoo/utils/react";
 *
 * function App ({ count }: { count: number }) {
 *   const [value, setValue] = useStorageItem('someValue', {
 *     storage: localStorage,
 *   });
 *
 *   return <div>Value is {value}</div>;
 * }
 * ```
 *
 * @example You can provide processor for parse raw string from storage and stringify your data for storing.
 * ```tsx
 * import { useStorageItem } from "@krutoo/utils/react";
 *
 * function App ({ count }: { count: number }) {
 *   const [age, setAge] = useStorageItem<number>('age', {
 *     storage: sessionStorage,
 *     processor: {
 *       parse: Number,
 *       stringify: String,
 *     },
 *   });
 *
 *   return <input value={value} />;
 * }
 * ```
 *
 * @example If you want to get/set JSON, you can use special utility `getJsonProcessor`.
 * ```tsx
 * import { useStorageItem, getJsonProcessor } from "@krutoo/utils/react";
 *
 * interface MyData {
 *   value: string
 * }
 *
 * function App ({ count }: { count: number }) {
 *   // first we use generic for bind type of value
 *   const [data, setData] = useStorageItem<MyData>('value', {
 *     storage: localStorage,
 *
 *     // `getJsonProcessor` first argument is placeholder for cases when
 *     // value in storage is null or JSON.parse is failed
 *     processor: getJsonProcessor({ value: '...' }),
 *   });
 *
 *   return <div>Value is {data.value}</div>;
 * }
 * ```
 */
export function useStorageItem(
  key: string,
  options: {
    storage: Storage;
    processor?: StorageValueProcessor<string | null>;
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
  }: {
    storage: Storage;
    processor?: StorageValueProcessor<T>;
  },
): UseStorageItemReturn<T> {
  const [state, setState] = useState<string | null>(null);

  const parseRef = useIdentityRef(processor.parse);
  const stringifyRef = useIdentityRef(processor.stringify);

  const value = useMemo(() => {
    return parseRef.current(state);
  }, [state, parseRef]);

  const setValue = useCallback(
    (value: T | null): void => {
      if (value === null) {
        setState(null);
        return;
      }

      setState(stringifyRef.current(value));
    },
    [stringifyRef],
  );

  // when key or storage changes we need to update state
  useIsomorphicLayoutEffect(() => {
    setState(storage.getItem(key));
  }, [key, storage]);

  // when state changes we need to set it to storage
  useIsomorphicLayoutEffect(() => {
    const exist = storage.getItem(key);

    if (state === null) {
      storage.removeItem(key);
      return;
    }

    if (exist !== state) {
      storage.setItem(key, state);
    }
  }, [key, storage, state]);

  return [value, setValue];
}

/**
 * Returns JSON value processor for using in `useStorageItem` options.
 * @param placeholder Placeholder. Will be used when storage item is empty or when JSON.parse is failed.
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
