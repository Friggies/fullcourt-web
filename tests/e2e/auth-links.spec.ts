import { test, expect } from '@playwright/test';

test('login page forgot password link navigates to forgot-password page', async ({
  page,
}) => {
  await page.goto('/auth/login');

  await expect(
    page.locator('div').filter({ hasText: /^Login$/ })
  ).toBeVisible();

  const forgotPasswordLink = page.getByRole('link', {
    name: /^forgot your password\?$/i,
  });

  await expect(forgotPasswordLink).toBeVisible();
  await expect(forgotPasswordLink).toHaveAttribute(
    'href',
    '/auth/forgot-password'
  );

  await Promise.all([
    page.waitForURL(/\/auth\/forgot-password$/),
    forgotPasswordLink.click(),
  ]);

  await expect(
    page.getByText('Reset Your Password', { exact: true })
  ).toBeVisible();
});

test('login page sign up link navigates to sign-up page', async ({ page }) => {
  await page.goto('/auth/login');

  await expect(
    page.locator('div').filter({ hasText: /^Login$/ })
  ).toBeVisible();

  const signUpLink = page.getByRole('link', { name: /^sign up$/i });

  await expect(signUpLink).toBeVisible();
  await expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');

  await Promise.all([page.waitForURL(/\/auth\/sign-up$/), signUpLink.click()]);

  await expect(
    page.locator('div').filter({ hasText: /^Sign up$/ })
  ).toBeVisible();
});
