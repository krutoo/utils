/**
 * This script will affect tests runtime to simulate browser environment.
 * It should be imported before any tests.
 * Files like `{name}.web.test.{ext}` will be run with browser environment simulation.
 */
import { before, after, afterEach } from 'node:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

before(async context => {
  if (!context.filePath?.match(/\.web\.test\.(ts|tsx)$/)) {
    return;
  }

  GlobalRegistrator.register();

  // dynamic import because https://github.com/capricorn86/happy-dom/issues/1636#issuecomment-2568308938
  const { configure } = await import('@testing-library/react');

  configure({ testIdAttribute: 'data-marker' });
});

after(async () => {
  if (GlobalRegistrator.isRegistered) {
    await GlobalRegistrator.unregister();
  }
});

afterEach(async () => {
  // dynamic import because https://github.com/capricorn86/happy-dom/issues/1636#issuecomment-2568308938
  const { cleanup } = await import('@testing-library/react');

  cleanup();
});
