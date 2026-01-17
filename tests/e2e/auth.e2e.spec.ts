import { test, expect } from '@playwright/test';

test('user can login and logout', async ({ page }) => {
  await page.goto('/auth/login');

  await page.fill('input[type="email"]', 'matejrolko2@gmail.com');
  await page.fill('input[type="password"]', 'Matej1234');

  await page.click('button:has-text("Login")');

  await page.waitForURL('/profile');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Logout')).toBeVisible();

  await page.click('button:has-text("Logout")');
  await page.waitForURL('/auth/login');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
