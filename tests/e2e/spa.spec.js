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

  test('every home widget label carries a hue (Hermes, About and Contact included)', async ({ page }) => {
    await page.goto(SPA);
    const rows = await page.locator('#pg-home .w').evaluateAll(ws => ws.map(w => {
      const l = w.querySelector('.wlbl-row');
      return { label: l ? l.textContent.trim().toLowerCase() : '', color: l ? getComputedStyle(l).color : '', bar: getComputedStyle(w).borderLeftWidth };
    }).filter(r => r.label));
    expect(rows.length).toBeGreaterThanOrEqual(12);
    for (const name of ['hermes oauth', 'about', 'contact']) {
      const r = rows.find(x => x.label.includes(name));
      expect(r, name).toBeTruthy();
      expect(r.bar).toBe('4px');
      const [, rr, gg, bb] = /rgb\((\d+), (\d+), (\d+)\)/.exec(r.color);
      expect(Math.max(rr, gg, bb) - Math.min(rr, gg, bb), `${name} label is not grey`).toBeGreaterThan(40);
    }
  });

  test('home widgets are neutral with a hue accent bar', async ({ page }) => {
    await page.goto(SPA);
    const bg = await page.locator('#pg-home .w.hue-blue').first().evaluate(e => getComputedStyle(e).backgroundImage);
    expect(bg).toBe('none');
    // the accent is a 4px left border (not a flat strip), so it follows the rounded corners; the top is a plain 1px outline again
    const bar = await page.locator('#pg-home .w.hue-blue').first().evaluate(e => { const c = getComputedStyle(e); return [c.borderLeftWidth, c.borderLeftColor !== c.borderTopColor, c.borderTopWidth, c.borderTopLeftRadius]; });
    expect(bar[0]).toBe('4px');
    expect(bar[1]).toBe(true); // hue differs from the neutral outline
    expect(bar[2]).toBe('1px');
    expect(parseFloat(bar[3])).toBeGreaterThan(20);
  });

  test('every home widget has its hue bar on the left, none on top', async ({ page }) => {
    await page.goto(SPA);
    const bars = await page.locator('#pg-home .w[class*="hue-"]').evaluateAll(ws => ws.map(w => { const c = getComputedStyle(w); return [c.borderLeftWidth, c.borderTopWidth, c.borderLeftColor !== c.borderRightColor]; }));
    expect(bars.length).toBeGreaterThanOrEqual(12);
    for (const [left, top, hue] of bars) { expect(left).toBe('4px'); expect(top).toBe('1px'); expect(hue).toBe(true); }
  });

  // index of each item among its siblings -> does it carry the 4px hue edge?
  const projectBars = page => page.evaluate(() => {
    const bar = e => { const c = getComputedStyle(e); return c.borderLeftWidth === '4px' && c.borderLeftColor !== 'rgba(0, 0, 0, 0)'; };
    const out = {};
    for (const sel of ['.pi', '.cs-stat', '.feat', '.pipe-stage', '.plat']) {
      out[sel] = [...document.querySelectorAll('#pg-projects ' + sel)].map(e => [[...e.parentElement.children].indexOf(e), bar(e)]);
    }
    for (const sel of ['.vis-wrap', '.cs-skills']) out[sel] = [...document.querySelectorAll('#pg-projects ' + sel)].map(e => [0, bar(e)]);
    return out;
  });
  const expectBars = (bars, want) => {
    for (const [sel, rule] of Object.entries(want)) {
      expect(bars[sel].length, sel).toBeGreaterThan(0);
      for (const [i, hasBar] of bars[sel]) expect(hasBar, `${sel} #${i + 1}`).toBe(rule(i));
    }
  };
  const odd = i => i % 2 === 0;            // 1st, 3rd, 5th... (a single row or column)
  const checker = i => i % 4 === 0 || i % 4 === 3; // 2-column grid: 1st, 4th, 5th, 8th... so rows alternate

  test('projects accent bars alternate (desktop): odd items keep the hue edge, the 2-column index is a checkerboard, wide panels have none', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    expectBars(await projectBars(page), { '.pi': checker, '.cs-stat': odd, '.feat': odd, '.pipe-stage': odd, '.plat': odd, '.vis-wrap': () => false, '.cs-skills': () => false });
  });

  test('projects accent bars alternate (phone): one-column index is odd/even, 2x2 stat tiles are a checkerboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(SPA);
    expectBars(await projectBars(page), { '.pi': odd, '.cs-stat': checker, '.feat': odd, '.vis-wrap': () => false, '.cs-skills': () => false });
  });

  test('an even project card keeps its text aligned with the odd one and still shows a hue ring on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#projects"]').click();
    await page.waitForTimeout(600);
    const pis = page.locator('#pg-projects .pi');
    const pad = await pis.evaluateAll(els => els.slice(0, 2).map(e => { const c = getComputedStyle(e); return [c.borderLeftWidth, c.paddingLeft]; }));
    expect(pad[1]).toEqual(pad[0]); // same border width + padding, so the text starts at the same offset
    await pis.nth(1).hover();
    await expect.poll(() => pis.nth(1).evaluate(e => getComputedStyle(e).boxShadow)).toContain('0px 0px 0px 1px');
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

// ─── Skill bars ──────────────────────────────────────────────────────────────

test.describe('skill bars', () => {
  test('about skill rows are compact and have no divider lines', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.locator('#shared-nav .links a[href="#about"]').click();
    const rows = page.locator('#pg-about .skill-bar');
    expect(await rows.count()).toBeGreaterThan(0);
    const m = await rows.first().evaluate(e => ({ h: e.getBoundingClientRect().height, line: getComputedStyle(e).borderTopWidth }));
    expect(m.line).toBe('0px');
    expect(m.h).toBeLessThan(34); // was 43px
  });
});

// ─── Pop-up alignment, project titles, free case-study widgets, timeline hues ─

test.describe('pop-up + project polish', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
  });
  const hoverTransform = async (page, sel) => {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const bb = await el.boundingBox();
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await page.waitForTimeout(500);
    return el.evaluate(e => getComputedStyle(e).transform);
  };

  test('roadmap full-width timeline bar lifts without scaling', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#roadmap"]').click();
    await page.waitForTimeout(600);
    expect(await hoverTransform(page, '#pg-roadmap .tl-header')).toBe('matrix(1, 0, 0, 1, 0, -3)');
  });

  test('project titles use Space Grotesk, not the display face', async ({ page }) => {
    const home = await page.locator('#pg-home .proj-title').first().evaluate(e => getComputedStyle(e).fontFamily);
    expect(home).toContain('Space Grotesk');
    await page.locator('#shared-nav .links a[href="#projects"]').click();
    const cs = await page.locator('#pg-projects .cs-title').first().evaluate(e => getComputedStyle(e).fontFamily);
    expect(cs).toContain('Space Grotesk');
  });

  test('case studies have no outer card; their widgets float free and pop up', async ({ page }) => {
    await page.locator('#shared-nav .links a[href="#projects"]').click();
    await page.waitForTimeout(600);
    const sec = await page.locator('#pg-projects .cs-section').first().evaluate(e => { const c = getComputedStyle(e); return [c.borderTopWidth, c.backgroundColor, c.boxShadow]; });
    expect(sec[0]).toBe('0px');
    expect(sec[1]).toBe('rgba(0, 0, 0, 0)');
    expect(sec[2]).toBe('none');
    const w = await page.locator('#pg-projects .cs-stat').first().evaluate(e => { const c = getComputedStyle(e); return [c.borderTopWidth, c.borderLeftWidth]; });
    expect(w).toEqual(['0px', '4px']);
    expect(await hoverTransform(page, '#pg-projects .cs-stat')).toBe('matrix(1.015, 0, 0, 1.015, 0, -3)');
  });

  test('home timeline icons carry a hue per entry type', async ({ page }) => {
    const strokes = await page.locator('#pg-home .tl-item .tl-title svg [stroke]').evaluateAll(els => els.map(e => getComputedStyle(e).stroke));
    expect(new Set(strokes).size).toBeGreaterThanOrEqual(5);
    expect(strokes.some(s => s.includes('255, 255, 255'))).toBe(false);
  });
});

// ─── Home all-projects icons + /me logo ──────────────────────────────────────

test.describe('home project icons and /me logo', () => {
  test('all-projects card icons carry the project hues, not neutral white', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    const strokes = await page.locator('#pg-home .pcard .pcard-title svg [stroke]').evaluateAll(els => els.map(e => getComputedStyle(e).stroke));
    expect(strokes.length).toBeGreaterThanOrEqual(3); // several shapes per icon
    expect(new Set(strokes).size).toBe(3); // one hue per project
    expect(strokes.some(s => s.includes('255, 255, 255'))).toBe(false);
  });

  test('/me shows the small logo without a tile or outline, and never pulls the 1.3MB original', async ({ page }) => {
    const reqs = [];
    page.on('request', r => { if (/assets\/logo[^/]*$/.test(r.url())) reqs.push(r.url().split('/').pop()); });
    await page.goto(SPA);
    await page.evaluate(() => showPage('me'));
    const box = page.locator('#pg-me .me-logo');
    await expect(box.locator('img')).toHaveAttribute('src', 'assets/logo-192.webp');
    const s = await box.evaluate(e => { const c = getComputedStyle(e); return [c.backgroundImage, c.borderTopWidth]; });
    expect(s).toEqual(['none', '0px']);
    await expect.poll(() => box.locator('img').evaluate(i => i.complete && i.naturalWidth)).toBe(192);
    expect(reqs).not.toContain('logo.png');
  });
});

// ─── Roadmap + About: accent bars alternate ──────────────────────────────────

test.describe('roadmap and about accent bars', () => {
  const ROADMAP = ['#pg-roadmap .phase-card', '#pg-roadmap .topic-card', '#pg-roadmap .career-card', '#pg-roadmap .guide-col', '#pg-roadmap .resource-item', '#pg-roadmap .mcard'];
  const ABOUT = ['#pg-about .skill-group', '#pg-about .int-card'];

  // For every group of visible cards: count them, count the ones with a 4px hue edge, and list any two neighbours (next to each
  // other in a row or in a column) that share a bar state. A checkerboard has no such pair.
  const alternation = (page, selectors) => page.evaluate(sels => {
    const hasBar = e => { const c = getComputedStyle(e); return c.borderLeftWidth === '4px' && c.borderLeftColor !== 'rgba(0, 0, 0, 0)'; };
    const res = { cards: 0, barred: 0, clashes: [] };
    for (const sel of sels) {
      for (const parent of new Set([...document.querySelectorAll(sel)].map(e => e.parentElement))) {
        const items = [...parent.children].filter(e => e.matches(sel) && e.offsetParent !== null);
        res.cards += items.length;
        res.barred += items.filter(hasBar).length;
        for (const a of items) for (const b of items) {
          if (a === b) continue;
          const sameRow = Math.abs(a.offsetTop - b.offsetTop) <= 4, sameCol = Math.abs(a.offsetLeft - b.offsetLeft) <= 4;
          if (sameRow === sameCol) continue;
          const lo = (p, q) => Math.min(p, q) + 4, hi = (p, q) => Math.max(p, q) - 4;
          const between = items.some(c => c !== a && c !== b && (sameRow
            ? Math.abs(c.offsetTop - a.offsetTop) <= 4 && c.offsetLeft > lo(a.offsetLeft, b.offsetLeft) && c.offsetLeft < hi(a.offsetLeft, b.offsetLeft)
            : Math.abs(c.offsetLeft - a.offsetLeft) <= 4 && c.offsetTop > lo(a.offsetTop, b.offsetTop) && c.offsetTop < hi(a.offsetTop, b.offsetTop)));
          if (!between && hasBar(a) === hasBar(b)) res.clashes.push(`${sel}: "${a.textContent.trim().slice(0, 16)}" next to "${b.textContent.trim().slice(0, 16)}"`);
        }
      }
    }
    return res;
  }, selectors);

  const settled = async (page, selectors) => {
    await expect.poll(async () => { const r = await alternation(page, selectors); return r.cards > 0 && (r.cards === 1 || r.barred < r.cards) ? r.clashes.length : -1; }, { timeout: 8000 }).toBe(0); // -1 = not balanced yet (everything still barred)
    return alternation(page, selectors);
  };

  for (const width of [1280, 860, 390]) {
    test(`roadmap: no two neighbouring cards share a bar state at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(SPA);
      await page.evaluate(() => showPage('roadmap'));
      const r = await settled(page, ROADMAP);
      expect(r.cards).toBeGreaterThan(30);
      expect(r.barred).toBeGreaterThan(10); // not everything stripped either
    });

    test(`about: no two neighbouring cards share a bar state at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(SPA);
      await page.evaluate(() => showPage('about'));
      const r = await settled(page, ABOUT);
      expect(r.cards).toBe(8);
      expect(r.barred).toBe(4);
    });
  }

  test('roadmap phase and career cards carry the hue on the left edge, not the top', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    for (const sel of ['#pg-roadmap .phase-card', '#pg-roadmap .career-card']) {
      const edges = await page.locator(sel).evaluateAll(els => els.map(e => { const c = getComputedStyle(e); return [c.borderLeftWidth, c.borderTopWidth]; }));
      expect(edges.length, sel).toBeGreaterThan(0);
      for (const e of edges) expect(e, sel).toEqual(['4px', '1px']);
    }
  });

  test('the topic filter keeps the visible cards alternating, and "all" restores the pattern', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    await settled(page, ['#pg-roadmap .topic-card']);
    const filters = await page.locator('.filter-btn').evaluateAll(bs => bs.map(b => b.dataset.filter));
    expect(filters.length).toBeGreaterThan(2);
    for (const f of filters.filter(x => x !== 'all')) {
      await page.locator(`.filter-btn[data-filter="${f}"]`).click();
      const r = await settled(page, ['#pg-roadmap .topic-card']);
      expect(r.cards, `filter ${f}`).toBeGreaterThan(0);
      expect(r.cards, `filter ${f}`).toBeLessThan(11);
      expect(r.barred, `filter ${f}: the first visible card keeps its bar`).toBeGreaterThan(0);
    }
    await page.locator('.filter-btn[data-filter="all"]').click();
    expect((await settled(page, ['#pg-roadmap .topic-card'])).cards).toBe(11);
  });

  test('resizing from desktop to phone re-balances the bars', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    await settled(page, ROADMAP);
    await page.setViewportSize({ width: 390, height: 900 });
    await settled(page, ROADMAP);
  });

  test('a card grid that changes size on its own (no window resize) is re-balanced, including the JS-rendered grids', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    await settled(page, ['#pg-roadmap .career-card', '#pg-roadmap .topic-card']);
    const cols = () => page.evaluate(() => new Set([...document.querySelectorAll('#pg-roadmap .career-card')].map(e => e.offsetLeft)).size);
    expect(await cols()).toBeGreaterThan(1);
    // the careers and topics grids are rendered by JS after the observer is created. Narrowing them to 2 columns needs a different
    // pattern (going 3 -> 1 column would keep the old one valid by luck, since an odd column count flattens to plain alternation)
    await page.addStyleTag({ content: '#pg-roadmap .careers-grid, #pg-roadmap .topics-grid { width: 640px !important; }' });
    await expect.poll(cols).toBe(2);
    await settled(page, ['#pg-roadmap .career-card', '#pg-roadmap .topic-card']);
  });

  test('a page that is hidden keeps its bar pattern while the window resizes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('about'));
    await settled(page, ABOUT);
    await page.evaluate(() => showPage('home'));
    await page.setViewportSize({ width: 1100, height: 900 }); // triggers a rebalance pass while About is display:none
    await page.waitForTimeout(300);
    const kept = await page.evaluate(() => document.querySelectorAll('#pg-about [data-nobar]').length);
    expect(kept, 'tags are not cleared while the page is hidden').toBe(4);
  });
});

// ─── Roadmap nav on phones + card surfaces ───────────────────────────────────

test.describe('roadmap nav on phones and card surfaces', () => {
  const navBox = async page => {
    await page.evaluate(() => showPage('roadmap'));
    await expect(page.locator('#roadmap-internal-nav')).toHaveClass(/nav-visible/);
    await expect.poll(async () => (await page.locator('#roadmap-internal-nav').boundingBox()).width, { message: 'nav finished scaling in' }).toBeGreaterThan(100);
    await page.waitForTimeout(450); // the pill eases in over ~.34s
    return page.locator('#roadmap-internal-nav').boundingBox();
  };

  for (const width of [320, 360, 390, 430, 559]) {
    test(`phone ${width}px: the nav is an icons-only pill in the topbar row, between the brand and the tools`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(SPA);
      const nav = await navBox(page);
      const brand = await page.locator('#shared-nav .brand').boundingBox();
      const tools = await page.locator('#shared-nav .tools').boundingBox();
      expect(nav.y).toBeGreaterThanOrEqual(8);
      expect(nav.y + nav.height).toBeLessThan(80); // in the topbar row, not at the bottom
      expect(nav.x, 'clears the brand pill').toBeGreaterThanOrEqual(brand.x + brand.width);
      expect(nav.x + nav.width, 'clears the tools pill').toBeLessThanOrEqual(tools.x);
      const links = await page.locator('#roadmap-internal-nav .nav-links a').evaluateAll(as => as.map(a => { const r = a.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), a.getAttribute('aria-label'), getComputedStyle(a.querySelector('span')).display]; }));
      expect(links.map(l => l[2])).toEqual(['overview', 'topics', 'careers', 'resources']);
      for (const [w, h, , span] of links) { expect(w).toBeGreaterThanOrEqual(30); expect(h).toBeGreaterThanOrEqual(30); expect(span).toBe('none'); }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    });
  }

  test('between 560px and 1000px the labelled nav stays a bottom pill (it does not fit the topbar slot)', async ({ page }) => {
    for (const width of [560, 860]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(SPA);
      const nav = await navBox(page);
      expect(nav.y, `${width}px`).toBeGreaterThan(600);
    }
  });

  test('desktop keeps the labelled nav at the top', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(SPA);
    const nav = await navBox(page);
    expect(nav.y).toBeLessThan(40);
    expect(nav.width).toBeGreaterThan(400);
  });

  for (const theme of ['dark', 'light']) {
    test(`${theme}: getting-started, topic, resource, mind-map, skill-group and interest cards use the same surface as the other widgets`, async ({ page }) => {
      await page.addInitScript(t => { try { localStorage.setItem('vk-theme', t); } catch (e) { /* ignore */ } }, theme);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(SPA);
      const bg = sel => page.locator(sel).first().evaluate(e => getComputedStyle(e).backgroundColor);
      const widget = await bg('#pg-home .w.hue-blue');
      await page.evaluate(() => showPage('roadmap'));
      for (const sel of ['.guide-col', '.topic-card', '.resource-item', '.career-card', '.mcard']) expect(await bg(`#pg-roadmap ${sel}`), `roadmap ${sel}`).toBe(widget);
      await page.evaluate(() => showPage('about'));
      for (const sel of ['.int-card', '.skill-group']) expect(await bg(`#pg-about ${sel}`), `about ${sel}`).toBe(widget);
    });
  }

  for (const width of [320, 390, 559]) {
    test(`phone ${width}px: the roadmap title starts at the same height as on Projects and About`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(SPA);
      const top = async pg => {
        await page.evaluate(p => showPage(p), pg);
        await page.waitForTimeout(700); // the page eases in
        return Math.round((await page.locator(`#pg-${pg} .ph-label`).boundingBox()).y);
      };
      const projects = await top('projects');
      expect(await top('about')).toBe(projects);
      expect(await top('roadmap')).toBe(projects); // was 76px lower: the header sits inside <main>, which already adds 76px
    });
  }

  test('a topic card darkens a step on hover, like the phase and career cards', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SPA);
    await page.evaluate(() => showPage('roadmap'));
    const card = page.locator('#pg-roadmap .topic-card').first();
    await card.scrollIntoViewIfNeeded();
    const token = name => page.evaluate(n => { const d = document.createElement('div'); d.style.background = `var(${n})`; document.body.append(d); const c = getComputedStyle(d).backgroundColor; d.remove(); return c; }, name);
    expect(await card.evaluate(e => getComputedStyle(e).backgroundColor)).toBe(await token('--bg2'));
    await card.hover();
    await expect.poll(() => card.evaluate(e => getComputedStyle(e).backgroundColor)).toBe(await token('--bg3'));
  });
});

test.describe('roadmap hero has no dead space', () => {
  for (const [width, height] of [[390, 844], [768, 1024], [1280, 800]]) {
    test(`${width}px: the overview heading follows the hero buttons without a viewport-tall gap`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(SPA);
      await page.evaluate(() => showPage('roadmap'));
      await page.waitForTimeout(800);
      const hero = await page.locator('#pg-roadmap .hero').boundingBox();
      const buttons = await page.locator('#pg-roadmap .hero-cta').boundingBox();
      const heading = await page.locator('#roadmap-heading').boundingBox();
      expect(hero.height).toBeLessThan(height * 0.5); // was min-height 75-80vh on phones and tablets
      expect(heading.y - (buttons.y + buttons.height)).toBeLessThan(160);
    });
  }
});
