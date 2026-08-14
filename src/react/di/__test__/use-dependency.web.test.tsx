import { type Mock, describe, mock, test } from 'node:test';
import { useEffect } from 'react';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { createContainer } from '../../../di/container.ts';
import { createToken } from '../../../di/token.ts';
import { ContainerProvider } from '../container-provider.tsx';
import { useDependency } from '../use-dependency.ts';

interface Logger {
  info(message: string): void;
}

const TOKEN = {
  logger: createToken<Logger>('logger'),
} as const;

describe('useDependency', () => {
  const TestComponent = () => {
    const logger = useDependency(TOKEN.logger);

    useEffect(() => {
      logger.info('Component mounted');
    }, [logger]);

    return <div>This is of useDependency</div>;
  };

  test('should return component from container', () => {
    const container = createContainer();

    container.set(TOKEN.logger, () => {
      return {
        info: mock.fn(),
      };
    });

    const logger = container.get(TOKEN.logger);

    expect((logger.info as Mock<Logger['info']>).mock.callCount()).toBe(0);

    render(
      <ContainerProvider container={container}>
        <TestComponent />
      </ContainerProvider>,
    );

    expect((logger.info as Mock<Logger['info']>).mock.callCount()).toBe(1);
  });

  test('should throw if component is not defined', () => {
    const container = createContainer();

    const mount = () => {
      render(
        <ContainerProvider container={container}>
          <TestComponent />
        </ContainerProvider>,
      );
    };

    expect(mount).toThrow();
  });

  test('should throw if container is not provided', () => {
    const mount = () => {
      render(<TestComponent />);
    };

    expect(mount).toThrow();
  });
});
