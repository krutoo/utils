/**
 * This script will affect tests runtime to simulate browser environment.
 * It should be imported before any tests.
 */
import 'global-jsdom/register';
import { afterEach } from 'node:test';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
