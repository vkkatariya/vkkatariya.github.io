# tasks/todo.md — portfolio-website
> Current sprint items. Vishal/Hermes/openclaw manages this file.
> Agents: read at session start. Mark items complete as you go.

---

## Status legend
- `[ ]` — queued
- `[~]` — in progress
- `[x]` — done
- `[!]` — blocked

---

## Phase 0 — HTML Prototypes (in progress)

### Visual polish / interaction pass
- [x] Pop-out hover effect on all widgets/blocks across all pages (5-page rollout complete)
- [x] Font stack update — vendor NDOT + fix DM Mono readability (3-branch rollout)
  - [x] Branch 1 `feat/vendor-ndot-font`: pull NDOT .woff2 from GitHub mirror, declare @font-face, add assets/fonts/README.md with source attribution
  - [x] Branch 2 `fix/dm-mono-readability`: bump font-size ≥11px, add letter-spacing 0.5px, swap UI labels to JetBrains Mono, restrict DM Mono to true monospace contexts
  - [x] Branch 3 `feat/ndot-display-accent` (depends on #1): use NDOT in 5 NothingOS-accent spots (.pcard-num, .cs-number, .lbl/.lbl-inv, .skill-n, .clock-h/m). Keep Space Grotesk for body/titles/buttons. Syne stays for hero titles.
  - Strategy: sequential — vendor must complete first, then DM Mono + NDOT display can run parallel. Confirmed with user 2026-06-20.
  - NOTE: Branches 1+2 were done inline (not via coding agent) because delegate_task subagent dispatch failed 3× with 'nemotron model 404' on the prior session. Branch 3 was dispatched to opencode after gateway restart; the agent completed file edits but ran out of tool budget before commit/push, so I finished the commit + browser verification + DEVLOG entry inline. Future agent dispatches are working.
- [ ] Redesign top-right nav pill: fully rounded + liquid glass effect
- [ ] Redesign top-left logo

### Core prototype tasks
- [x] Design system defined: NothingOS + Liquid Glass + Neomorphism + NeoPOP
- [x] Font stack decided: Cormorant Garamond + Space Grotesk + Outfit + DM Mono
- [x] Portfolio v4 homepage — 3-pill glass topbar, widget grid, hero removed
- [x] `/projects` prototype — 4 case studies with inline visualizations
- [x] `/about` prototype — bio, education, skills, 4 languages, contact
- [x] `/roadmap` prototype — cs-roadmap.html
- [x] Combined single-file SPA spike (reference only)
- [x] Reconcile portfolio-combined.html: shared 3-pill topbar + all page sections + SPA page switching
- [x] Fix portfolio-combined.html structural bugs and restore old background design tokens
- [x] Fix portfolio-combined.html roadmap page: slide-over topbar + render invisible topic/career cards
- [x] Project dev setup: AGENTS.md, CONTEXT.md, README.md, DEVLOG.md, todo.md, lessons.md
- [x] Finalize portfolio-combined.html roadmap page — match cs-roadmap.html content + style with clean topbar morph

### Roadmap page (#pg-roadmap) — mobile/JS bugfix pass — 2026-06-19
- [x] Fix JS crash from modal-overlay/modal-close referenced before existing in DOM
- [x] Relocate modal + progress-widget markup to a safe body-level position
- [x] Fix progress-widget visibility race in updateProgressWidget()
- [x] Find + fix "dark rectangle/ghost pill" — rescope leaked nav{}/.nav-links{}/.nav-logo{} rules to #roadmap-internal-nav
- [x] Fix cascade specificity issue blocking the targeted top:auto rule
- [x] Verify topics grid (11 cards) + careers grid (10 cards) render
- [x] Verify filters, timeline accordion, checkbox→progress-widget, modal open/close
- [x] Verify desktop (1440px) / tablet (820px) / mobile (390px) — no regressions, console clean
- [x] Fix #pg-about missing closing </div>, unblocking /me page
- [ ] Shared-nav mobile layout still cramped at ≤400px (3 pills overlap) — separate, pre-existing, not roadmap-specific

### Theme + color
- [x] Dark/light mode toggle with `localStorage` persistence (standalone pages: `html.light` + `vk-theme`)
- [x] Finish light mode on `portfolio-combined.html` — fix remaining dark rectangles/buttons/widgets
- [x] Extend roadmap color profile to home/projects in `portfolio-combined.html`
- [x] Extend roadmap color profile to about/me in `portfolio-combined.html`
- [ ] Contact form with email endpoint (Resend or Nodemailer)
- [ ] CV/resume PDF download link
- [ ] Real GitHub contribution grid via API
- [ ] DE translation strings for full bilingual support
- [ ] Decide `/me` auth mechanism

---

## Phase 1 — SvelteKit Scaffold

### 1a — Project init
- [ ] `pnpm create svelte@latest web` (in repo root)
- [ ] Set up shared design tokens: `src/lib/styles/tokens.css`
- [ ] Google Fonts import: Cormorant Garamond + Space Grotesk + Outfit + DM Mono
- [ ] `src/app.css` — global reset, dot-matrix body bg, CSS variables

### 1b — Layout + shared components
- [ ] `src/routes/+layout.svelte` — 3-pill glass topbar
- [ ] `src/lib/components/PillTopbar.svelte`
- [ ] `src/lib/components/WidgetGrid.svelte`
- [ ] `src/lib/components/Footer.svelte`

---

## Phase 2 — Public Routes

### 2a — Homepage (`/`)
- [ ] Port widget grid from `portfolio-v4.html`
- [ ] Add career timeline
- [ ] Add "now" widget

### 2b — Projects (`/projects`)
- [ ] Port project cards from `projects.html`
- [ ] Cards link to standalone apps:
  - `studio.auxois-wyrm.ts.net`
  - `buddy.auxois-wyrm.ts.net`
  - TypeShift, orlon-bot, other public projects

### 2c — Roadmap (`/roadmap`)
- [ ] `src/routes/roadmap/+page.svelte` — port `cs-roadmap.html` as a real route with clean topbar morph
- [ ] `src/lib/components/RoadmapPage.svelte` — self-contained roadmap component (content + interactions)
- [ ] Link from topbar and homepage widget

### 2d — About (`/about`)
- [ ] Port `about.html` content
- [ ] Bio, h_da education, skills, 4 languages, interests, contact

---

## Phase 3 — `/me` Private Section

- [ ] Decide auth: GitHub OAuth, Tailscale-gated URL, or simple JWT
- [ ] `/me/vault` — identity vault (port from existing artifact)
- [ ] `/me/docs` — integrate artifacts from `notion-artifacts` project
- [ ] `/me/notes` — future Notion workspace mirror (backlog)

---

## Phase 4 — Deploy

- [ ] Vercel project connected to `vkkatariya/vkkatariya.github.io`
- [ ] Custom domain: `vishalkatariya.dev`
- [ ] GitHub Pages mirror configured
- [ ] Smoke test all public routes

---

## Backlog (unscheduled)

_(empty — all items moved to Phase 0)_
