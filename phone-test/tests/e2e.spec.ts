import { test, expect } from '@playwright/test';

test.describe('Login and View Call Details', () => {
  test('should log in and view call details', async ({ page }) => {
    // Visit the login page
    await page.goto('http://localhost:3000/login');

    // Fill in the login form
    await page.fill('[data-testid="email"]', 'test@aircall.io');
    await page.fill('[data-testid="password"]', 'password');

    // Intercept the login request to check the response
    await page.route('https://frontend-test-api.aircall.dev/graphql', route => {
      route.continue();
    });

    // Click the login button
    await page.click('[data-testid="submit"]');

    // Wait for the login request to complete
    await page.waitForResponse(
      response =>
        response.url() === 'https://frontend-test-api.aircall.dev/graphql' &&
        response.status() === 200
    );

    // Verify that tokens are stored in local storage
    const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();

    // Confirm the URL includes /calls after login
    await expect(page).toHaveURL(/\/calls/);

    // Verify that the calls list is displayed
    await expect(page.locator('text=Calls History')).toBeVisible();

    // Click on a call to view details
    await page.click('[data-testid="call-details"]');

    // Verify call details are displayed
    await expect(page.locator('text=Type:')).toBeVisible();
    await expect(page.locator('text=Created at:')).toBeVisible();
    await expect(page.locator('text=Duration:')).toBeVisible();
  });
});
