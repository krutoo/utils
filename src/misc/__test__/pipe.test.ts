import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { pipe } from '../pipe.ts';

describe('pipe', () => {
  test('should work correctly for zero functions', () => {
    const flow = pipe();
    const result: void = flow();

    expect(result).toBe(undefined);
  });

  test('should work correctly for single function', () => {
    const flow = pipe(() => 123);
    const result: number = flow();

    expect(result).toBe(123);
  });

  test('should work correctly for two functions', () => {
    const flow = pipe(
      //
      (a: number, b: number) => a + b,
      (value: number) => value * 2,
    );

    expect(flow(2, 3)).toBe(10);
  });

  test('should work correctly for two functions', () => {
    const flow = pipe(
      //
      (a: number, b: number) => a + b,
      (value: number) => value * 2,
      (value: number) => `value is ${value}`,
    );

    const cases: Array<{ input: [number, number]; output: string }> = [
      {
        input: [1, 1],
        output: 'value is 4',
      },
      {
        input: [2, 3],
        output: 'value is 10',
      },
      {
        input: [3, 4],
        output: 'value is 14',
      },
    ];

    for (const { input, output } of cases) {
      const result: string = flow(...input);

      expect(result).toBe(output);
    }
  });
});
