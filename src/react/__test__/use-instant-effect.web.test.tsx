import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import { useMemo } from 'react';
import { render } from '@testing-library/react';
import { useInstantEffect } from '../use-instant-effect.ts';

const implementations = [
  {
    name: 'useInstantEffect',
    hook: useInstantEffect,
  },
  {
    name: 'useMemo',
    hook: useMemo,
  },
];

const logger = {
  messages: [] as string[],
  info(message: string) {
    this.messages.push(message);
  },
  flush() {
    this.messages.length = 0;
  },
};

beforeEach(() => {
  logger.flush();
});

describe('useInstantEffect', () => {
  for (const { name, hook } of implementations) {
    const label = name.padStart(16);

    test(`${label}: should run mount effect immediately`, () => {
      function TestComponent() {
        logger.info('before hook');

        hook(() => {
          logger.info('instant effect');
        }, []);

        logger.info('after hook');

        return <div>Hello, world!</div>;
      }

      assert.strictEqual(logger.messages.length, 0);

      const { rerender } = render(<TestComponent />);

      assert.strictEqual(logger.messages.length, 3);
      assert.deepStrictEqual(logger.messages, [
        // 1
        'before hook',
        'instant effect',
        'after hook',
      ]);

      rerender(<TestComponent />);

      assert.equal(logger.messages.length, 5);
      assert.deepStrictEqual(logger.messages, [
        // 1
        'before hook',
        'instant effect',
        'after hook',

        // 2
        'before hook',
        'after hook',
      ]);
    });

    test(`${label}: should run regular effect immediately`, () => {
      function TestComponent({ seed }: { seed: string }) {
        logger.info('before hook');

        useInstantEffect(() => {
          logger.info(`instant effect ${seed}`);
        }, [seed]);

        logger.info('after hook');

        return <div>Hello, world!</div>;
      }

      assert.strictEqual(logger.messages.length, 0);

      const { rerender } = render(<TestComponent seed='123' />);

      assert.strictEqual(logger.messages.length, 3);
      assert.deepStrictEqual(logger.messages, [
        // 1
        'before hook',
        'instant effect 123',
        'after hook',
      ]);

      rerender(<TestComponent seed='123' />);

      assert.equal(logger.messages.length, 5);
      assert.deepStrictEqual(logger.messages, [
        // 1
        'before hook',
        'instant effect 123',
        'after hook',

        // 2
        'before hook',
        'after hook',
      ]);

      rerender(<TestComponent seed='234' />);

      assert.equal(logger.messages.length, 8);
      assert.deepStrictEqual(logger.messages, [
        // 1
        'before hook',
        'instant effect 123',
        'after hook',

        // 2
        'before hook',
        'after hook',

        // 3
        'before hook',
        'instant effect 234',
        'after hook',
      ]);
    });
  }
});
