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

  test('on the roadmap the nav is in the topbar, so the search button stays at the normal bottom position', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(page.locator('#roadmap-internal-nav')).toHaveClass(/nav-visible/);
    const fab = await page.locator('#sxFab').boundingBox();
    expect(fab.y + fab.height).toBeGreaterThanOrEqual(780 - 40); // not lifted above a bottom bar
    expect(await page.locator('#progress-widget').evaluate(e => getComputedStyle(e).bottom)).toBe('16px');
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
    const files = ['prototypes', 'prototypes/resume'].flatMap(d => readdirSync(d).filter(f => f.endsWith('.html')).map(f => `${d}/${f}`));
    expect(files.length).toBeGreaterThanOrEqual(8); // the SPA + the seven resume pages
    for (const f of files) {
      const html = readFileSync(f, 'utf8');
      expect(html, f).not.toMatch(/open to work|available for internships|offen für praktikum/i);
    }
  });

  test('the moved resume pages load their images, favicons and manifest from ../assets', async ({ page }) => {
    const failed = [];
    page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${new URL(r.url()).pathname}`); });
    for (const f of readdirSync('prototypes/resume').filter(f => f.endsWith('.html'))) {
      await page.goto(`/prototypes/resume/${f}`);
      await expect.poll(() => page.locator('img[src$="assets/image.png"]').first().evaluate(i => i.complete && i.naturalWidth), { message: f }).toBeGreaterThan(0);
    }
    expect(failed).toEqual([]);
  });

  test('the unused @vercel/speed-insights npm dependency is gone (Vercel serves the script itself)', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies ?? {}).not.toHaveProperty('@vercel/speed-insights');
  });
});

test.describe('release review fixes', () => {
  test('removed and moved pages are redirected, not 404', () => {
    const src = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects.map(r => r.source);
    for (const s of ['about', 'projects', 'cs-roadmap', 'portfolio-v4', 'resume-v1', 'resume-v2', 'resume-v3', 'resume-v2-dark', 'resume-v3-dark']) expect(src).toContain(`/prototypes/${s}`);
  });

  test('the resume pages use an absolute og:image (scrapers do not resolve relative paths)', () => {
    for (const f of readdirSync('prototypes/resume').filter(f => f.endsWith('.html'))) {
      expect(readFileSync(`prototypes/resume/${f}`, 'utf8'), f).toMatch(/og:image" content="https:\/\/vishal-katariya\.com\//);
    }
  });

  test('the splash fallback refresh lives in <noscript>, so /#stay is not cut short', async ({ page }) => {
    expect(readFileSync('index.html', 'utf8')).toMatch(/<noscript><meta http-equiv="refresh"/);
    await page.goto('/index.html#stay');
    await page.waitForTimeout(2600);
    expect(page.url()).toContain('/index.html');
  });
});
