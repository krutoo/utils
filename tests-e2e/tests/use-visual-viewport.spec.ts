import { test, expect } from '@playwright/test';

test('useVisualViewport', async ({ page }) => {
  await page.goto('/sandbox.html?path=/use-visual-viewport/primary');

  const viewport = page.viewportSize();
  const target = page.locator('#viewport');

  await expect(target).toContainText('Viewport size:');
  await expect(target).toContainText(`${viewport?.width}px x ${viewport?.height}px`);

  await page.setViewportSize({ width: 800, height: 600 });
  await expect(target).toContainText('800px x 600px');

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(target).toContainText('1024px x 768px');
});
