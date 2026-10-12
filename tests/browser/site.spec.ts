import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/places/neba/', '/places/neba/sights/', '/places/neba/activities/', '/places/neba/food/', '/places/neba/stay/', '/places/neba/shopping/', '/places/neba/events/', '/places/neba/products/', '/places/neba/access/', '/about/', '/credits/']) {
  test(`${path} renders accessibly without overflow or broken local links`, async ({ page, request }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('href')!))]);
    for (const link of links) {
      const url = new URL(link, 'http://127.0.0.1:4321');
      expect((await request.get(url.pathname)).status(), link).toBe(200);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-${path === '/' ? 'home' : path.split('/').filter(Boolean).join('-')}.png`, fullPage: true });
  });
}

test('main destination journey, in-page navigation and credits work', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero-photo').getByRole('link', { name: /Photo:/ }).click();
  await expect(page).toHaveURL(/\/credits\/#river$/);
  await page.goto('/');
  await page.getByRole('link', { name: 'Discover Neba' }).click();
  await expect(page).toHaveURL(/\/places\/neba\/$/);
  await page.getByRole('link', { name: 'THE GREAT CEDAR' }).click();
  await expect(page).toHaveURL(/#great-cedar$/);
  await page.locator('#great-cedar').getByRole('link', { name: /Photo:/ }).click();
  await expect(page).toHaveURL(/\/credits\/#cedar$/);
  await expect(page.locator('#cedar')).toBeInViewport();
  await page.goto('/places/neba/');
  await page.getByRole('link', { name: 'VILLAGE GUIDE' }).click();
  await expect(page).toHaveURL(/#guide$/);
  await expect(page.getByRole('heading', { name: 'Where to eat' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where to stay' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where to shop' })).toBeVisible();
  await page.getByRole('link', { name: 'Open this guide' }).first().click();
  await expect(page).toHaveURL(/\/places\/neba\/sights\/$/);
  await expect(page.getByRole('heading', { name: 'What to see' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Neba visitor guide' }).getByRole('link', { name: 'Local products' }).click();
  await expect(page).toHaveURL(/\/places\/neba\/products\/$/);
  await expect(page.getByText('Where to find it').first()).toBeVisible();
  await page.goto('/places/neba/activities/');
  await expect(page.getByRole('link', { name: '+81 265-49-2580' })).toHaveAttribute('href', 'tel:+81265492580');
  await expect(page.getByText('Late April to early November')).toBeVisible();
});

test('mobile menu supports navigation and Escape; desktop has visible navigation', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') {
    const menu = page.locator('.mobile-nav');
    await menu.locator('summary').click();
    await expect(menu).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open');
    await menu.locator('summary').click();
    await menu.getByRole('link', { name: 'Explore places' }).click();
    await expect(page).toHaveURL(/#places$/);
    await expect(menu).not.toHaveAttribute('open');
    await menu.locator('summary').click();
    await menu.getByRole('link', { name: 'Our story' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  } else {
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Our story' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  }
});

test('narrow screens and missing pages remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const path of ['/', '/places/neba/', '/places/neba/sights/', '/places/neba/activities/', '/places/neba/food/', '/places/neba/stay/', '/places/neba/shopping/', '/places/neba/events/', '/places/neba/products/', '/places/neba/access/', '/about/', '/credits/']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
  }
  expect((await page.goto('/missing-place/'))?.status()).toBe(404);
  await page.getByRole('link', { name: 'Back to RURAL JAPAN', exact: false }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
});
