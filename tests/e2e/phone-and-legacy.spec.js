// @ts-check
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

const SPA = '/prototypes/portfolio-combined.html';

test.describe('phone search button', () => {
  test('floating search button opens the dialog on phones and is hidden on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto(SPA);
    await expect(page.locator('#sxFab')).toBeVisible();
    await page.locator('#sxFab').click();
    await expect(page.locator('#sxOv')).toBeVisible();
    await expect(page.locator('#sxQ')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#sxFab')).toBeFocused();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('#sxFab')).toBeHidden();
  });

  test('it clears the roadmap bottom bar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(page.locator('#roadmap-internal-nav')).toHaveClass(/nav-visible/);
    const fab = await page.locator('#sxFab').boundingBox();
    const bar = await page.locator('#roadmap-internal-nav').boundingBox();
    expect(fab.y + fab.height).toBeLessThanOrEqual(bar.y);
  });
});

test.describe('home all-projects footer tags', () => {
  test('follow their card hue instead of a separate palette', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    const pairs = await page.locator('#pg-home .pcard').evaluateAll(cs => cs.map(c => {
      const hue = getComputedStyle(c.querySelector('.pcard-title svg [stroke]')).stroke;
      return [getComputedStyle(c.querySelector('.pfoot-type')).color, hue];
    }));
    expect(pairs).toHaveLength(3);
    for (const [tag, hue] of pairs) expect(tag).toBe(hue);
  });
});

test.describe('legacy standalone prototypes', () => {
  test('no page still advertises availability', () => {
    const files = readdirSync('prototypes').filter(f => f.endsWith('.html'));
    for (const f of files) {
      const html = readFileSync(`prototypes/${f}`, 'utf8');
      expect(html, f).not.toMatch(/open to work|available for internships|offen für praktikum/i);
    }
  });

  test('the unused @vercel/speed-insights npm dependency is gone (Vercel serves the script itself)', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies ?? {}).not.toHaveProperty('@vercel/speed-insights');
  });
});
