import { test, expect } from '@playwright/test';

test('drills page renders filters UI and shows premium upsell when not premium', async ({
  page,
}) => {
  await page.goto('/drills');

  await expect(page.getByText('All Drills & Plays')).toBeVisible();

  await expect(page.getByPlaceholder('Search...')).toBeVisible();

  await page.getByRole('button', { name: 'Filters' }).click();
  await expect(page.locator('#filters-panel')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Clear filters' })
  ).toBeVisible();

  const upsell = page.getByRole('link', { name: 'Become a premium member' });
  await expect(upsell).toBeVisible();

  await upsell.click();
  await expect(page).toHaveURL('\/pricing');
});
