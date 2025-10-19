import { describe, mock, test } from 'node:test';
import { createContainer } from '../container.ts';
import { createToken } from '../token.ts';
import { expect } from '@std/expect';

interface Logger {
  info(message: string): void;
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

    const logger = container.get(TOKEN.logger);

    expect(spy.mock.callCount()).toBe(0);
    logger.info('test');
    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments[0]).toBe('app@1.2.3: test');
  });
});
