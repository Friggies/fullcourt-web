import { test, expect } from '@playwright/test';

test('drills page renders filters UI and shows premium upsell when not premium', async ({
  page,
}) => {
  await page.goto('/drills');

  await expect(
    page.getByRole('heading', { name: 'All Drills & Plays' })
  ).toBeVisible();

  await expect(page.getByPlaceholder('Search...')).toBeVisible();

  const filtersButton = page.getByRole('button', { name: /^filters$/i });
  await expect(filtersButton).toBeVisible();
  await expect(filtersButton).toBeEnabled();

  await filtersButton.click();

  const filtersPanel = page.locator('#filters-panel');
  await expect(filtersPanel).toBeVisible();

  await expect(
    page.getByRole('button', { name: /^clear filters$/i })
  ).toBeVisible();

  const upsell = page.getByRole('link', { name: /^upgrade to premium$/i });
  await expect(upsell).toBeVisible();
  await expect(upsell).toHaveAttribute('href', '/pricing');

  await upsell.click();

  await expect(page).toHaveURL(/\/pricing$/);
});
