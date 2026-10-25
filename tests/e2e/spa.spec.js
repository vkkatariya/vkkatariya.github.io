// @ts-check
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const SPA = '/prototypes/portfolio-combined.html';

// ─── SPA Navigation ──────────────────────────────────────────────────────────

test.describe('SPA navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
  });

  test('home page is active by default', async ({ page }) => {
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
  });

  test('nav link shows projects page', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#projects"]').click();
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
    await expect(page.locator('#pg-home')).not.toHaveClass(/active/);
  });

  test('nav link shows roadmap page', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await expect(page.locator('#pg-roadmap')).toHaveClass(/active/);
  });

  test('nav link shows about page', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#about"]').click();
    await expect(page.locator('#pg-about')).toHaveClass(/active/);
  });

  test('hash routing navigates to correct page on initial load', async ({ page }) => {
    await page.goto(SPA + '#projects');
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
    await expect(page.locator('#pg-home')).not.toHaveClass(/active/);
  });

  test('unknown hash falls back to home page', async ({ page }) => {
    await page.goto(SPA + '#nonexistent');
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
  });

  test('roadmap page reveals roadmap nav and hides shared nav', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await expect(page.locator('#shared-nav')).toHaveClass(/nav-hidden/);
    await expect(page.locator('#roadmap-internal-nav')).toHaveClass(/nav-visible/);
  });

  test('navigating away from roadmap restores shared nav', async ({ page }) => {
    // Reset to home first (test #44 may have left us on roadmap with nav-links hidden)
    await page.evaluate(() => window.showPage('home'));
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
    // Use showPage directly — once on roadmap the nav links are visibility:hidden
    // and Playwright clicks on hidden links timeout inconsistently (test flake root cause)
    await page.evaluate(() => window.showPage('roadmap'));
    await expect(page.locator('#shared-nav')).toHaveClass(/nav-hidden/);
    // nav-links are visibility:hidden while roadmap is active; call showPage directly
    await page.evaluate(() => window.showPage('home'));
    // Wait for the page transition to complete (pg-home gets .active + page-visible)
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
    await expect(page.locator('#shared-nav')).not.toHaveClass(/nav-hidden/);
  });
});

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

test.describe('theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
  });

  test('dark theme is active by default', async ({ page }) => {
    await expect(page.locator('html')).not.toHaveClass(/light/);
  });

  test('clicking theme button switches to light mode', async ({ page }) => {
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveClass(/light/);
  });

  test('clicking theme button twice returns to dark mode', async ({ page }) => {
    await page.locator('#themeBtn').click();
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).not.toHaveClass(/light/);
  });

  test('light mode preference is saved to localStorage', async ({ page }) => {
    await page.locator('#themeBtn').click();
    const theme = await page.evaluate(() => localStorage.getItem('vk-theme'));
    expect(theme).toBe('light');
  });

  test('dark mode preference is saved to localStorage', async ({ page }) => {
    await page.locator('#themeBtn').click();
    await page.locator('#themeBtn').click();
    const theme = await page.evaluate(() => localStorage.getItem('vk-theme'));
    expect(theme).toBe('dark');
  });
});

// ─── Language Toggle ──────────────────────────────────────────────────────────

test.describe('language toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
  });

  test('lang button shows EN by default', async ({ page }) => {
    await expect(page.locator('#langBtn')).toHaveText('EN');
  });

  test('clicking lang button switches to DE', async ({ page }) => {
    await page.locator('#langBtn').click();
    await expect(page.locator('#langBtn')).toHaveText('DE');
  });

  test('clicking lang button twice returns to EN', async ({ page }) => {
    await page.locator('#langBtn').click();
    await page.locator('#langBtn').click();
    await expect(page.locator('#langBtn')).toHaveText('EN');
  });

});

// ─── Mobile nav ──────────────────────────────────────────────────────────────
// The reference NavPill has no hamburger: the links pill shows icons (plus the active label at
// <=1000px), and is icon-only at <=560px so all four links stay in view.

test.describe('mobile nav', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
  });

  test('there is no hamburger menu', async ({ page }) => {
    await expect(page.locator('#navMenuBtn')).toHaveCount(0);
    await expect(page.locator('#navMenuOverlay')).toHaveCount(0);
  });

  test('topbar fits the viewport without horizontal page scroll', async ({ page }) => {
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw).toBeLessThanOrEqual(375);
    await expect(page.locator('#shared-nav .tools')).toBeInViewport();
  });

  test('all four links are icon-only and in view', async ({ page }) => {
    for (const pg of ['home', 'projects', 'roadmap', 'about']) {
      const link = page.locator(`#shared-nav .links a[href="#${pg}"]`);
      await expect(link).toBeInViewport();
      await expect(link).toHaveAttribute('aria-label', pg);
      await expect(link.locator('span')).toBeHidden();
    }
  });

  test('tapping a link navigates and moves aria-current', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#projects"]').click();
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
    await expect(page.locator('#shared-nav .links a[href="#projects"]')).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#shared-nav .links a[href="#home"]')).not.toHaveAttribute('aria-current', 'true');
  });

  test('topbar stays pinned while scrolling', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 600));
    const top = await page.locator('#shared-nav .tools').evaluate(e => Math.round(e.getBoundingClientRect().top));
    expect(top).toBeLessThanOrEqual(20);
    expect(top).toBeGreaterThanOrEqual(0);
  });
});

// ─── Roadmap Modal ────────────────────────────────────────────────────────────

test.describe('roadmap modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await expect(page.locator('#pg-roadmap')).toHaveClass(/active/);
  });

  test('modal is closed by default', async ({ page }) => {
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/);
  });

  test('clicking expand button opens modal', async ({ page }) => {
    await page.locator('[data-expand]').first().click();
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/);
  });

  test('modal title is populated after opening', async ({ page }) => {
    await page.locator('[data-expand]').first().click();
    await expect(page.locator('#modal-title-text')).not.toBeEmpty();
  });

  test('close button dismisses the modal', async ({ page }) => {
    await page.locator('[data-expand]').first().click();
    await page.locator('#modal-close').click();
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/);
  });

  test('clicking modal backdrop closes the modal', async ({ page }) => {
    await page.locator('[data-expand]').first().click();
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/);
    // click top-left corner of the overlay, outside the centered modal content
    await page.locator('#modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/);
  });

  test('opening second topic modal replaces content', async ({ page }) => {
    const buttons = page.locator('[data-expand]');
    await buttons.nth(0).click();
    const firstTitle = await page.locator('#modal-title-text').textContent();
    await page.locator('#modal-close').click();
    await buttons.nth(1).click();
    const secondTitle = await page.locator('#modal-title-text').textContent();
    expect(firstTitle).not.toBe(secondTitle);
  });
});

// ─── Robustness (code review) ────────────────────────────────────────────────

test.describe('robustness', () => {
  test('stylesheet braces balance (htmlhint does not parse CSS)', () => {
    const html = readFileSync('prototypes/portfolio-combined.html', 'utf8');
    for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      const css = m[1].replace(/\/\*[\s\S]*?\*\//g, '');
      expect(css.split('{').length).toBe(css.split('}').length);
    }
  });

  test('corrupt saved progress does not break the page', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cs-roadmap-progress', '{not json'));
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await expect(page.locator('#pg-roadmap .topic-card')).toHaveCount(11);
    expect(errors).toEqual([]);
  });

  test('blocked localStorage does not break the page', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
    });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#projects"]').click();
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
    expect(errors).toEqual([]);
  });

  test('roadmap modal moves focus in and gives it back', async ({ page }) => {
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    const opener = page.locator('#pg-roadmap [data-expand="1"]');
    await opener.click();
    await expect(page.locator('#modal-close')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });

  test('topic filter buttons expose aria-pressed', async ({ page }) => {
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    const core = page.locator('.filter-btn[data-filter="core"]');
    await core.click();
    await expect(core).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.filter-btn[data-filter="all"]')).toHaveAttribute('aria-pressed', 'false');
  });
});

// ─── Final design-system fixes ───────────────────────────────────────────────

test.describe('final fixes', () => {
  test('nav links carry their own hue', async ({ page }) => {
    await page.goto(SPA);
    const hue = (pg) => page.locator(`#shared-nav .links a[href="#${pg}"]`).evaluate(e => getComputedStyle(e.querySelector('svg')).color);
    const colours = await Promise.all(['home', 'projects', 'roadmap', 'about'].map(hue));
    expect(new Set(colours).size).toBe(4);
  });

  test('search pill is an icon until the page scrolls or it gets keyboard focus', async ({ page }) => {
    await page.goto(SPA);
    const box = page.locator('#shared-nav .tbtn.srch');
    expect((await box.boundingBox()).width).toBeLessThanOrEqual(44);
    await box.focus();
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); // force :focus-visible
    await expect.poll(async () => (await box.boundingBox()).width).toBeGreaterThan(100); // width eases open over .3s
  });

  test('home widgets are neutral with a hue accent bar', async ({ page }) => {
    await page.goto(SPA);
    const bg = await page.locator('#pg-home .w.hue-blue').first().evaluate(e => getComputedStyle(e).backgroundImage);
    expect(bg).toBe('none');
    const bar = await page.locator('#pg-home .w.hue-blue').first().evaluate(e => getComputedStyle(e, '::before').height);
    expect(bar).toBe('3px');
  });

  test('project index cards are free-floating (no glass card)', async ({ page }) => {
    await page.goto(SPA);
    await expect(page.locator('#pg-projects .pi.glass-card')).toHaveCount(0);
  });

  test('roadmap scroll-progress strip is cleared when leaving the roadmap', async ({ page }) => {
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect.poll(() => page.evaluate(() => document.getElementById('progress-bar').style.width)).not.toBe('0px');
    await page.evaluate(() => showPage('about'));
    await expect.poll(() => page.evaluate(() => Math.round(parseFloat(getComputedStyle(document.getElementById('progress-bar')).width)))).toBe(0); // width eases to 0
  });

  test('about intro has no card wrapper', async ({ page }) => {
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#about"]').click();
    const border = await page.locator('#pg-about .intro').evaluate(e => getComputedStyle(e).borderTopWidth);
    expect(border).toBe('0px');
  });

  test('roadmap mind map lists all 11 topics and opens the topic modal', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await expect(page.locator('#mindmap-root .mm-leaf')).toHaveCount(11);
    await page.locator('#mindmap-root .mm-leaf').first().click();
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/);
    await expect(page.locator('#modal-body .tree .node.root')).toBeVisible();
  });

  test('mind map falls back to phase cards on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await expect(page.locator('#mindmap-root .mapcards')).toBeVisible();
    await expect(page.locator('#mindmap-root .mapsvg')).toBeHidden();
    await expect(page.locator('#mindmap-root .mapbox')).toBeHidden(); // no empty frame above the cards
  });
});

// ─── Site search (Ctrl K dialog) ─────────────────────────────────────────────

test.describe('site search', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(SPA);
  });
  const open = async (page) => { await page.keyboard.press('Control+k'); await expect(page.locator('#sxOv')).toBeVisible(); };

  test('pill click and Ctrl K open the dialog; Esc closes it and returns focus', async ({ page }) => {
    await page.locator('#sbtn').click();
    await expect(page.locator('#sxOv')).toBeVisible();
    await expect(page.locator('#sxQ')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#sxOv')).toBeHidden();
    await expect(page.locator('#sbtn')).toBeFocused();
    await open(page);
    await page.keyboard.press('Control+k');
    await expect(page.locator('#sxOv')).toBeHidden();
  });

  test('empty query lists pages, suggestions and the index size', async ({ page }) => {
    await open(page);
    await expect(page.locator('.sx-item')).toHaveCount(4);
    await expect(page.locator('.sx-sug .sx-chip').first()).toBeVisible();
    await expect(page.locator('#sxCount')).toContainText('entries indexed');
  });

  test('ranks, highlights and tolerates a typo', async ({ page }) => {
    await open(page);
    await page.fill('#sxQ', 'c++');
    await expect(page.locator('.sx-item').first().locator('.sx-rt')).toHaveText('Programming Fundamentals');
    await expect(page.locator('.sx-item mark').first()).toBeVisible();
    await page.fill('#sxQ', 'fynance');
    await expect(page.locator('.sx-item .sx-rt', { hasText: 'Finance Buddy' })).toBeVisible();
  });

  test('no-match state, and the page filter narrows results', async ({ page }) => {
    await open(page);
    await page.fill('#sxQ', 'xyzzyq');
    await expect(page.locator('.sx-empty')).toContainText('No match');
    await page.fill('#sxQ', 'pointers');
    await page.locator('.sx-chip[data-f="about"]').click();
    await expect(page.locator('.sx-item')).toHaveCount(0);
    await page.locator('.sx-chip[data-f="roadmap"]').click();
    expect(await page.locator('.sx-item').count()).toBeGreaterThan(0);
  });

  test('arrow keys move the selection; Enter on a topic switches page and opens its modal', async ({ page }) => {
    await open(page);
    await page.fill('#sxQ', 'c++');
    await expect(page.locator('.sx-item').first()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.sx-item').nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page.locator('#sxOv')).toBeHidden();
    await expect(page.locator('#pg-roadmap')).toHaveClass(/active/);
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/);
    await expect(page.locator('#modal-body')).toContainText('Programming Fundamentals');
  });

  test('clicking a project result switches page and flashes the case study', async ({ page }) => {
    await open(page);
    await page.fill('#sxQ', 'hermes');
    await page.locator('.sx-item', { hasText: 'Hermes One OAuth Fork' }).click();
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
    await expect(page.locator('#pg-projects .cs-section.sx-flash')).toHaveCount(1);
  });

  test('the private /me page is never indexed', async ({ page }) => {
    await open(page);
    // project case studies are public and name the tailnet suffix, but the /me gate hostname and copy live only in #pg-me
    for (const q of ['me.auxois', 'Connect to Tailscale and open the private site']) {
      await page.fill('#sxQ', q);
      await expect(page.locator('.sx-item')).toHaveCount(0);
    }
  });

  test('recent searches are remembered, and corrupt storage does not break it', async ({ page }) => {
    await open(page);
    await page.fill('#sxQ', 'darmstadt');
    await page.keyboard.press('Enter');
    await open(page);
    await expect(page.locator('.sx-sug .sx-chip', { hasText: 'darmstadt' })).toHaveCount(1);
    await page.evaluate(() => localStorage.setItem('pf-search-recent', '{not json'));
    await page.keyboard.press('Escape');
    await open(page);
    await expect(page.locator('.sx-item')).toHaveCount(4);
  });
});
