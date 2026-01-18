import { type JSX, type ReactNode, useEffect } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useLatestRef } from './use-latest-ref.ts';

export interface LifecycleProps {
  /** Content. */
  children?: ReactNode;

  /** Will be called after component mounted. */
  onMount?: VoidFunction;

  /** Will be called after component unmounted. */
  onUnmount?: VoidFunction;

  /** Will be called synchronously after component mounted. */
  onMountSync?: VoidFunction;

  /** Will be called synchronously after component unmounted. */
  onUnmountSync?: VoidFunction;
}

/**
 * Component for working with lifecycle trough event callbacks.
 * Allows to handle mount/unmount events.
 * @param props Props.
 * @returns JSX Element.
 */
export function Lifecycle(props: LifecycleProps): JSX.Element {
  const { children } = props;

  // because it is "event callbacks", we should call actual functions (from last render),
  // so we will use props trough ref in effects
  const propsRef = useLatestRef(props);

  useIsomorphicLayoutEffect(() => {
    propsRef.current.onMountSync?.();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      propsRef.current.onUnmountSync?.();
    };
  }, [propsRef]);

  useEffect(() => {
    propsRef.current.onMount?.();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      propsRef.current.onUnmount?.();
    };
  }, [propsRef]);

  return <>{children}</>;
}
