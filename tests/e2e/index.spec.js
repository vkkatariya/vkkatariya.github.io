// @ts-check
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const STAY = '/index.html#stay'; // #stay: show the splash without redirecting

test.describe('index.html splash (design system)', () => {
  test('shows the wordmark, logo, four hued destinations and the CTA', async ({ page }) => {
    await page.goto(STAY);
    await expect(page.locator('h1')).toHaveAttribute('aria-label', 'Vishal Katariya');
    await expect(page.locator('.mark img')).toHaveAttribute('src', 'prototypes/assets/logo-192.webp');
    const links = page.locator('.dest a');
    await expect(links).toHaveCount(4);
    await expect(links).toHaveText(['home', 'projects', 'roadmap', 'about']);
    const hues = await links.evaluateAll(as => as.map(a => getComputedStyle(a.querySelector('svg')).color));
    expect(new Set(hues).size).toBe(4); // blue / teal / indigo / purple
    await expect(page.locator('#enter')).toHaveAttribute('href', '/prototypes/portfolio-combined');
  });

  test('uses the design-system fonts and tokens', async ({ page }) => {
    await page.goto(STAY);
    expect(await page.locator('h1').evaluate(e => getComputedStyle(e).fontFamily)).toContain('Syne');
    expect(await page.locator('.tag').evaluate(e => getComputedStyle(e).fontFamily)).toContain('Outfit');
    expect(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor)).toBe('rgb(27, 28, 29)'); // --bg
  });

  test('follows the site theme switch (vk-theme = light)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('vk-theme', 'light'));
    await page.goto(STAY);
    expect(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor)).toBe('rgb(236, 236, 236)'); // light --bg
  });

  test('plays the intro, then redirects to the portfolio', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(600);
    expect(page.url()).toContain('/index.html'); // still on the splash while it animates
    await page.waitForURL(/\/prototypes\/portfolio-combined/, { timeout: 6000 });
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
  });

  test('reduced motion: finished screen, quick redirect', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/index.html');
    const t0 = Date.now();
    await page.waitForURL(/\/prototypes\/portfolio-combined/, { timeout: 4000 });
    expect(Date.now() - t0).toBeLessThan(1500);
    await ctx.close();
  });

  test('section hashes are forwarded (/#projects lands on Projects)', async ({ page }) => {
    await page.goto('/index.html#projects');
    await page.waitForURL(/portfolio-combined.*#projects/, { timeout: 6000 });
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
  });

  test('the CTA and a destination chip navigate immediately', async ({ page }) => {
    await page.goto(STAY);
    await page.locator('.dest a', { hasText: 'roadmap' }).click();
    await expect(page.locator('#pg-roadmap')).toHaveClass(/active/);
  });

  test('fits a 320px phone without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(STAY);
    await page.waitForTimeout(1800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });

  test('social meta uses absolute image URLs', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toMatch(/og:image" content="https:\/\/vishal-katariya\.com\/prototypes\/assets\/og-image\.png"/);
    expect(html).toMatch(/twitter:image" content="https:\/\/vishal-katariya\.com\//);
  });
});
