import { expect, test } from '@playwright/test';

test('ErrorBoundary', async ({ page }) => {
  await page.goto('/sandbox.html?path=/error-boundary/primary');

  expect(await page.textContent('body')).toContain('I am fine 👍');

  await page.getByRole('button', { name: 'Broke it!' }).click();

  expect(await page.textContent('body')).not.toContain('I am fine 👍');
  expect(await page.textContent('body')).toContain('Oops, something broke =(');
});
