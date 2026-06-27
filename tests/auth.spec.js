import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should log in successfully with valid credentials and then log out', async ({ page }) => {
    // 1. Navigate to the Login Page
    await page.goto('/login');

    // 2. Perform Login directly with page locators
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    // 3. Verify landing page header and success message
    await expect(page.locator('h2')).toHaveText('Secure Area');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');

    // 4. Log out directly and verify success redirection
    await page.locator('a.button.secondary.radius').click();
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  });

  test('should display an error message with invalid credentials', async ({ page }) => {
    // 1. Navigate to the Login Page
    await page.goto('/login');

    // 2. Attempt Login with invalid credentials
    await page.locator('#username').fill('invalid_user');
    await page.locator('#password').fill('invalid_password');
    await page.locator('button[type="submit"]').click();

    // 3. Verify failure error message
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
  });
});
