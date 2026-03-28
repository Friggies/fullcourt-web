import { test, expect } from '@playwright/test';

const userEmail = process.env.TEST_USER_EMAIL!;
const userPassword = process.env.TEST_USER_PASSWORD!;

test('user can login and logout', async ({ page }) => {
  await page.goto('/auth/login');

  await page.fill('input[type="email"]', userEmail);
  await page.fill('input[type="password"]', userPassword);

  await page.click('button:has-text("Login")');

  await page.waitForURL('/profile');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Logout')).toBeVisible();

  await page.click('button:has-text("Logout")');
  await page.waitForURL('/auth/login');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
