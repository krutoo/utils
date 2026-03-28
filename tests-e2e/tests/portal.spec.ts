import { expect, test } from '@playwright/test';

test('Portal', async ({ page }) => {
  await page.goto('/sandbox.html?path=/portal/primary');

  const button = page.getByRole('button', { name: 'Toggle' });

  expect(await button.count()).toBe(1);
  expect(await page.locator('body > *').count()).toBe(1);

  await button.click();

  expect(await page.locator('body > *').count()).toBe(2);
  expect(await page.locator('body > *').last().textContent()).toContain('Hello from Portal!');

  await button.click();
  expect(await page.locator('body > *').count()).toBe(1);
});
