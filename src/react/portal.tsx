import { type JSX, type ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useLatestRef } from './use-latest-ref.ts';

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

  // IMPORTANT: this props is used through latest refs because
  // its changing between renders should not provide rerunning effect
  const containerInitRef = useLatestRef(containerInit);
  const connectInitRef = useLatestRef(connectInit);
  const cleanupInitRef = useLatestRef(cleanupInit);

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
  }, [
    // stable:
    cleanupInitRef,
    connectInitRef,
    containerInitRef,
  ]);

  // @todo идея для SSR:
  // контекст с fallback-функцией которая вызывается если !container и принимает ReactNode
  // в SSR накапливание ReactNode и отдельный render куда надо
  if (container) {
    return createPortal(children, container, portalKey);
  }

  return null;
}
