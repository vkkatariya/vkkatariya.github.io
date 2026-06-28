// @ts-check
import { test, expect } from '@playwright/test';

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
    await page.locator('#shared-nav .nav-links a[href="#projects"]').click();
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
    await expect(page.locator('#pg-home')).not.toHaveClass(/active/);
  });

  test('nav link shows roadmap page', async ({ page }) => {
    await page.locator('#shared-nav .nav-links a[href="#roadmap"]').click();
    await expect(page.locator('#pg-roadmap')).toHaveClass(/active/);
  });

  test('nav link shows about page', async ({ page }) => {
    await page.locator('#shared-nav .nav-links a[href="#about"]').click();
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
    await page.locator('#shared-nav .nav-links a[href="#roadmap"]').click();
    await expect(page.locator('#shared-nav')).toHaveClass(/nav-hidden/);
    await expect(page.locator('#roadmap-internal-nav')).toHaveClass(/nav-visible/);
  });

  test('navigating away from roadmap restores shared nav', async ({ page }) => {
    await page.locator('#shared-nav .nav-links a[href="#roadmap"]').click();
    await expect(page.locator('#shared-nav')).toHaveClass(/nav-hidden/);
    // nav-links are visibility:hidden while roadmap is active; call showPage directly
    await page.evaluate(() => window.showPage('home'));
    await expect(page.locator('#shared-nav')).not.toHaveClass(/nav-hidden/);
    await expect(page.locator('#pg-home')).toHaveClass(/active/);
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

  test('switching to DE updates availability badge', async ({ page }) => {
    await page.locator('#langBtn').click();
    await expect(page.locator('.avail-badge')).toHaveText('offen für Praktikumsplätze');
  });

  test('switching back to EN restores availability badge', async ({ page }) => {
    await page.locator('#langBtn').click();
    await page.locator('#langBtn').click();
    await expect(page.locator('.avail-badge')).toHaveText('available for internships');
  });
});

// ─── Mobile Menu ─────────────────────────────────────────────────────────────

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
  });

  test('menu overlay is closed on load', async ({ page }) => {
    await expect(page.locator('#navMenuOverlay')).not.toHaveClass(/open/);
  });

  test('hamburger button opens the menu', async ({ page }) => {
    await page.locator('#navMenuBtn').click();
    await expect(page.locator('#navMenuOverlay')).toHaveClass(/open/);
  });

  test('hamburger button toggles menu closed', async ({ page }) => {
    await page.locator('#navMenuBtn').click();
    await page.locator('#navMenuBtn').click();
    await expect(page.locator('#navMenuOverlay')).not.toHaveClass(/open/);
  });

  test('pressing Escape closes open menu', async ({ page }) => {
    await page.locator('#navMenuBtn').click();
    await expect(page.locator('#navMenuOverlay')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#navMenuOverlay')).not.toHaveClass(/open/);
  });

  test('clicking a menu link navigates and closes menu', async ({ page }) => {
    await page.locator('#navMenuBtn').click();
    await page.locator('#navMenuOverlay a[href="#projects"]').click();
    await expect(page.locator('#navMenuOverlay')).not.toHaveClass(/open/);
    await expect(page.locator('#pg-projects')).toHaveClass(/active/);
  });
});

// ─── Roadmap Modal ────────────────────────────────────────────────────────────

test.describe('roadmap modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SPA);
    await page.locator('#shared-nav .nav-links a[href="#roadmap"]').click();
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
