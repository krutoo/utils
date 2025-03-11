import { type JSX, type ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useIdentityRef } from './use-identity-ref.ts';

/**
 * Portal props.
 */
export interface PortalProps {
  /**
   * Container element. By default new `div` will be created.
   * Can be function that returns element or null.
   */
  container?: HTMLElement | (() => HTMLElement | null);

  /**
   * How container will be connected to document.
   * By default `document.appendChild(container)` will be called if container is not connected yet.
   * When false passed, nothing will be done.
   */
  connect?: boolean | ((container: HTMLElement) => void);

  /**
   * Component unmount handler.
   * When `true` passed, container will be removed from DOM by `container.remove()`.
   * When `false` passed, nothing will be done.
   * By default acts like for `true` if `container` prop is not passed, and like `false` otherwise.
   */
  cleanup?: boolean | ((container: HTMLElement) => void);

  /**
   * Portal key.
   */
  portalKey?: string;

  /**
   * Content that will be rendered into `container` element.
   */
  children?: ReactNode;
}

const DEFAULTS = {
  container() {
    return document.createElement('div');
  },

  connect(container: HTMLElement) {
    if (!container.isConnected) {
      document.body.append(container);
    }
  },

  cleanup(container: HTMLElement) {
    container.remove();
  },
};

/**
 * Declarative portal component.
 * @param props Props.
 * @returns JSX.Element or null.
 */
export function Portal({
  children,
  container: containerInit = DEFAULTS.container,
  connect: connectInit,
  cleanup: cleanupInit,
  portalKey,
}: PortalProps): JSX.Element | null {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // IMPORTANT: need to get container from identity ref and actualize this ref only when deps is changed
  const containerInitRef = useIdentityRef(containerInit);

  // IMPORTANT: need to get cleanup from identity ref and actualize this ref only when deps is changed
  const connectInitRef = useIdentityRef(connectInit);

  // IMPORTANT: need to get cleanup from identity ref and actualize this ref each render
  const cleanupInitRef = useIdentityRef(cleanupInit);

  useIsomorphicLayoutEffect(() => {
    const newContainerInit = containerInitRef.current;

    let newContainer: HTMLElement | null;

    if (typeof newContainerInit === 'function') {
      newContainer = newContainerInit();
    } else {
      newContainer = newContainerInit;
    }

    if (!newContainer) {
      return;
    }

    let connect = connectInitRef.current;

    switch (connect) {
      case undefined: {
        connect = DEFAULTS.connect;
        break;
      }
      case true: {
        connect = DEFAULTS.connect;
        break;
      }
      case false: {
        connect = undefined;
        break;
      }
    }

    connect?.(newContainer);

    setContainer(newContainer);

    let cleanup = cleanupInitRef.current;

    switch (cleanup) {
      case undefined: {
        if (newContainerInit === DEFAULTS.container) {
          cleanup = DEFAULTS.cleanup;
        } else {
          cleanup = undefined;
        }
        break;
      }
      case true: {
        cleanup = DEFAULTS.cleanup;
        break;
      }
      case false: {
        cleanup = undefined;
        break;
      }
    }

    return () => {
      cleanup?.(newContainer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (container) {
    return createPortal(children, container, portalKey);
  }

  return null;
}
