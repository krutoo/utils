import type { RspackPluginFunction } from '@rspack/core';
import { exec } from 'node:child_process';

export interface PluginExecOptions {
  /** Script to run, for example `node hello.js`. */
  script: string;

  /** Need to wait for script ended or not. */
  blocking?: boolean;
}

/**
 * Plugin that runs given shell script on `afterEmit` event.
 * @param options Options.
 * @returns Plugin.
 */
export function pluginExec({ script, blocking = true }: PluginExecOptions): RspackPluginFunction {
  const pluginName = 'krutoo:pluginExec';

  return compiler => {
    compiler.hooks.afterEmit.tapPromise({ name: pluginName }, async compilation => {
      if (compilation.errors.length > 0) {
        return;
      }

      const promise = new Promise<void>((done, fail) => {
        // @todo logger trough option, console by default
        exec(script, error => {
          if (error) {
            fail(error);
          } else {
            done();
          }
        });
      });

      if (blocking) {
        await promise;
      }
    });
  };
}
