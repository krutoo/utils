import { selectors } from '@playwright/test';

export default async function globalSetup() {
  selectors.setTestIdAttribute('data-marker');
}
