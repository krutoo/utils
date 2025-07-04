import { useMemo, useState } from 'react';
import { TimerPool } from '../misc/timer-pool.ts';
import { useIdentityRef } from './use-identity-ref.ts';
import { zeroDeps } from './constants.ts';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

/** Transition status. */
export type TransitionStatus =
  | 'pre-opening'
  | 'opening'
  | 'open'
  | 'pre-closing'
  | 'closing'
  | 'closed';

/** Options for useTransitionStatus. */
export interface UseTransitionStatusOptions {
  /** Current state. */
  open: boolean;

  /** Should be opened by default. Affects initial transition. */
  defaultOpen?: boolean;

  /** Duration in milliseconds. */
  duration?: number | { opening: number; closing: number };
}

/**
 * Creates new empty timer pool.
 * @returns Timer pool.
 */
function createTimerPool() {
  return new TimerPool();
}

/**
 * Hook for split boolean state to transitions.
 * Useful for creating animated reveal/hide some content.
 * @param options Options.
 * @returns Transition status.
 */
export function useTransitionStatus({
  open,
  defaultOpen = open,
  duration,
}: UseTransitionStatusOptions): TransitionStatus {
  const [status, setStatus] = useState<TransitionStatus>(() => (defaultOpen ? 'open' : 'closed'));
  const statusRef = useIdentityRef(status);
  const durationRef = useIdentityRef(duration);
  const timers = useMemo(createTimerPool, zeroDeps);

  useIsomorphicLayoutEffect(() => {
    const actualStatus = statusRef.current;

    if (open && actualStatus !== 'open') {
      timers.clearAll();
      setStatus('pre-opening');
    }

    if (!open && actualStatus !== 'closed') {
      timers.clearAll();
      setStatus('pre-closing');
    }
  }, [
    open,

    // stable
    timers,
    statusRef,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (status === 'pre-opening') {
      timers.requestAnimationFrame(() => setStatus('opening'));
    }

    if (status === 'opening') {
      const openingDuration =
        typeof durationRef.current === 'number'
          ? durationRef.current
          : durationRef.current?.opening;

      timers.setTimeout(() => setStatus('open'), openingDuration);
    }

    if (status === 'pre-closing') {
      timers.requestAnimationFrame(() => setStatus('closing'));
    }

    if (status === 'closing') {
      const closingDuration =
        typeof durationRef.current === 'number'
          ? durationRef.current
          : durationRef.current?.closing;

      timers.setTimeout(() => setStatus('closed'), closingDuration);
    }
  }, [
    status,

    // stable
    timers,
    durationRef,
  ]);

  useIsomorphicLayoutEffect(() => {
    // clear timers on unmount to prevent errors:
    // "Can't perform a React state update on an unmounted component"
    return () => {
      timers.clearAll();
    };
  }, [timers]);

  return status;
}
