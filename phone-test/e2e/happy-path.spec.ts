/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test('happy path', async ({ page }) => {
  await page.goto('/');

  const form = page.locator('form');

  await expect(form).toBeAttached();

  await form.getByLabel('Email').fill('username');
  await form.getByLabel('Password').fill('password');

  await page.keyboard.press('Enter');
  await page.waitForURL('/calls');
  await expect(page.getByText('Calls History')).toBeAttached();

  const call = page.locator('ul > li:last-child > header + ul > li:first-child');

  await expect(call).toBeVisible();

  await call.click();
  await page.waitForURL(new RegExp('/calls/[\\w-]+'));
  await expect(page.getByText('Calls Details')).toBeAttached();

  const logout = page.getByText('logout');
  await logout.click();
  await page.waitForURL('/login');
  await page.screenshot();
});
