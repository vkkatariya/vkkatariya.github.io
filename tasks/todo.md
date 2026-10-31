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
- [x] Pop-out hover effect on all widgets/blocks across all pages
- [x] Font stack update — vendor NDOT + fix DM Mono readability
- [x] **Remove NDOT font entirely** (2026-06-27): user feedback after deploy; reverted to Space Grotesk
- [x] NDOT accent font rollout (Branches 1-7): topbar, widget titles, project titles, display accents
  - [ ] Branch 8 (deferred): NDOT to `.tl-title`? Needs separate decision
- [x] Redesign top-right nav pill: fully rounded + liquid glass
- [x] Roadmap page header — match Projects/About aesthetic
- [x] Timeline fonts bigger — `.tl-title` NDOT 700 clamp(16-20px), `.tl-desc` 13px, `.tl-year` 12px, `.tl-badge` 11px
- [x] Apply topbar liquid-glass effect to all widgets on all pages

### Design System Migration — Final Fixes (2026-10-25) ✅ COMPLETE
- [x] Page titles legacy font size — `.ph-title` `clamp(28px, 4.4vw, 46px)`; hero `clamp(48px, 8vw, 96px)`
- [x] Homepage topbar icons — distinct hues (home=blue, projects=teal, roadmap=indigo, about=purple)
- [x] Search collapsed by default — icon (≤42px) on load; expands on scroll/focus; Ctrl+K works
- [x] Home widgets: coloured → title + bar — neutral `--bg2` + 3px top accent bar + hue label/icon
- [x] Project titles legacy font size — `.pi-title` 19px Space Grotesk; `.cs-title` `--display` 700 `clamp(32px, 5vw, 56px)`
- [x] Remove widget outline from projects, free widgets — 4px hue left border + spring hover
- [x] Roadmap mind map under timeline + 11 CORE TOPICS — radial SVG ≥900px + phase cards + modal tree
- [x] Roadmap pop-up aligned — `.tl-header:hover`, `.resource-item:hover` use `.w:hover` spring
- [x] Remove widget outline around about description — `.intro` loses card wrapper
- [x] CS Roadmap internal nav SVG icons — map/grad/briefcase/book with hue styling
- [x] Roadmap internal nav no longer overlaps brand/tools pills — smaller type/padding/icons
- [x] Search focus: inner box removed, ring softened to 35% accent
- [x] Working site search — Ctrl/⌘+K and `/` dialog, client-side index, filters, typo tolerance
- [x] Home widget accent: curved 3px top border; skill bars compact; label spacing fixed
- [x] Roadmap timeline bar lifts without scaling; project titles Space Grotesk; case studies free-floating
- [x] Topbar breathing room: gap above home widgets 8px→28px (32px phones); removed inline padding override
- [x] Home all-projects card icons hued per project; `/me` bare logo (5KB webp)
- [x] Hermes OAuth / About / Contact widgets get hue — every home widget coloured
- [x] Merged `fix/*` branches deleted; `dev` and `main` only branches
- [x] Phone search: floating glass button ≤560px; footer tags follow card hue; availability text removed
- [x] `index.html` migrated to design system — tokens, fonts, 0.85s intro (first visit per tab session; repeat visits skip it), reduced-motion, section-hash forwarding
- [x] Kickoff `tasks/kickoff-fix-design-system-migration.md` Box 2 reworded and ticked
- [x] Test suite: 73 tests (spa.spec.js, phone-and-legacy.spec.js, index.spec.js), all green; lint covers index.html

**Verification:** 40/40 Playwright (then 73/73); `lint:html` 0 errors; 40/40 visual audit PASS; production deployed.

### Accent bar rebalance (2026-10-31) — merged to `dev` (PR #40), not yet released to `main`
**Ask:** the hue accent bar is overused. Move the home widgets' bar from the top edge to the left edge; on the Projects page strip the bars down to an odd/even pattern.

**Scope (measured on the live SPA at 1280px):**
- Home: 12 `.w[class*="hue-"]` widgets carry a 3px curved `border-top` (`#pg-home .w[class*="hue-"]`, ~line 2813) plus a hover override. Moves to a 4px `border-left`; padding re-balanced so content stays put.
- Projects: 95 elements carry a 4px hue left edge: 8 `.pi` index cards, 32 `.cs-stat`, 23 `.feat`, 8 `.vis-wrap`, 8 `.cs-skills`, 10 `.pipe-stage`, 6 `.plat`. The panels (`.vis-wrap`, `.cs-skills`) also nest cards that carry their own bar.
- Out of scope: Roadmap and About keep their left bars; hue stays on labels, icons, bar fills and the hover ring.
- Files: `prototypes/portfolio-combined.html` (CSS only) and `tests/e2e/spa.spec.js` (assertions on the old top bar, ~lines 297, 309-314, 506).

**Decision:** odd/even = items 1, 3, 5... keep the bar, items 2, 4, 6... get a transparent left border (same width, so text stays aligned and nothing shifts). The two wide panels (`.vis-wrap`, `.cs-skills`) lose the bar entirely. The hover ring still shows the hue on every card. In the two 2-column cases (index cards above 700px, stat tiles at 600px and below) the pattern flips each row (checkerboard) so it does not stripe whole columns. Bars on Projects: 95 -> 43. If plain odd/even is preferred everywhere, drop the four `@media` blocks under "accent bars, stripped down".

- [x] Home widgets: top bar to left bar (CSS, hover, padding)
- [x] Projects: odd/even bars on `.pi`, `.cs-stat`, `.feat`, `.pipe-stage`, `.plat`; none on `.vis-wrap`, `.cs-skills`
- [x] Update + add Playwright assertions (home bar on the left; odd has a bar, even has none)
- [x] Verify: `npm test` 74/74, `lint:html` clean, screenshots dark + light at 1280/390, geometry diff on all 12 home widgets (no horizontal shift, no new overflow)
- [x] Merged PR #40 to `dev` (7263c84) after an independent review (no blocking defects)
- [ ] Follow-up (cosmetic): between about 460px and 600px the 3 `.plat` cards wrap to 2 columns (`auto-fit, minmax(170px, 1fr)`), so plain odd/even puts the bar on cards 1 and 3 in the same column. Fix by moving Projects onto `balanceBars()` (also unifies the two approaches)

### Accent bar rebalance, part 2: Roadmap + About (2026-10-31) — merged to `dev` (PR #41, 1f79363), not yet released to `main`
**Ask:** apply the same changes to the Roadmap and About pages.

**Scope (measured at 1280 / 860 / 390):**
- Roadmap: 14 cards carry a 3px **top** bar (4 `.phase-card`, 10 `.career-card`) and 26 a 4px left bar (11 `.topic-card`, 9 `.resource-item`, 4 `.mcard` (<900px only), 2 `.guide-col`). The topic modal adds `.modal-learn-cat` and `.modal-resource-link` left bars.
- About: 8 left bars (4 `.skill-group`, 4 `.int-card`, both 2-column grids).
- Top bars move to the left (as on Home); every group then alternates (as on Projects).
- Complication: these grids are `auto-fit` (1-4 columns depending on width) and the roadmap topic filter hides cards with `.hidden`, so CSS-only `:nth-child` would stripe columns and break after filtering. Instead a small `balanceBars()` reads the real layout (visible items, row + column) and tags every other one `data-nobar`; CSS makes tagged cards' left edge transparent. Re-runs on resize/visibility (ResizeObserver), after a filter click and when the topic modal opens. No JS = every card keeps its bar.
- Files: `prototypes/portfolio-combined.html` (CSS + ~35 lines JS), `tests/e2e/spa.spec.js`.
- Out of scope: Projects and Home (PR #40) keep their CSS-only rules; unifying them on `balanceBars()` is a possible follow-up.

- [x] Roadmap `.phase-card` / `.career-card`: top bar to left bar (padding re-balanced)
- [x] `balanceBars()` + `[data-nobar]` CSS for Roadmap (cards, resources, guide, mind-map cards) and About (skill groups, interest cards). The topic modal's `.modal-learn-cat` / `.modal-resource-link` rules have no markup (dead CSS), so nothing to do there.
- [x] Playwright: no neighbouring cards share a bar state at 1280/860/390, after each topic filter, and after a desktop-to-phone resize (+9 tests, 79 total)
- [x] Verify: `npm test` 79/79, `lint:html` clean, screenshots dark + light, geometry diff of the converted cards (no horizontal shift, no new overflow)
- [x] PR #41 to `dev`
- [x] Independent review of #41: no defects, two small issues fixed before merging: the `ResizeObserver` never watched the JS-rendered topic/career/mind-map grids (`balanceBars()` now registers each parent itself), and a rebalance while a page was hidden cleared its tags (groups with no visible card are now skipped). +2 tests; the first draft of the observer test passed on the old code (3 -> 1 columns keeps the pattern valid by luck), so it now goes to 2 columns
- [x] Merged #41 to `dev` after merging `origin/dev` into the branch (DEVLOG conflict, both entries kept). `npm test` 85/85 on the combined result
- [ ] Release `dev` to `main` (carries #36, #37, the standalone-page cleanup, README, #40, #41); look at it on a phone first

### Roadmap mobile nav + card surfaces (2026-10-31) — PR open against `dev`, not yet merged
**Ask (from a phone screenshot of the dev preview):** the roadmap nav is at the bottom on a phone; it should be at the top. And some widgets are near-black instead of grey.

**Scope:**
- Nav: `#roadmap-internal-nav` is a bottom bar at 1000px and below (the grouped topbar has no free centre slot for its labelled links). On a phone (<=559px) the shared links pill is only 134-198px wide and is hidden on the roadmap, so there is room in the topbar row: put the nav there as an icons-only pill (the active tab is the highlighted one). 560-1000px keeps the bottom pill (its labelled 516px bar does not fit the 258px slot). Things that assume a bottom bar and must follow: the search FAB lift (`bottom: 84px`), the progress widget (`bottom: 80px`), `alignRoadmapNav()` (only aligns above 1000px), and the phone test that checks the FAB clears the bar.
- Surfaces: `.guide-col` (Getting started), `.topic-card` (11 core topics), `.resource-item` (curated resources) on Roadmap and `.int-card` (Interests) on About use `--bg3` (near-black in dark theme); the other widgets use `--bg2`. Switch to `--bg2`, with the hover going to `--bg3` like the phase and career cards.
- Same pattern, asked for afterwards: `.skill-group` (About) and `.mcard` (Roadmap mind-map cards) were also `--bg3`; both moved to `--bg2`.
- Phone title gap: the roadmap header is inside `<main>` (76px) plus `.ph` 120px = title at 196px vs 120px on Projects/About. At <=559px `.ph` gets `padding-top: 44px`.

- [x] Phone: roadmap nav in the topbar row, icons only; FAB and progress widget back to their normal positions
- [x] Four card types on `--bg2`, hover `--bg3` (topic cards and resources)
- [x] Playwright: nav at the top and inside the topbar row on phones (320/360/390/430/559), bottom pill kept at 560-1000; card backgrounds equal the other widgets'
- [x] Verify: `npm test` 96/96, `lint:html` clean, phone screenshots, no overlap with the brand and tools pills at 320
- [x] PR to `dev`
- [x] `.skill-group` (About) and `.mcard` (Roadmap) moved to `--bg2` too
- [x] Roadmap title starts at 120px on phones, like Projects and About (`npm test` 99/99)
- [x] Roadmap hero: dead space before "Learning path overview" on phones/tablets (home `.hero` min-height 75-80vh leaked in) removed
- [ ] Open: at 560px and above the roadmap title still starts at 196px (Projects 120px, About 120-130px): same 76px double padding on tablet and desktop. Decide whether to align those too

### Performance — cut the root-load cost (scoped 2026-10-26, not started)
**Goal:** root URL adds ~0ms over direct portfolio; first paint ~350-400ms (was ~560ms).

**Baseline (ARM board, median 7 runs):**
- Direct `/prototypes/portfolio-combined`: 559ms
- Root `/` (meta refresh): 634ms (+75ms)
- Apex (308 + root): 789ms (+230ms)

**Decisions needed before starting:**
1. ~~Fate of splash~~ — decided: kept, cut from ~1.9s to ~0.85s, skipped on repeat visits in a tab session (sessionStorage `vk-intro`). Revisit if root-load still misses the budget
2. OK to add self-hosted font files (binary assets, subset via `fonttools`)
3. Canonical host (apex or `www`) and Vercel redirect permission
4. HTML staleness tolerance: 0 / 60s / 1h (drives cache headers)

- [ ] **Phase 1 — remove hops, cache assets** (expected −75ms www / −230ms apex)
  - [ ] Vercel rewrite `{"source": "/", "destination": "/prototypes/portfolio-combined"}`
  - [ ] Move splash to `/intro` or drop; update canonical, og:url, e2e tests
  - [ ] One canonical host: redirect apex ↔ `www` at edge; use in og:*, canonical, links
  - [ ] Cache headers: immutable for fonts/images; short max-age + stale-while-revalidate for HTML
  - [ ] Image diet: logo-128/256 to WebP at display size x2 (~5KB each)
  - [ ] Link to extension-less URLs everywhere
- [ ] **Phase 2 — fonts off critical path** (expected −100–250ms first visit)
  - [ ] Self-host Latin-subset woff2 for Syne 800, Space Grotesk, Outfit, JetBrains Mono, DM Mono (~80KB target)
  - [ ] Cormorant: subset to 2 glyphs (<3KB) or replace
  - [ ] Inline `@font-face`, preload above-the-fold faces, remove Google Fonts preconnects, `font-display: swap` + size-adjusted fallback
- [ ] **Phase 3 — optional** (only if Phases 1–2 insufficient)
  - [ ] Lazy-load non-home DOM as fragments
  - [ ] Service worker for near-instant repeat visits
- [ ] **Not worth doing** (measured): removing glass/shadows/animations, `content-visibility`, trimming JS, more preconnects

**Re-measure:** Playwright 7 runs median; FCP via `timeOrigin + paint['first-contentful-paint']`; main-thread via Performance.getMetrics.

### Follow-ups (open, optional)
- [ ] 860px home grid leaves empty third column
- [ ] Consider raising search focus ring above 35% if keyboard visibility a concern
- [ ] `.srch-label` uses undefined `var(--w40)` — define or use `--w60`

---

### Core prototype tasks
- [x] Design system defined: NothingOS + Liquid Glass + Neomorphism + NeoPOP
- [x] Font stack: Cormorant Garamond + Space Grotesk + Outfit + DM Mono
- [x] Portfolio v4 homepage — 3-pill glass topbar, widget grid, hero removed
- [x] `/projects` prototype — 4 case studies with inline visualizations
- [x] `/about` prototype — bio, education, skills, 4 languages, contact
- [x] `/roadmap` prototype — cs-roadmap.html
- [x] Combined single-file SPA spike
- [x] Reconcile portfolio-combined.html: shared 3-pill topbar + all page sections + SPA switching
- [x] Fix structural bugs, restore background design tokens
- [x] Fix roadmap page: slide-over topbar + render invisible topic/career cards
- [x] Project dev setup: AGENTS.md, CONTEXT.md, README.md, DEVLOG.md, todo.md, lessons.md
- [x] Finalize roadmap page — match cs-roadmap.html content + style
- [x] Generate CV/resume PDF via Playwright + Chromium
- [x] Gate `/me` behind Tailscale on athena — network-layer only, public Vercel excludes `/me`

### Roadmap page (#pg-roadmap) — mobile/JS bugfix pass — 2026-06-19
- [x] Fix JS crash from modal-overlay/modal-close referenced before DOM
- [x] Relocate modal + progress-widget markup to safe body-level position
- [x] Fix progress-widget visibility race in updateProgressWidget()
- [x] Fix "dark rectangle/ghost pill" — rescope leaked nav rules to #roadmap-internal-nav
- [x] Fix cascade specificity blocking targeted top:auto rule
- [x] Verify topics grid (11 cards) + careers grid (10 cards) render
- [x] Verify filters, timeline accordion, checkbox→progress-widget, modal open/close
- [x] Verify desktop/tablet/mobile — no regressions, console clean
- [x] Fix #pg-about missing closing </div>, unblocking /me page
- [x] Shared-nav mobile layout fixed via 3-tier responsive plan (≤860/560/380px)

### Polish task #3 follow-up — project skill bars
- [x] Add scored skill bars to each `.cs-section` (8 sections, 38 bars, color bands: ≥70/≥50/<50)

### Content + structure cleanup (2026-06-23)
- [x] Content cleanup across all pages — 8+ commits on `feat/content-cleanup`
- [x] Add 4 new projects to /projects page — `feat/add-4-projects` (Portfolio Website, Hermes OAuth, OpenClaw Dashboard, Unilox Fitness AI)
- [x] Redesign projects 5–8 artifacts to match quality of 1–4 (node-diagram, pipeline, platform-grid)
- [x] Add new projects as homepage widgets — **DECIDED**: only FEATURED Hermes OAuth widget added
- [x] Fix redirecting links across all pages
- [x] Fix duplication on homepage about + contact widgets
- [x] Add SVG icons to widgets missing them — ~122 widgets across 5 pages, per-context sizes 12-28px
- [x] Homepage content cleanup v2 — DevOps time chip, Darmstadt x6, STACK moved, headings bigger
- [x] Contact widget cleanup — `open to werkstudent jobs`; kept Email + GitHub only; removed avail-block
- [x] Projects stat fix — `12 shipped` → `8 shipped`
- [x] Photo widget swap — real photo in /about (680×761, object-fit:cover)
- [x] Topbar centered grouping + status "Not available" — pills grouped, language toggle synced, 29/29 tests pass

### Theme + color
- [x] Dark/light mode toggle with localStorage persistence
- [x] Finish light mode — fix remaining dark rectangles/buttons/widgets
- [x] Extend roadmap color profile to home/projects/about/me
- [ ] Contact form with email endpoint (Resend or Nodemailer)
- [x] CV/resume PDF download link — cv.pdf generated, links in About + homepage contact
- [x] Real GitHub contribution grid — manual count `51` in HTML; API approaches abandoned
- [ ] DE translation strings — choose tier: (a) Minimal, (b) Partial, (c) Full coverage
- [x] Fix SVG icon visibility in light mode — added `html.light svg.ico` selectors for all 113+ icons

### Brand assets (2026-06-30)
**Favicon** (fix queued — prior work had visible black borders)
- [ ] **Fix: re-derive favicon from cropped source** — crop to V/K content, add 5% padding, square to 1024×1024, composite on clean background, re-derive 9 assets, visual QA at 16/32/180/192/512. Kickoff: `tasks/kickoff-favicon-borders-fix.md`

**Topbar logo** (7 sub-places identified)
- [ ] Sub-place 1: Topbar pill (left) — scroll-responsive logo swap (wordmark → mark)
- [ ] Sub-place 2: Profile icon (top right) — replace "VK" initials with logo SVG
- [ ] Sub-place 3: Open Graph image — 1200×630 with logo + name + tagline; add to all 7 HTML files
- [ ] Sub-place 4: Hero identity widget — add logo mark alongside wordmark
- [ ] Sub-place 5: About page photo block — add logo mark below photo
- [ ] Sub-place 6: Resume page header — add logo mark
- [ ] Sub-place 7: `/me` private page — add logo mark to heading

### Resume redesign ✅ COMPLETE (2026-07-01)
**Goal:** rebuild `prototypes/resume.html` using portfolio design system (Light Grey + Dark themes, widget-block glass, SVG icons, 4-font stack). A4 print stylesheet.
- [x] All 15 sub-tasks complete. PR #15 merged to dev.
- [x] Renders 1-page A4: photo + VISHAL KATARIYA + 4 status pills; 4 contact pills; Skills (Technical 8 bars + Soft); Languages; Interests; Education (about-page layout, 8 modules); Projects (5); Work Experience (1 Amazon DNW4)
- [x] Single corner-to-corner widget wrapper; bottom divider only
- [x] `cv.pdf` regenerated (148KB → 974KB, 1-page A4) with visual QA at A4 + screen + print preview
- [x] Original `resume.html` preserved; print-only CSS handles 1-page compression

### New widgets
- [x] Add FEATURED: Hermes One OAuth Fork widget on homepage — col4 row5, VIEW → projects page, GITHUB → repo
- [x] Decide `/me` auth — Tailscale network-layer gate on athena (Caddy allowlist or Tailscale IP bind)

### Live deployment (2026-06-27)
- [x] GitHub Pages workflow — auto-deploys on push to main; live at `vkkatariya.github.io`
- [x] Root redirect splash — `index.html` meta refresh + JS fallback + "ENTER PORTFOLIO" link
- [x] CNAME removed — GitHub Pages serves directly
- [x] Vercel production — `vishal-katariya.com` auto-deploys on push to main
- [x] Vercel preview deployments — auto-generated URLs, Deployment Protection OFF
- [x] Speed Insights + Web Analytics on all 6 live HTML files
- [x] `vercel.json` minimal config; package.json build script
- [!] Subpath rewrites — `/projects`, `/about`, `/roadmap` 404 on Vercel (Hobby plan limitation)
- [!] Custom preview domain `vishalkatariya.dev` — redirect loop on Hobby plan
- [~] `vishalkatariya.dev` — registrar-level 308 to www (separate DNS issue)

---

## Phase 1 — SvelteKit Scaffold

**Stack decisions (2026-06-27):** Svelte 5 (runes), TypeScript strict, `@sveltejs/adapter-static`, TS modules for data, Vercel deploy, parallel cutover via `/v2` subpath, archive old HTML after cutover.

**Architecture:** Public routes on Vercel; private `/me/*` and backend on athena behind Tailscale.

### 1a — Project init
- [ ] `pnpm create svelte@latest web` — Svelte 5 + TS + ESLint + Prettier + Vitest
- [ ] Install `@sveltejs/adapter-static`, configure `svelte.config.js`
- [ ] `tsconfig.json` — strict mode, noImplicitAny, strictNullChecks, noUncheckedIndexedAccess
- [ ] Design tokens: `src/lib/styles/tokens.css` — `--w`, `--w30`, `--w60`, `--green`, `--blue`, `--acc`, `--font-ndot`, `--bg` + light-mode overrides
- [ ] Google Fonts import in `+layout.svelte`: Cormorant Garamond + Space Grotesk + Outfit + DM Mono (preconnect + display=swap)
- [ ] `@font-face` for Ndot (NDOT55Caps.woff2) — copy from `assets/fonts/` to `static/fonts/`
- [ ] `src/app.css` — global reset, dot-matrix body bg, CSS variables, base typography
- [ ] `src/lib/styles/glass.css` — extract `.glass` and `.liquid-glass` from portfolio-combined.html

### 1b — Layout + shared components
- [ ] `src/routes/+layout.svelte` — 3-pill glass topbar (port from portfolio-combined.html)
- [ ] `src/lib/components/PillTopbar.svelte` — props: `currentRoute`, `available`; active state via store
- [ ] `src/lib/components/NavLink.svelte` — single nav link with hover/active states
- [ ] `src/lib/components/WidgetGrid.svelte` — CSS grid container
- [ ] `src/lib/components/Widget.svelte` — base glass wrapper (s11/s12/s21/s22 variants)
- [ ] `src/lib/components/Footer.svelte` — copyright + nav + contact
- [ ] `src/lib/components/Icon.svelte` — sprite-based (load icons.svg, accept `name` prop); light-mode compatible
- [ ] `src/lib/stores/theme.ts` — dark/light store (default dark, persist localStorage, mirror to html[data-theme])
- [ ] `src/lib/stores/lang.ts` — en/de store, translation function `$t('key')`, mirror to html[lang]
- [ ] `src/lib/stores/route.ts` — current route state, drives topbar active state

### 1c — Data layer
- [ ] `src/lib/data/projects.ts` — 8 projects (id, title, tagline, year, stack, tags, csSections, repoUrl, liveUrl)
- [ ] `src/lib/data/skills.ts` — 6 core skills with proficiency scores
- [ ] `src/lib/data/timeline.ts` — career timeline entries
- [ ] `src/lib/data/edu.ts` — education entries (h_da CS, languages, certifications)
- [ ] `src/lib/data/topics.ts` — roadmap topics (from TOPICS const)
- [ ] `src/lib/data/now.ts` — current "now" widget content
- [ ] `src/lib/data/about.ts` — bio, intro, contact info
- [ ] Each file exports typed constants with interfaces in `src/lib/types/`

### 1d — Migration order (sequential, lowest risk first)

**1d.1 — `/me` page (simplest)**
- [ ] `src/routes/me/+page.svelte` — port identity vault content
- [ ] `src/routes/me/+page.ts` — load data from `src/lib/data/`
- [ ] Browser-verify at all 5 viewports (320, 400, 560, 860, 1920)
- [ ] Light-mode verify
- [ ] **Gate:** confirm pattern works before migrating more pages

**1d.2 — `/about` page**
- [ ] `src/routes/about/+page.svelte` — bio + edu + skills + languages + interests + contact
- [ ] Wire skills/edu/lang/contact components
- [ ] Browser-verify + light-mode + cross-breakpoint

**1d.3 — `/projects` page**
- [ ] `src/routes/projects/+page.svelte` — project cards + detailed cs-sections
- [ ] `src/lib/components/ProjectCard.svelte` — `.pcard` style
- [ ] `src/lib/components/CsSection.svelte` — case study wrapper
- [ ] `src/lib/components/NodeDiagram.svelte` — projects 5, 8
- [ ] `src/lib/components/Pipeline.svelte` — project 6
- [ ] `src/lib/components/PlatformGrid.svelte` — project 7
- [ ] `src/lib/components/BarChart.svelte` — project 1
- [ ] Browser-verify all 8 project sections

**1d.4 — `/roadmap` page**
- [ ] `src/routes/roadmap/+page.svelte` — timeline + topic cards + career cards
- [ ] `src/lib/components/RoadmapPage.svelte` — self-contained roadmap
- [ ] `src/lib/components/InternalNav.svelte` — in-page nav swap
- [ ] `src/lib/components/TimelineEntry.svelte`
- [ ] `src/lib/components/TopicCard.svelte`
- [ ] Browser-verify topbar morph animation

**1d.5 — `/` homepage (highest risk — last)**
- [ ] `src/routes/+page.svelte` — homepage with WidgetGrid
- [ ] Port all 12+ widgets from current grid
- [ ] Wire dynamic widgets (System Time clock, GitHub contribution grid)
- [ ] Hero section with portrait + intro

### 1e — Pre-cutover verification
- [ ] All 5 routes pass Svelte/TS strict-mode build
- [ ] All 5 routes render identical content to old HTML (visual diff at 1920px)
- [ ] All 5 routes render correctly at 320/400/560/860/1920px (both modes)
- [ ] All routes load with no console errors
- [ ] Lighthouse: Perf >90, A11y >95, Best Practices >95, SEO >95
- [ ] Bundle size <200kb per route (gzipped)
- [ ] Deployed to `/v2` subpath on Vercel, accessible for 1 week parity testing

### 1f — Cutover
- [ ] Day 0: Deploy SvelteKit to apex `vishalkatariya.dev/v2/*`
- [ ] Days 1-7: User reviews daily, reports regressions
- [ ] Day 7: Flip Vercel config to serve SvelteKit from apex
- [ ] Day 7+30: Keep old HTML archived in `archive/`
- [ ] Day 37: Delete old `portfolio-combined.html` from repo

### 1g — Site opening latency optimization (deferred per user)
**Goal:** cold load <200ms (currently ~400ms).
**Priority:** 1) Eliminate meta refresh redirect (save 200-300ms) 2) Cache-Control on HTML 3) preconnect/dns-prefetch 4) Minify HTML 5) Lazy-load SVG icons 6) Extract/minify CSS.
**Decisions needed:** Option A (move HTML to root) vs Option B (Vercel rewrites); update cadence; URL pattern change OK?

---

## Phase 2 — Public Routes

### 2a — Homepage (`/`)
- [ ] Port widget grid from portfolio-v4.html
- [ ] Add career timeline
- [ ] Add "now" widget

### 2b — Projects (`/projects`)
- [ ] Port project cards from projects.html
- [ ] Cards link to standalone apps (studio, buddy, TypeShift, orlon-bot, etc.)

### 2c — Roadmap (`/roadmap`)
- [ ] Port cs-roadmap.html as real route with clean topbar morph
- [ ] Self-contained RoadmapPage component
- [ ] Link from topbar and homepage widget

### 2d — About (`/about`)
- [ ] Port about.html content (bio, h_da education, skills, 4 languages, interests, contact)

---

## Phase 3 — `/me` Private Section
- [ ] Host `/me/*` on athena behind Tailscale (Caddy allowlist or bind to Tailscale IP)
- [x] Gating mechanism: Tailscale network-layer only (no page-level/client-side auth)
- [ ] `/me/vault` — identity vault
- [ ] `/me/docs` — integrate artifacts from notion-artifacts project
- [ ] `/me/notes` — future Notion workspace mirror (backlog)

### Tailscale gate reference
```caddy
me.auxois-wyrm.ts.net {
    @not_tailscale { not remote_ip 100.64.0.0/10 }
    respond @not_tailscale "Access denied — Tailscale required" 403
    reverse_proxy localhost:8900
}
```
Or bind upstream to Tailscale IP: `python3 -m http.server 8900 --bind "$(tailscale ip -4)"`

---

## Phase 4 — Deploy
- [ ] Vercel project connected to `vkkatariya/vkkatariya.github.io` — public routes only
- [ ] Custom domain: `vishalkatariya.dev`
- [ ] Private `/me/*` served from athena via Tailscale MagicDNS (`auxois-wyrm.ts.net`)
- [ ] GitHub Pages mirror configured (optional)
- [ ] Smoke test all public routes

---

## Backlog (unscheduled)
_(empty — all items moved to Phase 0)_