import { useEffect } from 'react';
import { useLatestRef } from '@krutoo/utils/react';

export function useKeydown(
  callback: (event: KeyboardEvent) => void,
  { key }: { key?: string } = {},
) {
  const keyRef = useLatestRef(key);
  const callbackRef = useLatestRef(callback);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (typeof keyRef.current !== 'string' || event.key === keyRef.current) {
        callbackRef.current(event);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [keyRef, callbackRef]);
}
