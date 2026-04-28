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

test('free users can only access free drills', async ({ page }) => {
  await page.goto('/drills/13');
  await expect(page).toHaveURL(/\/drills\/13$/);
  await expect(
    page.getByRole('heading', { name: '2-3 X-Screen to Rim 2' })
  ).toBeVisible();

  await page.goto('/drills/21');
  await expect(page).toHaveURL(/\/drills\/21$/);
  await expect(
    page.getByRole('heading', { name: 'We can not find this play' })
  ).toBeVisible();
});

test('drill 13 page shows comments and logged-in comment controls', async ({
  page,
}) => {
  await page.goto('/drills/13');

  await expect(page).toHaveURL(/\/drills\/13$/);

  await expect(
    page.getByRole('heading', { level: 1, name: '2-3 X-Screen to Rim 2' })
  ).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible();

  await expect(page.getByText('This drill is straight fire')).toBeVisible();

  // Logged-out users should see auth actions.
  await expect(
    page.getByRole('link', { name: /login/i }).first()
  ).toBeVisible();

  await expect(
    page.getByRole('link', { name: /get started/i }).first()
  ).toBeVisible();

  // Log in.
  await page.goto('/auth/login');

  await page.fill('input[type="email"]', userEmail);
  await page.fill('input[type="password"]', userPassword);

  await page.click('button:has-text("Login")');

  await page.waitForURL('/profile');
  await page.waitForLoadState('networkidle');

  // Return to the drill page as the logged-in user.
  await page.goto('/drills/13');
  await expect(page).toHaveURL(/\/drills\/13$/);

  await expect(
    page.getByRole('heading', { level: 1, name: '2-3 X-Screen to Rim 2' })
  ).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible();

  await expect(page.getByText('This drill is straight fire')).toBeVisible();

  await expect(
    page.getByText('You have already commented on this page.')
  ).toBeVisible();

  await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
});

test('authenticated user can comment, react with funny, and delete comment on blog 1', async ({
  page,
}) => {
  await page.goto('/auth/login');

  await page.fill('input[type="email"]', userEmail);
  await page.fill('input[type="password"]', userPassword);

  await Promise.all([
    page.waitForURL('/profile'),
    page.click('button:has-text("Login")'),
  ]);

  await page.goto('/blog/1');

  await expect(page).toHaveURL(/\/blog\/1$/);

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Basketball Positions and Numbering Explained',
    })
  ).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible();

  // If the user already has a comment on this page, remove it first.
  if (
    await page
      .getByText('You have already commented on this page.')
      .isVisible({ timeout: 1000 })
      .catch(() => false)
  ) {
    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(
      page.getByText('You have already commented on this page.')
    ).toHaveCount(0, { timeout: 15_000 });
  }

  const textarea = page.getByRole('textbox', { name: /add a comment/i });

  await expect(textarea).toBeVisible();

  await textarea.fill('This is a dummy comment');

  // Make Turnstile pass the client-side FormData check in e2e.
  await textarea.evaluate(element => {
    const form = element.closest('form');

    if (!form) {
      throw new Error('Could not find comment form.');
    }

    let input = form.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]'
    );

    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'cf-turnstile-response';
      form.appendChild(input);
    }

    input.value = 'XXXX.TEST.TOKEN.XXXX';
  });

  const postButton = page.getByRole('button', { name: 'Post comment' });

  await expect(postButton).toBeEnabled();

  await postButton.click();

  const ownComment = page.locator('article').filter({
    has: page.getByText('This is a dummy comment', { exact: true }),
  });

  await expect(ownComment).toBeVisible({ timeout: 15_000 });

  await expect(
    ownComment.getByRole('button', { name: 'Delete' })
  ).toBeVisible();

  await ownComment.locator('button[title="Funny"]').click();

  await expect(
    ownComment.locator('button[title="Funny"][aria-pressed="true"]')
  ).toBeVisible({ timeout: 15_000 });

  page.once('dialog', async dialog => {
    await dialog.accept();
  });

  await ownComment.getByRole('button', { name: 'Delete' }).click();

  await expect(ownComment).toHaveCount(0, { timeout: 15_000 });
});
