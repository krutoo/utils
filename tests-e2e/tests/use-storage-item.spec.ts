import { test, expect } from '@playwright/test';

const targetText = 'Fill value and then reload page to see that value is saved';

test.describe('useStorageItem', () => {
  test('should works with localStorage', async ({ page }) => {
    await page.goto('/sandbox.html?path=/use-storage-item/primary');

    const message = page.locator('p');
    const input = page.getByTestId('input');
    expect(await message.textContent()).toBe(targetText);
    expect(await input.inputValue()).toBe('');

    await input.focus();
    await input.fill('Foo, Bar!');
    expect(await input.inputValue()).toBe('Foo, Bar!');

    await page.reload();
    expect(await input.inputValue()).toBe('Foo, Bar!');
  });
});
