import { test, expect } from '@playwright/test';

test('login page links navigate to forgot-password and sign-up pages', async ({
  page,
}) => {
  await page.goto('/auth/login');
  await expect(
    page.locator('div').filter({ hasText: /^Login$/ })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Forgot your password?' }).click();
  await expect(page).toHaveURL('\/auth\/forgot-password');
  await expect(
    page.getByText('Reset Your Password', { exact: true })
  ).toBeVisible();

  await page.goto('/auth/login');

  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveURL('\/auth\/sign-up');
  await expect(
    page.locator('div').filter({ hasText: /^Sign up$/ })
  ).toBeVisible();
});
