/**
 * This script will affect tests runtime to simulate browser environment.
 * It should be imported before any tests.
 */
import { before, after, afterEach } from 'node:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

before(async context => {
  if (!context.filePath?.match(/\.node\.test\.(ts|tsx)$/)) {
    GlobalRegistrator.register();
  }
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
