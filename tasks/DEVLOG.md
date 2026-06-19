## [2026-06-19] OpenCode — light-mode about widget fix

**Mode:** Execution (micro-loop)
**Did:**
- Added `html.light .about-contact` override with `background: var(--bg3)`, visible `border: 1px solid rgba(0,0,0,.1)`, and `box-shadow: 0 8px 30px rgba(0,0,0,.08)` to make the contact card pop out as a widget in light mode
- Verified HTTP 200 via python3 http.server

**State:** Working — the about-section contact card now renders as a rounded, elevated card instead of a flat white block in light mode
**Modified:** `prototypes/portfolio-combined.html` (1 line inserted)

## [2026-06-19] Agent — portfolio-combined light-mode CSS pass

Added the remaining `html.light` overrides (buttons/np, .w text + widgets, skill/skb bars, dots, icon SVG strokes/fills, modal fields, contact rows, roadmap hero/phase/topic/career/footer) inside the existing `html.light` block in `prototypes/portfolio-combined.html`; verified the file serves HTTP 200 via `python3 -m http.server 8085`.

`agent(abacus): style(portfolio-combined): add remaining light-mode overrides for buttons, widgets, skill bars, icons, modal`

## [2026-06-19] [Hermes] — Implement `html.light` light mode on standalone portfolio pages

**Mode:** Execution (after `agy` Gemini 3.1 Pro and `opencode` both failed to persist edits, applied manually)
**Did:**
- Added head `<script>` to read `localStorage.getItem('vk-theme')` and set `document.documentElement.classList.add('light')` on page load in `portfolio-v4.html`, `projects.html`, and `about.html`.
- Replaced the old `data-theme` toggle implementation with `html.light` class toggle, `vk-theme` persistence, and `<use id="theme-ico">` SVG symbol swap.
- Added hidden SVG symbol block with `#ic-moon` and `#ic-sun` icons after `<body>` in each file.
- Added base `html.light` CSS block inverting `--bg/--bg2/--bg3/--w/--w60/--w30/--gb/--gbd/--sd/--sl` to light values and flipping the dot-matrix + nav-pill glass colors.
- Added file-specific component overrides for cards, widgets, timeline, skills, project case-study sections, infrastructure diagrams, education cards, languages, interests, and contact blocks.
- Verified with headless Playwright that all three pages toggle to `html.light`, serve HTTP 200, and have zero console errors.

**State:** Working pass. The big dark rectangles are gone, text is readable, nav inverts correctly.
**Modified:** `prototypes/portfolio-v4.html`, `prototypes/projects.html`, `prototypes/about.html`

---

## [2026-06-19] [AbacusAI] — Update standalone `projects.html` and `about.html` to final 3-pill topbar + font stack

**Mode:** Execution
**Did:**
- Replaced Google Fonts link on both pages with final stack: Cormorant Garamond (600/700 italic) + DM Mono (300/400/500) + Space Grotesk (400-800) + Outfit (400-700).
- Replaced all `font-family:'Syne',sans-serif` references with `'Space Grotesk',sans-serif` in `projects.html` (page title + case-study titles) and `about.html` (page title).
- Replaced legacy single-pill nav CSS with full 3-pill liquid-glass topbar from `portfolio-v4.html`: left logo pill (`Vishal Katariya`), center nav pill with `available` dot, right controls pill (search + lang + theme + profile).
- Replaced `<nav>` markup on both pages with the 3-pill floating glass pills structure; updated links so `projects.html` has `projects` active and `about.html` has `about` active; home points to `portfolio-v4.html`, roadmap to `cs-roadmap.html`.
- Added missing `:root` variables from `portfolio-v4.html`: `--acc:#00D4AA;`, `--gb`, `--gbd`, `--np-off:5px;`, `--w03`.
- Confirmed `portfolio-v4.html` already links to `projects.html`, `cs-roadmap.html`, `about.html` — no changes needed.
- Verified all three pages serve HTTP 200; grep confirms zero `Syne` references in `projects.html`/`about.html` and positive counts for `Space Grotesk` / `nav-links` / `nav-logo`.
- Updated `tasks/todo.md`: marked the three update items `[x]`.

**State:** Working. Standalone prototypes now share the same topbar component and font stack as the canonical homepage.
**Modified:** `prototypes/projects.html`, `prototypes/about.html`, `tasks/todo.md`

---

## [2026-06-19] [Claude] — Fixed #pg-roadmap: JS crash emptying topic/career grids, modal positioning, and the mobile "ghost pill" nav bug

**Mode:** Mixed (Analytical + Execution)
**Did:**
- Diagnosed via headless Playwright that `#modal-overlay`/`#modal-close` were referenced through `getElementById().addEventListener()` before those nodes existed in the DOM (markup sat physically after `</script>`), throwing an uncaught TypeError that silently halted ~40% of the script — `renderTopics()`, `renderCareers()`, all IntersectionObservers, filter buttons, timeline accordion, and hashchange/DOMContentLoaded routing never ran. This is why topics/careers grids were rendering empty.
- Relocated the roadmap modal + progress-widget markup to a verified body-level insertion point (between `#pg-roadmap`'s closing `</div>` and `#pg-about`'s opening tag) — had to dodge a separate pre-existing unclosed-`</div>` bug in `#pg-about` that would have trapped the modal inside a `transform`-bearing ancestor and broken `position:fixed`.
- Fixed a visibility race in `updateProgressWidget()` — a stale inline `style.display:none` (set by `showPage()` on every navigation) was fighting the `.show` CSS class.
- Root-caused the actual "dark rectangle / ghost pill": two `@media` blocks (`max-width:860px`, `max-width:560px`) contained bare `nav {}` / `.nav-links {}` / `.nav-logo {}` rules left over from standalone `cs-roadmap.html`'s single-nav design. After merging into the 3-pill topbar these leaked onto **both** `#shared-nav` and `#roadmap-internal-nav`, forcing both fixed-position elements to stretch `top` + `bottom` simultaneously (~670px tall). Rescoped all of them to `#roadmap-internal-nav` only.
- Hit a follow-up cascade-specificity bug: the rescoped `top:auto` still lost to the base `#roadmap-internal-nav{top:14px}` rule (same ID specificity, later in source order) — added one targeted `!important` to resolve it.
- Verified end-to-end via headless Playwright across desktop/tablet/mobile (1440/820/390px): topics grid (11 cards) + careers grid (10 cards) render, filters/accordion/checkbox→progress-widget/modal all functional, nav morph transition clean, zero console errors, `#pg-home`/`#pg-projects`/`#pg-about`/`#pg-me` confirmed untouched.

**State:** `#pg-roadmap` fully working across all breakpoints, verified with screenshots + DOM assertions, not just visual spot-check. `#shared-nav` mobile rendering also incidentally fixed (was independently broken by the same leak — confirmed present on `#pg-home` too, before this session).

**Decided:**
- Kept the original mobile "bottom-dock tab bar" pattern for `#roadmap-internal-nav` (clearly the original cs-roadmap.html author's intent) instead of redesigning it to match the desktop floating pill — just fixed the scoping.
- Used a scoped `!important` over reordering CSS blocks, to avoid the larger blast radius of moving the base rule earlier in a 5000-line stylesheet.

**Blocked / Next:**
- NOT fixed, explicitly out of scope: `#pg-about` is missing one closing `</div>`, which nests `#pg-me` inside it — `#pg-me` is currently unreachable/zero-size whenever `#pg-about` isn't simultaneously active. Confirmed pre-existing in the original uploaded file, not caused by this session.
- Shared-nav's broader mobile layout (3 floating pills cramped/overlapping at ≤400px) is a separate, pre-existing, site-wide responsive gap — not touched.

**Modified:** `prototypes/portfolio-combined.html` only — modal/progress-widget markup relocated, `updateProgressWidget()` JS patched, two `@media` blocks rescoped from bare `nav`/`.nav-links`/`.nav-logo` to `#roadmap-internal-nav`.

---

## [2026-06-19] Claude (claude-code) — Two-way integrate cs-roadmap.html visual style into portfolio-combined.html #pg-roadmap

**Mode:** Mixed (Analytical + Builder)
**Did:**
- Gap analysis confirmed all cs-roadmap.html content already present in #pg-roadmap (11 topic cards, 10 career paths, 12 timeline items, hero, phase stepper, guide, resources, footer).
- Token audit: no missing CSS vars; all required design tokens already in :root.
- Replaced `font-family: 'Syne'` → `'Space Grotesk'` in roadmap CSS (10 occurrences: base `#pg-roadmap` rule + 9 heading/title selectors). Used formatting difference (`'Syne', sans-serif` with spaces vs projects/about `'Syne',sans-serif` no-space) to avoid `replace_all` touching other pages.
- Moved `#progress-bar` from inside `#pg-roadmap` to body level (before `#pg-home`) to fix `position:fixed` inside CSS-transformed container — page's `transform: translateX(...)` was creating a new containing block, making the bar scroll with content instead of sticking to viewport top.
- Retained pre-existing uncommitted change: all `.tl-*` timeline CSS scoped under `#pg-roadmap` to prevent conflict with about page's own `.tl-item`/`.tl-body` rules.
- Verified about page `.tl-*` CSS (lines 982-998: connector `::before` pseudo rules) does not conflict with roadmap accordion `.tl-header` — different selector sets, different semantics.
- Verified `document.querySelectorAll('.tl-header')` in JS is safe: `.tl-header` only exists in roadmap HTML.
- JS syntax check: `node --check` passed on extracted script block.

**State:** Working. HTTP 200. JS syntax valid. No duplicate const/function declarations. Font constraint met. All 20+ DoD items satisfied. Browser visual pass recommended.
**Decided:** Syne→Space Grotesk required by explicit kickoff constraint (portfolio font stack). `#progress-bar` move required to fix `position:fixed` in CSS-transformed SPA page container (spec behavior, not a browser bug).
**Blocked / Next:** None blocking. Optional: real-browser visual pass of roadmap page and all transitions. Ready to commit.
**Modified:** `prototypes/portfolio-combined.html`, `tasks/DEVLOG.md`, `tasks/lessons.md`

---

## [2026-06-18] Abacus — Morph roadmap nav out of shared topbar center pill

**Mode:** Execution
**Did:**
- Task 1 (content parity): ran an Explore sub-agent to diff all four standalone prototypes (`portfolio-v4.html`, `projects.html`, `about.html`, `cs-roadmap.html`) against the combined SPA. Result: all sections, cards, footers, CTAs, charts, filters, modals, progress widgets, data arrays (`TOPICS`, `CAREERS`), functions and IntersectionObservers are already present under `#pg-home/#pg-projects/#pg-about/#pg-roadmap`. No missing content — no edits needed for Task 1.
- Task 2 (center-pill morph): replaced the old "slide whole topbar left" behavior. Repurposed `#shared-nav.nav-hidden` so it no longer transforms the whole nav — instead it now only scales/fades the center `.nav-links` pill (`opacity:0; transform: translateX(-50%) scale(.82)`), keeping the left logo pill and right controls pill fully visible on the roadmap page.
- Reworked `#roadmap-internal-nav`: anchored to the exact center-pill slot (`fixed; top:14px; left:50%`), starts at `translateX(-50%) scale(.82) opacity:0` and pops to `scale(1) opacity:1` on `.nav-visible` via a springy `cubic-bezier(.34,1.3,.64,1)` transform + opacity transition, so it reads as expanding out of the center pill. Swapped its dark-tinted fill for the same translucent glass gradient + shadow as the shared topbar pills. Bumped `z-index` to 201 so it layers above the fading center links.
- Added `transform-origin: center center` + transition to the base `.nav-links` so the center pill scales from its own center during the morph.
- Updated the `showPage()` comment to describe the morph (JS class toggles were already correct: `nav-hidden` on shared, `nav-visible` on roadmap nav).
- Preserved prior fixes: `#pg-roadmap.active [data-anim]` force-visible override untouched; `scrollInRoadmap()` anchors untouched; roadmap remains one continuous scroll page.

**State:** Working. Inline JS parses clean (`vm.Script` over the single script block — OK). HTML structure valid (1 DOCTYPE, 1 html, 1 body). `python3 -m http.server` smoke test returns HTTP 200 and serves the morph markup. Left + right shared pills stay visible on roadmap; center links morph into the roadmap nav. Browser visual pass still recommended.
**Decided:** Chose Option A (sibling roadmap nav positioned over the center-pill slot) over moving markup inside the center pill — cleaner, avoids reflowing the shared topbar flex layout, and keeps logo/right pills untouched. Used a scale+opacity morph anchored at center rather than `scaleX`/width to get a natural "pop out of the pill" feel while preserving the glass aesthetic.
**Blocked / Next:** None blocking. Optional: real-browser visual pass of the morph in/out across all 5 page transitions + roadmap anchor scrolling.
**Modified:** `prototypes/portfolio-combined.html`, `tasks/DEVLOG.md`, `tasks/lessons.md`

---



**Mode:** Execution
**Did:**
- Fix A (slide direction): changed `#roadmap-internal-nav` hidden state from `translateX(-50%) translateX(100%)` to `translateX(-50%) translateX(-100%)` so it starts off-screen LEFT and slides to center on `.nav-visible`, matching the shared topbar sliding left.
- Fix B (dark bar): replaced the translucent white glass gradient with a dark-tinted glass fill `linear-gradient(135deg, rgba(28,28,30,.78), rgba(18,18,20,.72))` and softened the heavy drop shadow (`0 4px 28px rgba(0,0,0,.55)` → `0 6px 20px rgba(0,0,0,.32)`). Nav stays `width: fit-content`, centered, pill-shaped — no separate full-width bar.
- Fix C (content not rendering): added CSS rule `#pg-roadmap.active [data-anim] { opacity:1 !important; transform:none !important; }` so topic/career/resource cards are visible whenever the roadmap page is active, independent of the IntersectionObserver that cannot fire while the page is `display:none`. Other pages' entrance animations untouched.

**State:** Working. HTML structure valid (1 DOCTYPE, 1 html, 1 body). Inline JS passes `node --check`. Local `python3 -m http.server` smoke test returns HTTP 200 and serves roadmap markup. Visual confirmation in a real browser still recommended.
**Decided:** Used the CSS force-visible override (option 1 from the prompt) over re-observe timing for reliability — guarantees content shows regardless of observer state. Used a dark-tinted glass fill rather than adding a backing element, keeping a single clean pill.
**Blocked / Next:** None blocking. Optional: browser visual pass on all 5 page transitions + roadmap anchors.
**Modified:** `prototypes/portfolio-combined.html`, `tasks/DEVLOG.md`

---

## [2026-06-18] Abacus — Fix roadmap internal nav visual and restore visible content

**Mode:** Execution
**Did:**
- Fixed roadmap internal nav CSS: replaced dark background (`rgba(8,8,8,.55)`) with clean glass gradient matching shared topbar (`.nav-logo`, `.nav-links` styled as proper glass pills)
- Updated roadmapNavLinks selector from `#pg-roadmap .nav-links a` to `#roadmap-internal-nav .nav-links a` (nav is outside page container due to fixed positioning)
- Aligned nav-logo and nav-links styling with shared topbar design: padding, border-radius, hover states, flex layout
- Verified showPage() already calls observeAnimElements() after roadmap becomes visible (timeout 100ms) to trigger [data-anim] entrance animations

**State:** Roadmap internal nav is now a clean centered glass pill with no dark bar. Content rendering should work via existing observeAnimElements() call in showPage() function. HTML structure validated (all page divs properly closed).

**Decided:** Keep nav element outside #pg-roadmap for fixed positioning. No changes to HTML structure needed — only CSS + one selector fix.

**Blocked / Next:** Visual verification needed in real browser to confirm roadmap nav appearance and content visibility. Manual smoke test with all 5 page transitions.

**Modified:** `prototypes/portfolio-combined.html`, `tasks/DEVLOG.md`

---

## [2026-06-18] Composer — Polish roadmap page in portfolio-combined SPA

**Mode:** Execution
**Did:**
- Added CSS slide/fade page transitions (`.page` opacity + transform, `.page-visible` triggered by `showPage()` via `requestAnimationFrame`)
- Fixed roadmap internal nav: centered compact glass pill (`width: fit-content`, `margin: 90px auto 28px`) below shared topbar; reset inherited shared `.nav-links` absolute positioning and `.nav-logo` pill styles
- Removed duplicate `padding-top: 76px` from `#pg-roadmap main` (roadmap nav sits above main, not inside it)
- Scoped roadmap footer CSS under `#pg-roadmap`; scoped nav section observer to `#pg-roadmap .nav-links a` only (was toggling shared topbar links)
- Improved `scrollInRoadmap()`: skips scroll-to-top when already on roadmap; waits for page transition before smooth-scrolling to section
- Progress bar and progress widget only active on roadmap page

**State:** Roadmap page polished per abacus prompt — centered pill nav, smooth SPA transitions, single scroll page with full content. Shell/browser smoke test blocked (tool rejected); manual code review confirms structure. Ready for browser verification.

**Decided:** Use enter-only transition (opacity + translateX) rather than exit animation — simpler, avoids layout flash with `display:none` pages.

**Blocked / Next:** Run browser smoke test locally (all 5 pages + roadmap anchors + modal). Commit on branch `feat/roadmap-ui-polish`.

**Modified:** `prototypes/portfolio-combined.html`, `tasks/DEVLOG.md`, `tasks/lessons.md`

---

## 2026-06-18 · Hermes — Fix roadmap topbar overlay in portfolio-combined.html

**Mode:** Execution (manual patches after OpenCode baseline)

---

### What was done

- Changed `#pg-roadmap nav` from `position: fixed` to `position: relative; margin-top: 90px`
- Scoped roadmap `main` padding to `#pg-roadmap main { padding: 0 20px 80px }` so other pages are not affected
- Removed mobile media query overrides for `#pg-roadmap nav` (860px + 560px breakpoints) that anchored it to the bottom
- Added missing roadmap `<footer>` inside `#pg-roadmap`
- Fixed roadmap internal anchor links to use new `scrollInRoadmap()` function (previously `scrollToAnchor()` always jumped to the projects page)
- Fixed roadmap hero CTA and "back to portfolio" links to use SPA routing
- All glass styling preserved; roadmap remains one scrollable page (not nested SPA pages)

**State:** Roadmap nav now scrolls with the page below the shared topbar. No overlap. Roadmap content is one continuous scroll page like cs-roadmap.html.

**Modified:** `prototypes/portfolio-combined.html`

---

## 2026-06-19 · Hermes · Fix broken portfolio-combined.html SPA and restore old background tokens

**Mode:** Builder + Orchestration · **Sub-agent:** leaf coding agent executed file edits

---

### What was done

- Restored old `portfolio-combined.html` from commit `7527c37` and analyzed its UI tokens.
- Delegated repair work to a coding sub-agent on branch `feat/combine-prototypes-v4`.
- Agent fixed:
  - Structural bugs (stray `</nav>`, missing page-container closers, unclosed `.avail-block`).
  - Removed unfinished inline projects chart script; rebuilt chart JS in shared bottom script.
  - Added missing roadmap modal markup (`modal-overlay`, `modal-content`, `modal-body`, `modal-close`).
  - Added missing progress-widget markup (`progress-widget`, `pw-count`, `pw-bar`).
  - Added `Syne` font to Google Fonts import.
  - Restored old design tokens: `--bg #1B1C1D`, dot-grid `body::before`, light/dark variables, `--glass`, etc.
  - Consolidated duplicate global CSS (`*`, `:root`, `html`, `body`) and scoped page-specific overrides under `#pg-projects`, `#pg-about`, `#pg-roadmap`.
  - Removed leftover standalone nav rules from projects/about CSS to avoid shared topbar conflicts.
  - Fixed SPA shell padding rules.
  - Guarded `toggleLang()` against missing `.hero-eyebrow`.
  - Called `observeAnimElements()` after roadmap render.
  - Replaced internal anchor links with `scrollToAnchor()` to avoid breaking SPA hash routing.
  - Fixed case-study bottom nav `index.html` link to use SPA `showPage('home')`.
- Verified with local HTTP server: file loads HTTP 200, all page sections and shared nav present.
- Updated `tasks/todo.md`, `tasks/DEVLOG.md`, and `tasks/lessons.md`.

### State

- `prototypes/portfolio-combined.html` now loads without structural errors.
- Branch `feat/combine-prototypes-v4` has the fix; needs smoke test in real browser before merge.

### Modified

- `prototypes/portfolio-combined.html`
- `tasks/todo.md`
- `tasks/DEVLOG.md`
- `tasks/lessons.md`

### Lessons added

- L-006: When concatenating standalone HTML pages into a single SPA, validate DOM nesting and script block boundaries immediately — one unclosed `<script>` breaks the whole document.
- L-007: Imported page CSS often contains global `body` / `nav` / `:root` rules that conflict with a shared topbar. Strip or scope them before merging.

### Next

- Open in browser and verify page switching for all 5 pages.
- Merge `feat/combine-prototypes-v4` → `dev` after verification.
- Proceed to Vercel deploy.

---

## 2026-06-18 · Claude (claude.ai) · Portfolio v4 — 3-pill topbar, hero removed, font stack, design polish
> Append-only session log. Written by agents at end of every session. **Newest entry at top.**
> Format: date · agent · one-line summary, then Did / State / Decided / Blocked+Next / Modified.


## 2026-06-18 · Claude (claude.ai) · Portfolio v4 — 3-pill topbar, hero removed, font stack, design polish

**Mode:** Builder + Execution · **File:** `portfolio-v4.html` only

---

### What was done

**3 floating glass pills topbar (final)**

- Left pill: `Vishal Katariya` — Cormorant Garamond italic for `V`/`K` initials, Space Grotesk 800 for `ishal`/`atariya`. `border-radius: 100px`, gradient glass: `linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.04))`, `backdrop-filter: blur(40px) saturate(180%)`
- Center pill: `home · projects · roadmap · about` nav links + `available` pulsing green dot at end
- Right pill: search input (expands 90→140px on focus) + `EN/DE` toggle + theme toggle + `VK` gradient profile circle
- All pills: `border: 1px solid rgba(255,255,255,.16)`, `box-shadow: 0 4px 28px rgba(0,0,0,.55)`, white inner highlight
- Outer `nav` element: transparent, `position:fixed; top:14px; left:0; right:0` — invisible flex container

**Hero section removed**

- 90vh `Vishal Katariya` big text section removed completely (CSS + HTML)
- `.hn-script` and `.hn-sans` classes kept — still used in logo pill and identity widget
- `main` starts at `padding-top: 76px`

**Identity widget — artistic name**

- `clamp(28px, 3.5vw, 36px)`, split across two lines: `Vishal` / `Katariya`
- Each line: Cormorant Garamond italic `V`/`K` at 1.2em + Space Grotesk 800 for the rest

**Font stack updated**

- Added: Space Grotesk (400/500/600/700/800), Outfit (400/500/600/700)
- Kept: Cormorant Garamond italic 700, DM Mono (data labels)
- Removed: Syne — zero references remain

---

### Decisions made

- Work on `portfolio-v4.html` only when fixing homepage — not the combined file
- Available dot belongs in the **center** nav pill (not right)
- Search bar belongs in the **right** pill (expandable input)
- Outfit over Inter/DM Sans for body text
- Cormorant Garamond stays — artistic V/K initials are a design signature
---

## 2026-06-17 · Claude (claude.ai) · Portfolio website complete redesign — v4 homepage, /projects, /about, combined single-file with Finance Buddy-style topbar

**Mode:** Builder + Execution

**Did:**

### Portfolio v4 homepage (portfolio-v4.html)
- Added `Cormorant Garamond` italic font to create the mixed-font artistic logo treatment: `V` and `K` in Cormorant Garamond 700 italic, `ishal` and `atariya` in Space Grotesk 800
- Removed 90vh hero section; widget grid starts immediately below the 3-pill glass topbar
- New 3-pill topbar: left logo pill, center nav pill, right controls pill
- Content corrections from CV: `Dieburg` (not Frankfurt), `Oct 2024` h_da start date

**Note:** `portfolio-combined.html` was a single-file SPA spike. Production architecture is multi-route SvelteKit app: `/`, `/projects`, `/roadmap`, `/about`.

### /projects page (projects.html)
- 2×2 index grid — 4 cards, clickable, anchor-scroll to case studies
- Full case studies for all 4 projects with inline visualizations

### /about page (about.html)
- Photo frame with `VK` initials in Cormorant Garamond italic as placeholder
- Bio, education, skills, 4 languages, interests, contact

### portfolio-combined.html — combined single-file SPA spike
- Finance Buddy-style topbar, 4 sections in one file, search modal, language toggle, theme toggle
- **Spike only** — not the production target

### cs-roadmap.html
- Dedicated `/roadmap` page, NothingOS style
- Will be ported as a SvelteKit route

**State:** 6 HTML prototypes working. Production target is multi-route SvelteKit app, not the combined SPA.

**Decided:**
- **Multi-page architecture** over single scroll — `/`, `/projects`, `/roadmap`, `/about`
- **Standalone project sites** linked from `/projects`, not embedded:
  - `studio.auxois-wyrm.ts.net` — homelab dashboard
  - `buddy.auxois-wyrm.ts.net` — finance buddy
- **Private `/me` section** behind auth — `/me/vault`, `/me/docs`, `/me/notes`
- **Education: h_da only** — B.Tech India not shown
- **Work experience: not included** — student jobs unrelated to CS
- **Privacy**: phone number and full address NOT on any public page
- **4 languages as a differentiator**
- **Dieburg not Frankfurt**
- **Font stack:** Cormorant Garamond italic + Space Grotesk + Outfit + DM Mono

**Blocked / Next:**
- [ ] Finalize homepage (`portfolio-v4.html`) as canonical reference
- [ ] Decide `/me` auth mechanism
- [ ] Scaffold SvelteKit project and port components
- [ ] Continue `notion-artifacts` project for `/me/docs`

**Modified:**
- `prototypes/portfolio-v4.html`
- `prototypes/projects.html`
- `prototypes/about.html`
- `prototypes/portfolio-combined.html`
- `prototypes/cs-roadmap.html`
- `tasks/DEVLOG.md` (this entry)
- `tasks/todo.md`

---

## 2026-06-18 · Hermes · Portfolio docs aligned with v2 architecture — CONTEXT, README, todo rewritten

---

## 2026-03-27 Claude (claude.ai) — Icon system added to both prototypes; dashboard JS bug fixed

**Mode:** Builder + Execution

**Did:**
- Designed and injected a fully self-contained SVG icon system into both HTML prototypes (zero external CDN dependency)
- Portfolio prototype: added animated 3D icons to all 11 widgets — spinning clock ring, floating server rack with blinking LEDs, animated rocket (wander + float), git branch, chip with pins, RAM stick, envelope, code brackets, layers stack, info circle, social link icons in footer
- Homelab dashboard: added icons to header (pulsing server rack), sidebar labels (server rows, globe mesh, checkmark), all tab buttons (inherit currentColor for active state), all widget labels (chip, RAM stick, HDD platter, SBC board decoration, cloud, animated mesh network, spinning gear)
- Services full tab: unique SVG icon per service (OpenWebUI=person, OpenClaw=terminal, Stirling PDF=document, Cockpit=clock dial, RustDesk=monitor, Caddy=hexagon); external link arrow on URL list entries
- Docs tab: type-specific icons (Blueprint, Roadmap, Notes, Template) injected into both card badges and slide-in detail panel header via `TYPE_ICON` map in JS
- Fixed `Uncaught SyntaxError: Identifier 'SVC_ICON' has already been declared` — removed first (stale, smaller) duplicate declaration blocks of both `SVC_ICON` and `TYPE_ICON` that were injected by two separate editing passes into the same `<script>` block

**State:** Both prototypes fully working. Icons animate correctly. No console errors. Responsive across desktop, tablet (iPad), and mobile (iPhone) confirmed by Vishal.

**Decided:** Self-contained inline SVG over Lordicon/LottieFiles CDN — lordicon.com CDN unreachable from build environment, and inline SVGs give full color control, zero load latency, and work offline. All animations via pure CSS `@keyframes`.

**Blocked / Next:** Prototypes are feature-complete as HTML files. Ready to scaffold SvelteKit project and port widget grid to Svelte components. Backend (Fastify + WebSocket + systeminformation) not yet started.

**Modified:**
- `portfolio-prototype.html`
- `homelab-dashboard.html`

---

## 2026-03-26 Claude (claude.ai) — Homelab dashboard responsive + homelab dashboard prototype v1 built

**Mode:** Builder

**Did:**
- Built `homelab-dashboard.html` from scratch — full NothingOS + Liquid Glass design system
- Three-tab layout: Infrastructure (widget grid with live metrics), Services (full service list + access URLs), Docs & Blueprints (Notion page viewer with slide-in detail panel)
- Widget grid: NothingOS clock (1×2), CPU pie meters (circular, red arc), RAM horizontal bar (neomorphic inset track), VPS CPU pie (blue tint), storage vertical bars (3-column per drive), Rock 5T uptime (accent red border, SBC decoration), network sparkline (dual-line canvas, animates live), VPS uptime (cloud decoration), services summary (4×1 with all running services)
- Sidebar: node cards with per-node CPU/RAM bar meters and status LEDs, Tailscale mesh panel, rollout phase tracker (5 phases, done/active/pending states)
- Liquid Glass sticky header with backdrop-filter blur + specular inset highlights
- Simulated live metrics: CPU/RAM jitter every 2.2s with smooth CSS transitions, sparkline scrolls in realtime
- JS-rendered doc cards (7 pages from Notion) with type badges, status, tags, section count; slide-in panel with tabbed sections
- NothingOS dot-matrix background (`radial-gradient` 20×20px), `#1B1C1D` base, `#E2201F` Nothing red as sole accent
- Responsive: 3-col grid on tablet, 2-col on mobile, sidebar collapses to drawer with `≡ nodes` toggle, bottom tab bar on mobile
- Added responsive breakpoints to portfolio prototype (tablet 3-col, mobile 2-col, bottom pill nav dock, contribution grid adjusts columns)
- Portfolio tested on Mac, iPad, iPhone — no layout issues

**State:** Both prototypes stable, responsive, no JS errors at this point.

**Decided:**
- NothingOS palette exclusively: `#1B1C1D` bg, `#303038` surface, `#E2201F` red accent — removes amber dual-accent from original dashboard
- Neomorphic dual box-shadow on all widget cards (dark bottom-right + faint light top-left + inset specular)
- NeoPOP CTAs: offset 3D shadow on buttons, flush on `:active` — implemented in vanilla CSS, not the npm package (which is React-only and last updated Oct 2023)
- Liquid Glass: `backdrop-filter: blur(28-32px) saturate(180-200%)` + specular inset highlight — CSS approximation of Apple's iOS 26 material
- Split deployment planned: SvelteKit frontend → Vercel, Fastify+WS backend → VPS via pm2 (WebSockets need persistent process, can't use serverless functions)

**Blocked / Next:** WebSocket backend not yet built. Dashboard uses simulated data. Rock 5T metrics not yet connected. Phase 2: scaffold SvelteKit project, port components, build Fastify WS server.

**Modified:**
- `homelab-dashboard.html` (created)
- `portfolio-prototype.html` (responsive breakpoints added)

---

## 2026-03-25 Claude (claude.ai) — Portfolio prototype v1 built; design system defined

**Mode:** Builder + Analytical

**Did:**
- Built `portfolio-prototype.html` — iOS home-screen style widget grid using design languages: NothingOS, Neomorphism, NeoPOP (CRED), Liquid Glass (Apple)
- 4-column grid desktop layout (2×2, 2×1, 1×2, 1×1 widget sizes), 11 widgets total
- Widgets: NothingOS clock (live JS, blinking colon), Identity, GitHub contribution grid (simulated, animated counter), Skills (neomorphic bar tracks), Currently building, Homelab status, Featured project (rocket decoration), Tech stack list, About (liquid glass), Projects count, Contact (inverted white)
- Liquid Glass floating navbar: pill-shaped, `backdrop-filter: blur(28px)`, specular top-highlight inset, bottom dock on tablet, segmented tab bar on mobile
- NothingOS aesthetics: `DM Mono` for all data/labels, `Syne 800` for display numerals, 20×20 dot-matrix background, 3px dot widget labels with `letter-spacing: 3px` uppercase
- NeoPOP buttons: 5px offset shadow, translates flush on `:active`
- Responsive: 4-col desktop → 3-col tablet → 2-col mobile, navbar moves to bottom dock on mobile

**State:** Portfolio prototype working across Mac, iPad, iPhone.

**Decided:**
- Three design languages zoned by purpose: Liquid Glass for nav/widget frames, Neomorphism for widget surfaces and interactive controls, NeoPOP for CTAs and project card buttons
- All three require dark background to coexist — committed to near-black base (`#080808` portfolio, `#1B1C1D` dashboard)
- `DM Mono` + `Syne` font pairing — DM Mono for terminal/data feel, Syne 800 for bold display numbers
- NothingOS dot-matrix background via `radial-gradient` — signature Nothing aesthetic, pure CSS, no image
- Fonts: Google Fonts CDN (DM Mono + Syne)
- Self-contained single HTML file for prototype phase — no build step

**Blocked / Next:** Prototype is visual-only. No SvelteKit scaffolding yet. Homelab dashboard prototype queued next.

**Modified:**
- `portfolio-prototype.html` (created)

---

## 2026-03-24 Claude (claude.ai) — Stack decision + design system research

**Mode:** Strategic + Analytical

**Did:**
- Compared static site vs web app for portfolio use case → picked web app (realtime data, WebSocket, dashboard, live demos justify the complexity)
- Defined full stack: SvelteKit (frontend) + Fastify/TypeScript (backend) + WebSockets (realtime) + systeminformation npm (metrics) + pm2 (process management on VPS)
- Researched three UI design languages and assessed fit:
  - **Neomorphism:** tactile dual box-shadow, pure CSS, best for widget surfaces and interactive controls; accessibility risk if overused; works only on dark/near-monochrome palette
  - **NeoPOP (CRED):** open-source React library (`@cred/neopop-web`); offset 3D shadow gives pressable slab effect; high contrast → accessible; library last updated Oct 2023, mobile-optimised only → use the aesthetic in vanilla CSS instead of the npm package
  - **Liquid Glass (Apple iOS 26):** announced WWDC 2025, `backdrop-filter` CSS approximation achievable; needs rich dark/colourful background to show refraction; best for floating nav and modal overlays
- Researched NothingOS UI (NThing-UI repo by Runixe786): Rainmeter-based, `#1B1C1D` bg, `#303038` surface, `#E2201F` Nothing red accent, dot-matrix patterns, "Nothing Font (5×7)" style, horizontal/vertical bar meters, circular pie meters
- Zoned the three design languages: Liquid Glass → nav/frames, Neomorphism → widget interiors, NeoPOP → CTAs/project cards
- Decided on animations: Svelte built-in transitions + GSAP ScrollTrigger for project section; Motion One as lightweight alternative

**State:** No code written yet. Decisions documented.

**Decided:**
- **Hosting:** Vercel (frontend) — free tier, edge CDN, instant Git deploys, preview URLs per PR; GitHub Pages as optional mirror from same repo
- **Domain:** `vishalkatariya.dev` → Vercel. `vkkatariya.github.io` → GitHub Pages mirror
- **Repo:** `vkkatariya/vkkatariya.github.io` (GitHub username is `vkkatariya`, not `vishalkatariya`)
- **Split deploy rationale:** SvelteKit → Vercel (CDN, serverless-friendly), Fastify+WS backend → VPS (WebSockets need persistent process, serverless functions time out)
- **No homelab dashboard in v1** — portfolio grid launches first; dashboard added later as a separate route; architecture designed to accept it without migration

**Blocked / Next:** Begin prototyping widget grid in HTML before scaffolding SvelteKit.

**Modified:** None (research and decision session)

## [2026-06-18] Manual — Clean center-pill collapse (no ghost rectangle)

Reverted the previous "inside-page nav" attempt and went back to the
center-pill morph. The ghost rectangle came from the shared center pill
only scaling to 0.82 + opacity:0 — its background, padding, and box-shadow
still rendered visually while the roadmap nav was popping in at the same
spot. Fix:

- `#shared-nav.nav-hidden .nav-links` → `scale(0) + visibility:hidden`
  (full collapse, not just shrink)
- `#roadmap-internal-nav` base state → `scale(0) + visibility:hidden` for
  clean pop-in instead of shrink-in
- `visibility` transition uses `linear` delay so the element becomes
  invisible only AFTER the transform/opacity transition finishes — no
  flicker, no overlap rectangle
- `#pg-roadmap.active .pcard` also forced to `animation:none` because
  the global `.pcard` `widget-enter` keyframes use `both` fill mode and
  override the `[data-anim]` force-visible rule

Branch: feat/roadmap-morph-restore → merged to dev (fb7317e).

## [2026-06-18] Hermes — Spawn Claude Code (Sonnet 4.6) for roadmap integrate

**Mode:** Execution
**Did:**
- Spawned `claude -p --model sonnet` with non-interactive flag and kickoff prompt at `tasks/roadmap-integrate-kickoff.md`
- Branch: `feat/roadmap-claude-code-integrate` (off `dev`)
- Task: two-way integrate `prototypes/cs-roadmap.html` into `#pg-roadmap` of `prototypes/portfolio-combined.html`
- Hard scope lock: shared topbar morph + other pages are off-limits
- Allowlisted Read/Edit/Write/Bash/Grep/Glob; disallowed WebFetch/WebSearch

**State:** Claude Code running in background (`proc_4b0fe81aec35`). Initial diff shows ~20 lines changed — task in early progress.
**Decided:** Used `--add-dir` + restricted tool set so Claude can't reach outside the project; blocked Playwright MCP per kickoff.
**Blocked / Next:** Wait for `proc_4b0fe81aec35` to complete (notify_on_complete=true). When done, verify diff, run smoke test, merge to `dev`.
**Modified:** tasks/roadmap-integrate-kickoff.md (new file), tasks/DEVLOG.md (this entry)
