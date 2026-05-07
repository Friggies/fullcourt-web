import { test, expect } from '@playwright/test';

test('login page links navigate to forgot-password and sign-up pages', async ({
  page,
}) => {
  await page.goto('/auth/login');
  await expect(
    page.locator('div').filter({ hasText: /^Login$/ })
  ).toBeVisible();

  const forgotPasswordLink = page.getByRole('link', {
    name: 'Forgot your password?',
  });

  await expect(forgotPasswordLink).toBeVisible();
  await expect(forgotPasswordLink).toHaveAttribute(
    'href',
    '/auth/forgot-password'
  );

  await forgotPasswordLink.click();

  await expect(page).toHaveURL(/\/auth\/forgot-password$/);
  await expect(
    page.getByText('Reset Your Password', { exact: true })
  ).toBeVisible();

  await page.goto('/auth/login');

  const signUpLink = page.getByRole('link', { name: 'Sign up' });

  await expect(signUpLink).toBeVisible();
  await expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');

  await signUpLink.click();

  await expect(page).toHaveURL(/\/auth\/sign-up$/);
  await expect(
    page.locator('div').filter({ hasText: /^Sign up$/ })
  ).toBeVisible();
});
