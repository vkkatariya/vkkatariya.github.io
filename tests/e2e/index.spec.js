// @ts-check
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const STAY = '/index.html#stay'; // #stay: show the splash without redirecting

test.describe('index.html splash (design system)', () => {
  test('shows the logo (as the way in), the wordmark, the role line and a four-hue progress bar', async ({ page }) => {
    await page.goto(STAY);
    await expect(page.locator('h1')).toHaveAttribute('aria-label', 'Vishal Katariya');
    await expect(page.locator('.mark img')).toHaveAttribute('src', 'prototypes/assets/logo-192.webp');
    await expect(page.locator('#enter')).toHaveAttribute('href', '/prototypes/portfolio-combined');
    await expect(page.locator('.role')).toHaveText('ML · Infra · Full-stack');
    expect(await page.locator('.bar i').evaluate(e => getComputedStyle(e).backgroundImage.match(/rgb\(/g).length)).toBe(4);
  });

  test('stays minimal: small file, no destination chips, no CTA, one font request', async () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html.length).toBeLessThan(10000);
    expect(html).not.toMatch(/class="dest"|class="np"|class="tag"/);
    expect(html.match(/fonts\.googleapis\.com\/css2/g)).toHaveLength(1);
  });

  test('uses the design-system fonts and tokens', async ({ page }) => {
    await page.goto(STAY);
    expect(await page.locator('h1').evaluate(e => getComputedStyle(e).fontFamily)).toContain('Syne');
    expect(await page.locator('.role').evaluate(e => getComputedStyle(e).fontFamily)).toContain('JetBrains Mono');
    expect(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor)).toBe('rgb(27, 28, 29)'); // --bg
  });

  test('follows the site theme switch (vk-theme = light)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('vk-theme', 'light'));
    await page.goto(STAY);
    expect(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor)).toBe('rgb(236, 236, 236)'); // light --bg
  });

  test('plays the intro, then redirects to the portfolio', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(250);
    expect(page.url()).toContain('/index.html'); // still on the splash while it animates
    await page.waitForURL(/\/prototypes\/portfolio-combined/, { timeout: 6000 });
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
  });

  test('the intro is short: the page leaves within ~1.2s of its own navigation start', async ({ page }) => {
    // measured inside the page (performance.now() at pagehide), so a slow runner or server does not skew it
    await page.addInitScript(() => {
      if (!location.pathname.endsWith('index.html')) return;
      addEventListener('pagehide', () => localStorage.setItem('vk-left-at', String(performance.now())));
    });
    await page.goto('/index.html');
    await page.waitForURL(/\/prototypes\/portfolio-combined/, { timeout: 8000 });
    const leftAt = Number(await page.evaluate(() => localStorage.getItem('vk-left-at')));
    expect(leftAt).toBeGreaterThan(500); // it did play
    expect(leftAt).toBeLessThan(1200);
  });

  test('a repeat visit in the same tab session skips the intro', async ({ page }) => {
    await page.addInitScript(() => {
      if (!location.pathname.endsWith('index.html')) return;
      addEventListener('pagehide', () => localStorage.setItem('vk-left-at', String(performance.now())));
    });
    await page.goto('/index.html');
    await page.waitForURL(/\/prototypes\/portfolio-combined/, { timeout: 8000 });
    await page.goto('/index.html');
    await page.waitForURL(/\/prototypes\/portfolio-combined/, { timeout: 8000 });
    expect(Number(await page.evaluate(() => localStorage.getItem('vk-left-at')))).toBeLessThan(300); // the second visit left at once
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

  test('tapping the logo enters the portfolio immediately', async ({ page }) => {
    await page.goto(STAY);
    await page.locator('#enter').click();
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
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
