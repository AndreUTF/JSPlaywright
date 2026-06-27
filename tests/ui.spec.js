import { test, expect } from '@playwright/test';

test.describe('Additional Interactive UI Elements', () => {
  test('should handle checking and unchecking boxes correctly', async ({ page }) => {
    // 1. Navigate to checkboxes page
    await page.goto('/checkboxes');

    const checkbox1 = page.locator('form#checkboxes input').nth(0);
    const checkbox2 = page.locator('form#checkboxes input').nth(1);

    // 2. Initial state verification (usually checkbox 1 is unchecked and checkbox 2 is checked)
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();

    // 3. Toggle states
    await checkbox1.check();
    await checkbox2.uncheck();

    // 4. Verify post-toggle states
    await expect(checkbox1).toBeChecked();
    await expect(checkbox2).not.toBeChecked();
  });

  test('should select options from a dropdown successfully', async ({ page }) => {
    // 1. Navigate to dropdown page
    await page.goto('/dropdown');

    const dropdown = page.locator('#dropdown');

    // 2. Select Option 1
    await dropdown.selectOption({ value: '1' });
    // Use selectOption followed by checking element value or text
    await expect(dropdown).toHaveValue('1');
    
    // Evaluate selected option text
    const selectedText1 = await dropdown.evaluate(el => el.options[el.selectedIndex].text);
    expect(selectedText1).toBe('Option 1');

    // 3. Select Option 2
    await dropdown.selectOption({ value: '2' });
    await expect(dropdown).toHaveValue('2');
    
    const selectedText2 = await dropdown.evaluate(el => el.options[el.selectedIndex].text);
    expect(selectedText2).toBe('Option 2');
  });
});
