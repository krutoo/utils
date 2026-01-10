/* eslint-disable no-console */
import type { RspackPluginFunction } from '@rspack/core';
import { type ChildProcess, spawn } from 'node:child_process';

export interface PluginExecOptions {
  /**
   * Script to run, for example `node hello.js`.
   */
  script: string;

  /**
   * Need compilation to wait for script ended or not.
   */
  blocking?: boolean;

  /**
   * Condition to run script depends on mode.
   * Pass `watch` to run script only in watch mode or `build` to run not in watch mode.
   */
  when?: 'always' | 'build' | 'watch';
}

/**
 * Plugin that runs given shell script on `afterEmit` event.
 * @param options Options.
 * @returns Plugin.
 */
export function pluginExec({
  script,
  blocking = true,
  when = 'always',
}: PluginExecOptions): RspackPluginFunction {
  const pluginName = 'pluginExec';

  return compiler => {
    if (when === 'watch' && !compiler.options.watch) {
      return;
    }

    if (when === 'build' && compiler.options.watch) {
      return;
    }

    let childProcess: ChildProcess | null = null;

    compiler.hooks.watchRun.tap(pluginName, () => {
      if (childProcess) {
        childProcess.kill();
        childProcess = null;
        console.log(`[${pluginName}] Previous process killed`);
      }
    });

    compiler.hooks.afterEmit.tapPromise({ name: pluginName }, async compilation => {
      if (compilation.errors.length > 0) {
        console.log(`[${pluginName}] Skip because of compilation errors`);
        return;
      }

      const promise = new Promise<void>((done, fail) => {
        childProcess = spawn(script, {
          shell: true,
          stdio: 'inherit',
        });

        childProcess.on('spawn', () => {
          console.log(`[${pluginName}] Child process started, pid: ${childProcess?.pid}`);
        });

        childProcess.on('error', error => {
          fail(error);
        });

        childProcess.on('close', (code, signal) => {
          if (code === 0 || signal === 'SIGTERM') {
            done();
          } else {
            fail(new Error(`[${pluginName}] Child process closed, code ${code}`));
          }
        });

        process.on('exit', () => {
          childProcess?.kill();
          childProcess = null;
        });
      });

      if (blocking) {
        await promise;
      }
    });
  };
}
