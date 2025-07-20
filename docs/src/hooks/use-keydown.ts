import { useEffect } from 'react';
import { useIdentityRef } from '@krutoo/utils/react';

export function useKeydown(
  callback: (event: KeyboardEvent) => void,
  { key }: { key?: string } = {},
) {
  const keyRef = useIdentityRef(key);
  const callbackRef = useIdentityRef(callback);

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
