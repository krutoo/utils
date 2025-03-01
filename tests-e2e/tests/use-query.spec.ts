import { test, expect } from '@playwright/test';

test('useQuery', async ({ page }) => {
  await page.goto('/sandbox.html?path=/use-query/primary');

  await expect(page.locator('h1')).toHaveText('Example: useQuery');

  await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refresh' })).not.toBeDisabled();

  await expect(page.locator('pre')).toContainText('John');
  await expect(page.locator('pre')).toContainText('23');
  await expect(page.locator('pre')).toContainText('male');
});
