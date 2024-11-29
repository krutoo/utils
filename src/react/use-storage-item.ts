// @deno-types="npm:@types/react@18"
import { useCallback, useMemo, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useIdentityRef } from './use-identity-ref.ts';

export interface StorageValueProcessor<T> {
  /** Receives item from storage and should return what you want to receive from hook as value. */
  prepare?: (item: string | null) => T;

  /** Receives value and should return string for passing it as item to storage. */
  stringify?: (item: T) => string;
}

export interface UseStorageItemOptions<T> extends StorageValueProcessor<T> {
  /** Storage. Usually localStorage or sessionStorage. */
  storage?: Storage;
}

export type UseStorageItemResult<T> = [T, (value: T | null) => void];

export function useStorageItem(key: string): UseStorageItemResult<string | null>;

export function useStorageItem<T>(
  key: string,
  options: UseStorageItemOptions<T>,
): UseStorageItemResult<T>;

/**
 * Hook of state of storage item.
 * By default localStorage is used.
 * @param key Storage item key.
 * @param options Options.
 * @returns Tuple like `[state, setState]`.
 * @example By default state type is `string | null`.
 * ```tsx
 * import { useStorageItem } from "@krutoo/utils/react";
 *
 * function App ({ count }: { count: number }) {
 *   const [value, setValue] = useStorageItem('someValue');
 *
 *   return <div>Value is {value}</div>;
 * }
 * ```
 *
 * @example But you can configure processor.
 * ```tsx
 * import { useStorageItem } from "@krutoo/utils/react";
 *
 * function App ({ count }: { count: number }) {
 *   // first we use generic for bind type of value
 *   const [value, setValue] = useStorageItem<string>('value', {
 *     // we also need to provide a prepare function
 *     prepare: item => item ?? '',
 *   });
 *
 *   return <input value={value} />;
 * }
 * ```
 *
 * @example For JSON you can use special utility.
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
 *     // `getJsonProcessor` first argument is placeholder for cases when
 *     // value in storage is null or JSON.parse is failed
 *     ...getJsonProcessor({ value: '...' }),
 *   });
 *
 *   return <div>Value is {data.value}</div>;
 * }
 * ```
 */
export function useStorageItem<T>(
  key: string,
  {
    storage = localStorage,
    prepare = (item) => item as T,
    stringify = (value) => String(value),
  }: UseStorageItemOptions<T> = {},
): UseStorageItemResult<T> {
  const [state, setState] = useState<string | null>(null);

  const prepareRef = useIdentityRef(prepare);
  const stringifyRef = useIdentityRef(stringify);

  const value = useMemo(() => {
    return prepareRef.current(state);
  }, [state, prepareRef]);

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
export function getJsonProcessor<T>(
  placeholder: T,
): StorageValueProcessor<T> {
  return {
    prepare: (value) => {
      if (value === null) {
        return placeholder;
      }

      try {
        return JSON.parse(value);
      } catch {
        return placeholder;
      }
    },
    stringify: (value) => JSON.stringify(value),
  };
}
