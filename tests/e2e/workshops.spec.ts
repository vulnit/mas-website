import { test, expect } from '@playwright/test';

test('should navigate from MASTG to a workshop with working references and images', async ({ page }) => {
  await page.goto('/MASTG/');
  const content = page.locator('.md-content');
  const workshopsButton = content.getByRole('link', { name: 'Workshops', exact: true });
  await expect(workshopsButton.locator('svg')).toBeVisible();
  await workshopsButton.click();
  await expect(page).toHaveURL(/\/MASTG\/workshops\/#?$/);
  await expect(page.getByRole('heading', { name: 'Workshops', exact: true })).toBeVisible();

  const workshop = page.getByRole('row').filter({ hasText: 'MASTG-WORKSHOP-0001' });
  const title = 'Mobile Application Resilience for Beginners';
  await expect(workshop).toContainText(title);
  const search = content.getByRole('textbox');
  await search.pressSequentially('nonexistent workshop');
  await expect(workshop).toBeHidden();
  await search.fill('');
  await search.pressSequentially('resilience');
  await expect(workshop).toBeVisible();
  await workshop.getByRole('link', { name: title }).click();

  await expect(page).toHaveURL(/\/MASTG\/workshops\/MASTG-WORKSHOP-0001\/MASTG-WORKSHOP-0001\/$/);
  await expect(content.getByRole('heading', { level: 1 })).toContainText(title);
  await expect(content.locator('a[href$="/MASTG-TEST-0325"]').first()).toBeVisible();
  await expect(page.locator('.md-sidebar--primary').getByRole('link', { name: 'Workshops', exact: true })).toBeVisible();

  const images = content.locator('img');
  expect(await images.count()).toBeGreaterThan(0);
  await expect.poll(() => images.evaluateAll(elements =>
    elements.every(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)
  )).toBe(true);
});
