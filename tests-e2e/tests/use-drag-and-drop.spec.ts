import { expect, test } from '@playwright/test';

test('useDragAndDrop', async ({ page }) => {
  await page.goto('/sandbox.html?path=/use-drag-and-drop/primary');

  const draggable = page.getByTestId('draggable');

  const start = { x: 16, y: 16 };
  const grab = { x: 20, y: 20 };
  const shift = { x: 80, y: 120 };

  expect(await draggable.count()).toBe(1);
  expect(await draggable.boundingBox()).toHaveProperty('x', start.x);
  expect(await draggable.boundingBox()).toHaveProperty('y', start.y);

  await page.mouse.move(grab.x, grab.y);
  await page.mouse.down();
  await page.mouse.move(grab.x + shift.x, grab.y + shift.y);
  await page.mouse.up();

  expect(await draggable.boundingBox()).toHaveProperty('x', start.x + shift.x);
  expect(await draggable.boundingBox()).toHaveProperty('y', start.y + shift.y);

  await page.mouse.move(0, 0);

  expect(await draggable.boundingBox()).toHaveProperty('x', start.x + shift.x);
  expect(await draggable.boundingBox()).toHaveProperty('y', start.y + shift.y);
});
