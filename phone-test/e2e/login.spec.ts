import { test, expect } from '@playwright/test';

const username = 'Yusuf';
const password = 'hello'

test('should login and render the call details page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  // Fill credentials
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill(username);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(password);
  // login
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('http://localhost:3000/calls');
  // check if header contains username
  await expect(page.getByText(`Welcome ${username}!`)).toBeVisible();
});


