# tasks/todo.md — portfolio-website
> Current sprint items. Vishal manages this file.
> Agents: read at session start. Mark items complete as you go.

---

## Status legend
- `[ ]` — queued
- `[~]` — in progress
- `[x]` — done
- `[!]` — blocked

---

## Phase 0 — HTML Prototypes (in progress)

- [x] Design system defined: NothingOS + Liquid Glass + Neomorphism + NeoPOP
- [x] Font stack decided: Cormorant Garamond + Space Grotesk + Outfit + DM Mono
- [x] Portfolio v4 homepage — 3-pill glass topbar, widget grid, hero removed
- [x] `/projects` prototype — 4 case studies with inline visualizations
- [x] `/about` prototype — bio, education, skills, 4 languages, contact
- [x] `/roadmap` prototype — cs-roadmap.html
- [x] Combined single-file SPA spike (reference only)
- [x] Reconcile portfolio-combined.html: shared 3-pill topbar + all page sections + SPA page switching
- [x] Project dev setup: AGENTS.md, CONTEXT.md, README.md, DEVLOG.md, todo.md, lessons.md
- [ ] Finalize homepage (portfolio-v4.html) as the canonical reference
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
- [ ] Port `cs-roadmap.html` into SvelteKit route
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

- [ ] Dark/light mode toggle with `localStorage` persistence
- [ ] Contact form with email endpoint (Resend or Nodemailer)
- [ ] CV/resume PDF download link
- [ ] Real GitHub contribution grid via API
- [ ] DE translation strings for full bilingual support
