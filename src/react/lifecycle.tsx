import { type JSX, type ReactNode, useEffect } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useStableCallback } from './use-stable-callback.ts';
import { noop } from '../misc/noop.ts';

export interface LifecycleProps {
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
 * @param props Props.
 * @returns JSX Element.
 */
export function Lifecycle({
  children,
  onMount = noop,
  onUnmount = noop,
  onMountSync = noop,
  onUnmountSync = noop,
}: LifecycleProps): JSX.Element {
  const onMountStable = useStableCallback(onMount);
  const onUnmountStable = useStableCallback(onUnmount);

  const onMountSyncStable = useStableCallback(onMountSync);
  const onUnmountSyncStable = useStableCallback(onUnmountSync);

  useIsomorphicLayoutEffect(() => {
    onMountSyncStable();

    return () => {
      onUnmountSyncStable();
    };
  }, [onMountSyncStable, onUnmountSyncStable]);

  useEffect(() => {
    onMountStable();

    return () => {
      onUnmountStable();
    };
  }, [onMountStable, onUnmountStable]);

  return <>{children}</>;
}
