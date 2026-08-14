import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { createContainer } from '../container.ts';
import { createToken } from '../token.ts';

interface Logger {
  info(message: string): void;
}

interface Calculator {
  sum(a: number, b: number): number;
}

interface HttpClient {
  request(method: string, resource: string): Promise<{ status: number }>;
}

describe('Container', () => {
  test('basic behavior', () => {
    const TOKEN = {
      version: createToken<string>('version'),
      logger: createToken<Logger>('logger'),
    };

    const spy = mock.fn();
    const container = createContainer();

    container.set(TOKEN.version, () => {
      return '1.2.3';
    });

    container.set(TOKEN.logger, resolve => {
      const ver = resolve(TOKEN.version);

      return {
        info(message) {
          spy(`app@${ver}: ${message}`);
        },
      };
    });

    // component resolving
    const logger = container.get(TOKEN.logger);
    expect(spy.mock.callCount()).toBe(0);
    logger.info('test');
    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments[0]).toBe('app@1.2.3: test');

    // component caching
    const logger2 = container.get(TOKEN.logger);
    expect(Object.is(logger, logger2)).toBe(true);
  });

  test('should throw error about non found component', () => {
    const TOKEN = {
      logger: createToken<Logger>('logger'),
    };

    const container = createContainer();

    expect(() => container.get(TOKEN.logger)).toThrow(
      new Error('Provider for Token(logger) not found'),
    );
  });

  test('should throw error about already registered component', () => {
    const TOKEN = {
      logger: createToken<Logger>('logger'),
    };

    const container = createContainer();

    container.set(TOKEN.logger, () => {
      return {
        info() {},
      };
    });

    expect(() => {
      container.set(TOKEN.logger, () => {
        return {
          info() {},
        };
      });
    }).toThrow(new Error('Already registered Token(logger)'));
  });

  test('should throw error about cycle dependency', () => {
    const TOKEN = {
      logger: createToken<Logger>('logger'),
      calculator: createToken<Calculator>('calculator'),
    };

    const container = createContainer();

    container.set(TOKEN.logger, resolve => {
      const calculator = resolve(TOKEN.calculator);

      return {
        info(message) {
          // eslint-disable-next-line no-console
          console.log(`msg: ${message}, sum: ${calculator.sum(1, 2)}`);
        },
      };
    });

    container.set(TOKEN.calculator, resolve => {
      const logger = resolve(TOKEN.logger);

      return {
        sum(a, b) {
          logger.info('performing sum...');
          return a + b;
        },
      };
    });

    expect(() => container.get(TOKEN.logger)).toThrow(
      new Error('Cycle dependency found: Token(logger), Token(calculator), Token(logger)'),
    );
  });

  test('should not throw circular dep error when dep used in two components', () => {
    const TOKEN = {
      main: createToken<VoidFunction>('main'),
      logger: createToken<Logger>('logger'),
      http: {
        client: createToken<HttpClient>('httpClient'),
      },
    };

    const container = createContainer();

    container.set(TOKEN.main, resolve => {
      const logger = resolve(TOKEN.logger);
      const client = resolve(TOKEN.http.client);

      return () => {
        logger.info('App started');
        client.request('POST', '/api/analytics?event=app_start');
      };
    });

    container.set(TOKEN.http.client, resolve => {
      const logger = resolve(TOKEN.logger);

      return {
        request() {
          const status = 201;

          logger.info(`incoming request done, status: ${status}`);

          return Promise.resolve({ status });
        },
      };
    });

    container.set(TOKEN.logger, () => {
      return {
        info(message) {
          // eslint-disable-next-line no-console
          console.log(`msg: ${message}`);
        },
      };
    });

    expect(() => container.get(TOKEN.main)).not.toThrow();
  });
});
