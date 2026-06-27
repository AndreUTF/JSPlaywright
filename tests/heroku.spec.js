import { test, expect } from '@playwright/test';

test.describe('Heroku Homepage E2E Validation', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Block the OneTrust cookie consent script. It can re-render a dark
    // overlay over the page well after the banner is accepted/removed,
    // intercepting unrelated clicks; blocking it avoids that flakiness.
    await page.route(/otSDKStub|otBannerSdk|oneTrust_production/i, (route) => route.abort());

    // 2. Navigate to the Heroku homepage
    await page.goto('https://www.heroku.com/');
  });

  test('should load page and verify hero elements', async ({ page }) => {
    // 1. Verify Page Title
    const title = await page.title();
    expect(title).toBe('Heroku | The Cloud Application Platform For Developers');

    // 2. Verify key interactive links are visible
    await expect(page.locator('#logged-out-login')).toBeVisible();
    await expect(page.locator('#logged-out-signup')).toBeVisible();
    await expect(page.locator('a.mega-menu-link', { hasText: 'Pricing' })).toBeVisible();
  });

  test('should navigate to the pricing page successfully', async ({ page }) => {
    // 1. Click on Pricing link
    await page.locator('a.mega-menu-link', { hasText: 'Pricing' }).click();

    // 2. Assert URL has changed to the pricing page
    await expect(page).toHaveURL(/.*heroku\.com\/pricing/);
  });

  test('should redirect to the registration page on Sign Up click', async ({ page }) => {
    // 1. Click Sign Up button
    await page.locator('#logged-out-signup').click();

    // 2. Assert registration page URL
    await expect(page).toHaveURL(/.*signup\.heroku\.com/);
  });

  test('should redirect to the login page on Login click', async ({ page }) => {
    // 1. Click Login button
    await page.locator('#logged-out-login').click();

    // 2. Assert login page URL and title
    await expect(page).toHaveURL(/.*id\.heroku\.com\/login/);
    await expect(page).toHaveTitle('Heroku | Login');
  });

  test('should return to the homepage when the logo is clicked', async ({ page }) => {
    // 1. Navigate away from the homepage
    await page.locator('a.mega-menu-link', { hasText: 'Pricing' }).click();
    await expect(page).toHaveURL(/.*heroku\.com\/pricing/);

    // 2. Click the Heroku logo
    await page.locator('a[href="https://www.heroku.com"]').click();

    // 3. Assert we are back on the homepage
    await expect(page).toHaveURL('https://www.heroku.com/');
  });

  test('should open and close the site search overlay', async ({ page }) => {
    // 1. Open the search popup
    await page.getByRole('button', { name: 'Search Open Search Popup' }).click();

    // 2. Assert the search input is visible
    const searchInput = page.getByRole('textbox', { name: 'Search For:' });
    await expect(searchInput).toBeVisible();

    // 3. Close the search popup
    await page.getByRole('button', { name: 'Close Search Form Overlay' }).click();

    // 4. Assert the search input is no longer visible
    await expect(searchInput).not.toBeVisible();
  });

  test('should display footer links to Help Center and Status page', async ({ page }) => {
    // 1. Verify Help Center link
    const helpCenterLink = page.locator('footer a', { hasText: 'Help Center' });
    await expect(helpCenterLink).toBeVisible();
    await expect(helpCenterLink).toHaveAttribute('href', 'https://help.heroku.com/');

    // 2. Verify Status link
    const statusLink = page.locator('footer a', { hasText: 'Status' });
    await expect(statusLink).toBeVisible();
    await expect(statusLink).toHaveAttribute('href', 'https://status.salesforce.com/products/Heroku');
  });
});
