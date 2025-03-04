import { test, expect } from '@playwright/test';

test('getPositionedParentOffset', async ({ page }) => {
  await page.goto('/sandbox.html?path=/get-positioned-parent-offset/primary');

  await expect(page.locator('h1')).toHaveText('getPositionedParentOffset');

  expect(await page.getByTestId('target').count()).toBe(6);

  await expect(page.locator('[name=enabled]')).not.toBeChecked();

  await page.check('[name=enabled]');
  await expect(page.locator('[name=enabled]')).toBeChecked();

  const mousePos = { x: 400, y: 100 };
  await page.mouse.move(mousePos.x, mousePos.y);

  for (const item of await page.getByTestId('target').all()) {
    const box = await item.boundingBox();
    expect(box?.x).toBe(mousePos.x - 80);
    expect(box?.y).toBe(mousePos.y - 60);
  }

  mousePos.x = 500;
  mousePos.y = 120;
  await page.mouse.move(mousePos.x, mousePos.y);

  for (const item of await page.getByTestId('target').all()) {
    const box = await item.boundingBox();
    expect(box?.x).toBe(mousePos.x - 80);
    expect(box?.y).toBe(mousePos.y - 60);
  }

  // @todo check targets positions after page scroll
});
