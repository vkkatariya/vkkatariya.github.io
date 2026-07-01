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
- [x] **Remove NDOT font entirely** (2026-06-27): user feedback after public deploy — the dot-matrix NothingOS aesthetic didn't suit the deployed site. Removed `Ndot55-Regular.otf` + `Ndot55Caps-Regular.otf`, deleted both `@font-face` blocks in portfolio-combined.html and resume.html, repointed `--font-ndot: 'Space Grotesk', sans-serif` (all 29 selectors cascade automatically), updated `.wm-cap` + visible `/projects` paragraph copy + `index.html` root splash. Branch `feat/remove-ndot-font` (this commit).
  - [x] Phase 1 SvelteKit should NOT re-vendor NDOT — drop `--font-ndot` from Phase 1c tokens list (todo.md line 164, 166)
- [x] Expand NDOT accent font usage
  - [x] Branch 4 `feat/ndot-topbar-rollout`: apply var(--font-ndot) to all topbar text (nav links, logo, search, lang, theme, profile) + bump topbar font-size. Keep Space Grotesk for body/headings. Accent-only scope. Confirmed 2026-06-20.
  - [x] Branch 5 `feat/ndot-widget-titles` + merged into `feat/ndot-titles-and-right-pill`: NDOT to 5 accent selectors (.pcard-title, .topic-name, .career-title, .cs-title, .filter-btn) + Branch 6 right pill fully rounded + stronger liquid glass (blur 56px, saturate 200%, light-mode override). 2026-06-20.
  - [x] Branch 7 `feat/ndot-proj-title`: post-Branch-5 audit caught 4 more accent title selectors using old font (.proj-title on homepage featured project, .feat-title on case-study modal sections, .int-title on about page interests, .pi-title on /projects index cards). All swapped to var(--font-ndot). Lesson L-026 added: always full selector audit before declaring a pattern rollout complete. 2026-06-20.
  - [ ] Branch 8 (deferred): NDOT to .tl-title? Mixed semantic context (22 occurrences across timeline entries + roadmap topic titles) — needs separate decision.
  - [x] Branch 1 `feat/vendor-ndot-font`: pull NDOT .woff2 from GitHub mirror, declare @font-face, add assets/fonts/README.md with source attribution
  - [x] Branch 2 `fix/dm-mono-readability`: bump font-size ≥11px, add letter-spacing 0.5px, swap UI labels to JetBrains Mono, restrict DM Mono to true monospace contexts
  - [x] Branch 3 `feat/ndot-display-accent` (depends on #1): use NDOT in 5 NothingOS-accent spots (.pcard-num, .cs-number, .lbl/.lbl-inv, .skill-n, .clock-h/m). Keep Space Grotesk for body/titles/buttons. Syne stays for hero titles.
  - Strategy: sequential — vendor must complete first, then DM Mono + NDOT display can run parallel. Confirmed with user 2026-06-20.
  - NOTE: Branches 1+2 were done inline (not via coding agent) because delegate_task subagent dispatch failed 3× with 'nemotron model 404' on the prior session. Branch 3 was dispatched to opencode after gateway restart; the agent completed file edits but ran out of tool budget before commit/push, so I finished the commit + browser verification + DEVLOG entry inline. Future agent dispatches are working.
- [x] Redesign top-right nav pill: fully rounded + liquid glass effect — done as part of Branch 5/6 (right pill is fully rounded 100px, blur 56px, saturate 200%, light-mode override)
la-Cormorant Bold Italic wordmark redo (all 5 occurrences) and Roadmap title restructure (Syme/Cormorant hybrid). 2026-06-20.Merged to dev.
- [x] Roadmap page header — match Projects/About aesthetic (`.ph` wrapper + `vkkatariya · roadmap` kicker + mixed Cormorant/Syne "Roadmap" title). Branch `feat/roadmap-header-matches-aesthetic` → dev @ 9583722. 2026-06-20. First attempt (opencode) only swapped markup but title rendered small (`.hero h1` specificity 0,1,1 overrode `.ph-title` 0,1,0). Second attempt (claude) restructured to `.ph` wrapper like Projects/About — resolves specificity, title now renders at full Syne 800 clamp(48px,8vw,96px). Follow-up fix (inline): scoped `#pg-roadmap .ph-title` margin-bottom 56px→24px, `#pg-roadmap .ph-sub` font-size 15px, `#pg-roadmap .ph` padding-bottom 0, `#pg-roadmap .hero` padding-top 20px — compacted subtitle-to-badges gap from 140px→~20px. User confirmed "its fixed now".
- [x] Timeline fonts bigger — `.tl-title` now NDOT 700 clamp(18-22px), `.tl-desc` 15px JetBrains Mono, `.tl-year` 14px DM Mono, `.tl-badge` 13px JetBrains Mono. Branch `feat/timeline-fonts-bigger` → dev (this merge). 2026-06-20. Three attempts: v1 (agy) Space Grotesk 17-20px rejected as too small, v2 (codex) NDOT 800 42-80px rejected as way too big for one-line entries, v3 (hermes inline) NDOT 700 18-22px — user confirmed.
- [x] Timeline font size polish — user found sizes slightly too big after review; nudged down 2px each: `.tl-title` clamp(16-20px), `.tl-desc` 13px, `.tl-year` 12px, `.tl-badge` 11px. Branch `feat/cv-pdf` inline. 2026-06-21.
- [x] Apply topbar liquid-glass effect to all widgets on all pages — Homepage 16, Projects 11, Roadmap 38 (excl. timeline), About 19, /me 1. Branch `feat/widget-liquid-glass` → dev @ 9da6079. 2026-06-20. Use left/center pill formula: blur 40px saturate 180%, border rgba(255,255,255,.16). Follow-up fixes (inline): made `.w.inv` contact widget and `.about-section` outer block use the same glass surface as other widgets.

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
- [x] Generate CV/resume PDF from About + Projects content using Playwright + Chromium. Branch `feat/cv-pdf` → dev. 2026-06-21.\n- [x] Gate `/me` behind Tailscale on athena, document in CONTEXT.md/README.md/todo.md. Branch `feat/me-tailscale-gate` → dev @ ab88ebd. 2026-06-21.
  - Decision 2026-06-20: network-layer enforcement only (no page-level password or client-side auth).
  - Reference config: `homelab-configs/me-tailscale-caddy.conf`.
  - `portfolio-combined.html` `/me` page updated to: "Private section — available on Tailnet only."
  - Public Vercel deployment must not include `/me` content.

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
- [x] Shared-nav mobile layout still cramped at ≤400px (3 pills overlap) — fixed via 3-tier responsive plan in `feat/topbar-mobile-first`. ≤860px shrinks pills + flex centering; ≤560px collapses center pill to hamburger + overlay; ≤380px hides search. Playwright verified 10/10 viewports zero overlaps.

### Polish task #3 follow-up — project skill bars
- [x] Add scored skill bars to each `.cs-section` on /projects page (replace `.cs-stack` chip row) — completed in `feat/cs-skills-bars` (8 cs-sections, 38 bars total, color bands: `s-high` ≥70, `s-mid` ≥50, `s-low` <50)
  - Source-of-truth: extract current stack from each cs-section, validate against project CONTEXT.md / README.md, score 0-100 by usage depth
  - Auto color bands: green 80-100, blue 65-79, amber 50-64, omit <50
  - Top 5 skills per project, sorted by score descending
  - 8 projects × 5 skills = 40 bars total
  - Visual: name (left) + colored bar (middle, gradient fill) + score (right-aligned)
  - `.cs-stack` chip row replaced entirely (no redundant chips + bars)
  - Fallback to chips if a project has <3 scored skills

### Content + structure cleanup (new — 2026-06-23)
- [x] Content cleanup and more polished content on all pages — completed across 8+ commits on `feat/content-cleanup` (all merged to dev). Sub-items: photo placeholder removed (`df1ec12`), year badges standardized to 2026 (`df1ec12`), roadmap stat `👥 50K+ Developers` → `🤖 ML · Infra · Full-stack` (`df1ec12`), homepage v2 cleanup (`609beb4` → `fddb1c1`), contact widget cleanup (`a1f6a3c`), projects stat 12→8 (`d4b1307`), photo widget swap (`4097080`). All merged. New cleanup sub-tasks can be added as `[ ]` items below.
- [x] Add new projects to the projects page — completed in `feat/add-4-projects` (4 new cs-sections: portfolio-website, hermes-desktop-oauth, openclaw-dashboard, unilox-fitness-ai). **Artifacts 5–8 redesigned 2026-06-26 by Claude** to match quality of projects 1–4 (sub-items below).
  - [x] Audit projects 1–4 artifact patterns and CSS classes (node-diagram, pipeline, platform-grid, bar-chart)
  - [x] Confirm projects 5–8 were basic SVG text diagrams with no existing CSS reuse
  - [x] P5 Portfolio Website: replace routing-flow SVG → node-diagram (Vercel + Athena nodes)
  - [x] P6 Hermes OAuth Fork: replace phase-timeline SVG → pipeline (4 stages, flex:1)
  - [x] P7 OpenClaw Dashboard: replace route-flow SVG → platform-grid (3 view cards)
  - [x] P8 Unilox Fitness AI: replace module-pipeline SVG → node-diagram (3-tier arch)
  - [x] Fix Hermes pipeline stage overflow (flex:1 on each stage)
  - [x] Verify via Playwright: zero errors, correct artifact element counts, no layout regressions
  - [ ] Color accent pass: apply roadmap tinted-pill system to home/projects/about/me pages
- [x] Add the 4 new projects as homepage widgets (.pcard entries) — **DECIDED 2026-06-27**: not doing. Only the FEATURED: Hermes One OAuth Fork widget will be added; the original 3 bottom `.pcard` entries stay as-is.
- [x] Fix redirecting links across all pages ✅ both sub-tasks merged to dev (NOW/HOMELAB/IDENTITY widgets + FEATURED PROJECT buttons + 3 /projects pcard index cards)
- [x] Fix duplication on homepage about + contact widgets ✅ merged to dev at 9be316b (11 commits, branch preserved at 69939dd)
- [x] **Add SVG icons to widgets that are missing them across all pages** — completed and merged to dev as `c8e0cf4` (with cs-title follow-up `6a09a65`). Includes inline `.ico` SVGs on ~122 widgets across 5 pages (homepage `.pcard-title` + `.tl-title`, /projects `.pi-title` + `.nd-name` + `.plat-name` + `.pipe-name` + cs-titles, /roadmap phase/topic/career/timeline/resource cards, /about sections/edu/languages/interests, /me heading). Per-context icon sizes (12-28px) chosen by agy for visual harmony.
- [x] **Homepage content cleanup v2** — direct edits on `feat/content-cleanup` (no agent dispatch): DevOps added to time chip, Dieburg → Darmstadt x6, STACK widget moved next to HOMELAB, TIMELINE + ALL PROJECTS headings bigger (14px), VIEW ALL bigger. Commit `609beb4` merged to dev as `fddb1c1`.
- [x] **Contact widget cleanup** — homepage `avail-badge` + about-page `photo-status` → `open to werkstudent jobs`. /about page: kept only EMAIL + GITHUB contact cards (removed LinkedIn + Website); removed avail-block; removed 3 redundant bio chips. Commits `4c74d52` + `d6cf504` + `b3c2184` merged to dev as `a1f6a3c`.
- [x] **Projects stat fix** — homepage PROJECTS widget `12 shipped` → `8 shipped` to match the actual 8 cs-sections on /projects. Commit `1925643` merged to dev as `d4b1307`.
- [x] **Photo widget swap** — replaced `VK` initials placeholder in /about photo-block with a real photo. Image is `prototypes/assets/image.png` (user-provided, pre-cropped 680×761 portrait, black background). CSS: `.photo-img { object-fit:cover; object-position:top center }`. Commits `4b401d1` + `fe4c3e1` + `602e27b` on `feat/content-cleanup` (in-progress, will merge with this batch).

### Theme + color
- [x] Dark/light mode toggle with `localStorage` persistence (standalone pages: `html.light` + `vk-theme`)
- [x] Finish light mode on `portfolio-combined.html` — fix remaining dark rectangles/buttons/widgets
- [x] Extend roadmap color profile to home/projects in `portfolio-combined.html`
- [x] Extend roadmap color profile to about/me in `portfolio-combined.html`
- [ ] Contact form with email endpoint (Resend or Nodemailer)
- [x] CV/resume PDF download link ✅ done (claude-code, ~2026-06-21) — cv.pdf generated, download links in About page contact grid + homepage contact widget
- [x] Real GitHub contribution grid — **Manual approach** (2026-06-27): count set to `51` in `<span id="cc">51</span>` at `prototypes/portfolio-combined.html:3415`. Visual grid (random 26×5 cells) preserved. Update count manually in HTML when needed. API approaches (REST + GraphQL) abandoned — recorded in DEVLOG with rationale.
- [ ] DE translation strings for full bilingual support
  - **Scope decision:** choose a tier
    - (a) Minimal — 5-10 key UI strings (nav links, section headings, primary CTAs). ~30 min
    - (b) Partial — major sections (homepage + about hero text + section headings). ~2-3 hours
    - (c) Full coverage — all user-facing strings in 6600-line HTML file. ~6-8 hours, may need its own session
  - **Mechanism:** data object with EN/DE pairs, lookup function, language switcher in topbar, persist preference to localStorage
  - **Initial DE translations:** most portfolio copy is technical English (project names, framework names) and won't change. Bio paragraphs + nav + section headings + CTAs are the meaningful translation surface.
- [x] Fix visibility of SVG icons on all pages in light mode — completed in `feat/svg-icons-light-mode` (originally merged as `41f1cc2`, reverted as part of cleanup, **re-applied at `6b83cb9`**). Root cause: existing `html.light .ico svg [stroke*="..."]` rules used descendant combinator, missing SVGs where `.ico` class is on the SVG itself. Fix: added `html.light svg.ico [...]` selectors at commit `2e5f83f` (alongside existing rules). All `.ico` SVGs (113+) + `.ico-blink*` / `.ico-float*` / `.ico-pulse` / `.ico-throb` / `.ico-spin` + project visualization SVGs (routing-flow, phase-timeline, route-flow, module-pipeline) now visible in light mode. **Animation-class SVGs and project-viz SVGs were also re-applied in `feat/svg-icons-complete-lightmode` at `a79641b` (originally `d3258c1`).**

### Brand assets (new — 2026-06-30)

**Favicon** (fix queued — prior agent's work had visible black borders)
- [x] ~~`assets/logo.png` → favicon across all browsers + devices~~ (PRIOR AGENT 2026-06-30: 9 assets generated, 7 HTML files updated, MERGED to dev @ f1fbaf7 — but visible black borders in deployed favicon. V/K not legible at 16×16 due to dark glass shadow extending to canvas edges. Source was 1254×1254 with 64-204px black borders. Visual QA was skipped — L-066 in lessons.md called this out and I didn't enforce. Kept on remote for forensics.)
- [ ] **Fix: re-derive favicon from cropped source** — User dropped new `assets/logo.png` (1108×1122, less border). Plan: crop to V/K content (1090×985), add 5% padding, square to 1024×1024, composite on clean background (white recommended for legibility on both light + dark browser chrome), re-derive all 9 favicon assets, visual QA at 16/32/180/192/512 before commit. **Kickoff at `tasks/kickoff-favicon-borders-fix.md`** (Hermes-authored 2026-06-30, awaiting dispatch). Branch: `fix/favicon-borders` off dev.

**Topbar logo** (queued — parent task, 7 sub-places identified 2026-06-30)
- [ ] **Sub-place 1: Topbar pill (left) — scroll-responsive logo swap** — Current topbar pill (`#shared-nav > .nav-logo` at `prototypes/portfolio-combined.html:3451-3455`) shows the full "Vishal Katariya" wordmark in `hn-script` (Cormorant italic) + `hn-sans` (Space Grotesk 800). On scroll-down, the wordmark should fade out and a small logo mark should fade in (in-place, same pill, no layout shift). On scroll-up, the wordmark fades back in. Reduces pill width when scrolled, gives more room for the center nav links. Use the same `assets/logo.png` source as the favicon task.
- [ ] **Sub-place 2: Profile icon (top right pill) — replace "VK" initials with logo SVG** — The right pill currently shows "VK" initials as a profile/identity indicator. Replace that with the logo SVG. The roadmap page has a separate `CS<em>.</em>` variant at line 3506 — keep that as-is, only update the main `VK` initials.
- [ ] **Sub-place 3: Open Graph image for social share previews** — No OG image currently set. When the site is shared on Twitter/LinkedIn/Slack, the preview shows a missing-image placeholder. Generate a 1200×630 OG image using the logo + name + tagline. Add `<meta property="og:image" content="...">` to all 7 HTML files.
- [ ] **Sub-place 4: Hero identity widget (`#home-identity`) — add logo mark alongside wordmark** — Current homepage hero identity widget has the big "Vishal" calligraphic + sans wordmark. Add the logo mark as a separate element (icon, badge, or small image) — placement: above the wordmark, beside it, or as a subtle watermark. User decides final placement.
- [ ] **Sub-place 5: About page photo block — add logo mark below photo** — Current `/about` page has a photo (line 5709 references `assets/image.png`) + "I'm Vishal Katariya" text. Add a small logo mark beneath the photo (or as an overlay) for branding consistency.
- [ ] **Sub-place 6: Resume page header — add logo mark to `resume.html`** — Resume page (`prototypes/resume.html`) has its own header structure. Add the logo mark to the header for visual brand consistency with the main site.
- [ ] **Sub-place 7: `/me` private page — add logo mark to heading area** — The Tailscale-only `/me` private section has its own heading markup. Add the logo mark for branding consistency, matching the rest of the site's identity treatment.

### Resume redesign (new — 2026-06-30, aesthetic version for the site, NOT the job-application CV)

**Goal:** rebuild `prototypes/resume.html` from scratch using the portfolio's design system (Light Grey + Dark themes, widget-block glass effect, SVG icons, 4-font stack). Hero: photo top-left, VISHAL KATARIYA name centered, 4 status pills below name (AI/ML · Full Stack · DevOps/Infra · Open to work with green dot). Left column: 4 contact pills (email · github · website · location) + Skills (Technical + Soft) + Languages + Interests. Right column: Education (about-page layout, modules completed only) + Projects (5) + Work Experience (1 Amazon DNW4). Single file, light + dark themes via `prefers-color-scheme`. A4 print stylesheet.

- [ ] **Sub-task 1: Font stack** — Drop Cormorant Garamond. Use: **Outfit** (body), **Space Grotesk** (display headers, name), **Syne** (accent fonts), **JetBrains Mono** (contact details, monospaced), **DM Mono** (small labels). Add JetBrains Mono + Syne to the Google Fonts `<link>` (currently only has DM Mono + Space Grotesk + Outfit). Hero name stays in Space Grotesk 800, no calligraphic initials.
- [ ] **Sub-task 2: Hero restructure** — Remove the small `logo-128.png` from the hero. Move "VISHAL KATARIYA" name to the center. Photo (`assets/image.png`, 680×761) goes top-left, sized to fit inline with the status pills on the right (proportional to A4 — agent picks size that looks balanced, not literal 170px).
- [ ] **Sub-task 3: Remove old role text** — Delete `.hdr-role` line "AI · ML · SWE / CS Student at h_da" (current `resume.html:382`). Replace with the new 4 status pills (sub-task 5).
- [ ] **Sub-task 4: Photo on top-left** — Reuse `assets/image.png` (already on disk, 659KB). Same border-radius 20px, same neomorphism shadow as about page's `.photo-frame`. Sized to be balanced with the contact pills in the hero row.
- [ ] **Sub-task 5: 4 status pills (AI/ML · Full Stack · DevOps/Infra · Open to work with green dot)** — Replace the 3 old meta chips (`DIEBURG · GERMANY`, `AVAILABLE FOR INTERNSHIPS`, `ML ENGINEERING · FULL-STACK · INFRASTRUCTURE`). Pills go in the hero, below the name. "Open to work" gets a green dot (CSS-only, like `.s-done` pattern in the current resume). Location is moved to the contact pills (sub-task 6).
- [ ] **Sub-task 6: 4 contact pills in left column (email · github · website · location) with SVG icons (OG banner style)** — Remove the top-right `linkedin.com/in/vkkatariya` contact. Each contact is its own pill with inline SVG icon (extract from `portfolio-combined.html` — they have ~146 inline SVGs total, the right ones for email/github/globe/pin). Layout: vertical stack in the left column at the top. Click each = `mailto:` / GitHub / website / `gmaps:` or static link.
- [ ] **Sub-task 7: Move Education to right column (was left) + use about-page layout** — Remove the current left-column education block. Add a new education widget in the RIGHT column (above projects) using the about-page's `edu-card` pattern (institution with graduation cap SVG icon, degree, period, "currently enrolled" badge, modules list). The label is "MODULES COMPLETED" (drop "/ IN PROGRESS" from the about page's "MODULES COMPLETED / IN PROGRESS").
- [ ] **Sub-task 8: Split skills into Technical (left column) + Soft (left column)** — Replace the current left-column education slot. Technical skills: keep the 7-bar layout (Python, Docker·Linux, ML/AI, TypeScript, Proxmox·ARM, SvelteKit, C++) + add `Git` as a 8th bar. Add the 4 skill categories from current resume (Backend & Infra, AI & ML, Frontend, [add Git/Footer category]). Soft skills: 5 chips from library (Problem-solving, Technical writing, Systems thinking, Research and analysis, Teamwork).
- [ ] **Sub-task 9: Interests with details from about page (4 cards with icon + title + 1-2 sentence description)** — Replace current 4-chip list. Each interest is a small card with: icon (emoji or SVG), title, 1-2 sentence description. Copy descriptions from `prototypes/portfolio-combined.html:5990-6022` (Programming, AI, Cricket, Entrepreneurship).
- [ ] **Sub-task 10: Languages stays the same** — No change to the 4-language list (Deutsch, English, Hindi, Gujarati) with dots + levels.
- [ ] **Sub-task 11: Add Portfolio Website + Hermes One OAuth Fork to projects (was 3, now 5)** — Current projects (Finance Buddy, Homelab Dashboard, orlon-bot). Add 2 more: Portfolio Website + Hermes One OAuth Fork. Each project: SVG icon + title, >description (2-line, from `resume-references/`), >Stack chips, status badge (live/wip). All content from `~/dev-shared/projects/resume-references/vishal_resume_library.md` lines 147-303.
- [ ] **Sub-task 12: New Work Experience section below Projects** — Layout: Role + timeline (top row), >company + location, >Description bullets. One entry: **Fulfillment Associate — Amazon DNW4, Duisburg** (Jul 2024 – Dec 2024, 6 months). Use the EN bullets from `resume-references/vishal_resume_library.md` lines 63-66 (3 bullets). SVG briefcase icon.
- [ ] **Sub-task 13: SVG icons across all sections** — Each section gets appropriate icons. Extract inline SVGs from `prototypes/portfolio-combined.html` (the file has 146 inline SVGs, scan for the right shapes):
  - **Contact pills:** 📧 email (envelope), 🐙 github (octocat), 🌐 website (globe), 📍 location (pin)
  - **Status pills:** 🟢 open to work (CSS dot only, no SVG)
  - **Education:** 🎓 graduation cap
  - **Projects:** 5 different icons — 💰 finance, 📊 dashboard, 🤖 bot, 🌐 portfolio, 🔐 oauth
  - **Skills:** 💻 technical, 🤝 soft
  - **Languages:** 🌐 globe
  - **Interests:** 4 from about page — 💻 code, 🤖 AI, 🏏 cricket, 📚 book
  - **Work exp:** 💼 briefcase
- [ ] **Sub-task 14: Light grey background + widget style + dark/light themes** — Background: light grey matching `html.light` mode on vishal-katariya.com (the `#f0f0f0` or `#ececec` used on the site). All sections use the widget-block glass treatment (`backdrop-filter: blur()`, semi-transparent, rounded corners 16-24px, subtle border). Generate dark + light via `prefers-color-scheme: dark/light` media queries (NO separate HTML files). Theme toggle: optional UI button like the portfolio has. A4 print: white background regardless of theme (saves toner).
- [ ] **Sub-task 15: Content source** — All project descriptions, work exp bullets, skills, education, interests come from `~/dev-shared/projects/resume-references/vishal_resume_library.md` (17KB, 387 lines, master source for all resume variants). Read this file FIRST before writing any content.
- [ ] **Visual QA at A4 print + screen** — Per L-068, the agent must render the resume at A4 (210mm×297mm) via Playwright + at screen (1280px) + at print preview before commit. Send screenshots to Vishal for sign-off.
- [ ] **Mandatory: keep `resume.html` working as the current print version until visual QA passes** — Don't break the existing resume until the new one is approved.

**Decisions confirmed (2026-06-30):**
- Fonts: Outfit (body) + Space Grotesk (display) + Syne (accent) + JetBrains Mono (contacts) + DM Mono (labels). No Cormorant Garamond.
- Hero: photo (left) + VISHAL KATARIYA (center) + 4 status pills (AI/ML · Full Stack · DevOps/Infra · Open to work) below name
- Contacts: 4 pills (email, github, website, location) in **left column at top** (NOT in hero)
- Photo size: agent picks, balanced with the hero layout
- Light + dark via `prefers-color-scheme`, single file
- Projects: 5 (Finance Buddy, Homelab Dashboard, orlon-bot, **Portfolio Website**, **Hermes One OAuth Fork**)
- Work exp: 1 entry (Amazon DNW4)
- Content source: `~/dev-shared/projects/resume-references/vishal_resume_library.md`
- A4 print, single file, no separate HTML

**Kickoff (Hermes-authored 2026-06-30, awaiting dispatch):** `tasks/kickoff-resume-redesign.md`

**Branch:** `feat/resume-redesign` off dev

### New widgets
- [x] Add FEATURED: Hermes One OAuth Fork widget on homepage — **completed 2026-06-26 by Claude**. Added `s11` (1×1, 168px) widget between PROJECTS STAT and ABOUT via HTML order auto-placement (col4 row5, no explicit grid needed). Uses Ndot dot-matrix font for title with `var(--green)` glow, stats in blue/neutral/green tier. VIEW → navigates to `showPage('projects')` + `scrollIntoView('hermes-desktop-oauth')`, GITHUB → `https://github.com/vkkatariya/hermes-desktop-oauth`. Also fixed Contact widget `align-self:start` → `align-self:stretch` so Contact bottom flushes with About bottom (both at y=1342). Sub-items below.
  - [x] Map exact grid coordinates before touching anything (Playwright DOM audit)
  - [x] Identify empty cell: col4 row5 (y=800–968) — Stack ends row4, Contact starts row6
  - [x] Add Hermes OAuth Fork widget (s11) at col4 row5 via HTML order auto-placement
  - [x] Wire VIEW → to showPage('projects') + scrollIntoView('hermes-desktop-oauth')
  - [x] Wire GITHUB → to https://github.com/vkkatariya/hermes-desktop-oauth
  - [x] Fix Contact alignment: align-self:start → align-self:stretch (bottoms flush with About)
  - [x] Verify Playwright: zero errors, correct row/col placement, About/Contact heights match
  - [x] Responsive check for Hermes widget at ≤860px and ≤560px breakpoints — fixed broken 560px and 380px grid breakpoints caused by About widget span 3 override
  - [ ] Color accent pass: apply roadmap tinted-pill system to home/projects/about/me via Claude Code

- [x] Decide `/me` auth mechanism — Tailscale network-layer gate on athena (Caddy `remote_ip` or bind to Tailscale IP). No page-level/client-side auth.

### Live deployment (2026-06-27)

- [x] **GitHub Pages deployment workflow** — `.github/workflows/pages.yml` auto-deploys on push to main when index.html / prototypes / lib / assets / CNAME change. Includes smoke-test job (HTTP 200, server header not Vercel, widget content, analytics scripts present). Live at `https://vkkatariya.github.io/`.
- [x] **Root redirect splash** — `index.html` at repo root redirects (meta refresh + JS fallback + clickable "ENTER PORTFOLIO →" link) to `/prototypes/portfolio-combined.html`.
- [x] **CNAME removed** — was forcing `vkkatariya.github.io` → `vishal-katariya.com` (Vercel). Now GitHub Pages serves directly.
- [x] **Vercel production deployment** — `vishal-katariya.com` auto-deploys on push to main. Config: `framework: null`, `outputDirectory: "."`, `cleanUrls: true`. Live and serving SPA + analytics.
- [x] **Vercel preview deployments** — auto-generated URLs (`portfolio-website-XXX-orlon-team.vercel.app`) publicly accessible. Deployment Protection OFF. Pushed on every non-main branch.
- [x] **Speed Insights** — `window.si` queue + `/_vercel/speed-insights/script.js` on all 6 live HTML files.
- [x] **Web Analytics** — `window.va` queue + `/_vercel/insights/script.js` on all 6 live HTML files.
- [x] **vercel.json config** — `{"framework": null, "outputDirectory": "."}` (2 lines, minimal)
- [x] **package.json build script** — `"build": "echo 'No build step required for HTML prototype'"` (CLI deploys safe per L-059)
- [!] **Subpath rewrites** — `/projects`, `/about`, `/roadmap` return 404 on Vercel. Hobby plan limitation (L-060). Workaround: visitors use `/prototypes/portfolio-combined` (cleanUrls). Permanent fix requires Pro plan or HTML restructure.
- [!] **Custom preview domain** — `vishalkatariya.dev` not used as preview domain. Bare↔www redirect loop on Hobby plan (requires Pro). Using auto-generated URLs instead.
- [~] **vishalkatariya.dev** — registrar-level 308 to `www.vishalkatariya.dev` (out of scope, separate issue at DNS provider).

---

## Phase 1 — SvelteKit Scaffold

**Stack decisions (decided 2026-06-27):**
- **Svelte 5** (runes) over Svelte 4 — actively developed, future-proof, explicit reactivity via `$state`/`$derived`/`$effect`
- **TypeScript strict mode** — type safety for 137+ SVG icons, 8 projects, structured data; IDE autocomplete + refactor-safe
- **Static adapter** (`@sveltejs/adapter-static`) — read-only portfolio content, pre-rendered HTML, free Vercel CDN, zero compute cost
- **Data format: TypeScript modules** (`src/lib/data/*.ts`) — type-checked at build time, no markdown overhead
- **Deploy target: Vercel** — already wired to repo + domain; public static site = best fit
- **Cutover: parallel deploy** — Phase 1.7 ships to `/v2` subpath first, apex flips after 1 week of parity testing
- **Old `portfolio-combined.html`** — keep in repo during Phase 1 as source of truth, archive to `archive/` after cutover, delete after 30 days post-cutover

**Architecture (hybrid, decided 2026-06-20):** Public routes on Vercel (CDN edge); private `/me/*` and backend services stay on athena behind Tailscale. GitHub is repo-only, not deploy target.

### 1a — Project init
- [ ] `pnpm create svelte@latest web` (in repo root) — Svelte 5 + TypeScript + ESLint + Prettier + Vitest
- [ ] Install `@sveltejs/adapter-static` and configure `svelte.config.js`
- [ ] `tsconfig.json` — strict mode, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`
- [ ] Set up shared design tokens: `src/lib/styles/tokens.css` — `--w`, `--w30`, `--w60`, `--green`, `--blue`, `--acc`, `--font-ndot`, `--bg` + light-mode `[data-theme="light"]` overrides
- [ ] Google Fonts import in `+layout.svelte`: Cormorant Garamond + Space Grotesk + Outfit + DM Mono (use `link rel="preconnect"` + `display=swap`)
- [ ] `@font-face` for Ndot (NDOT55Caps.woff2) — copy from `assets/fonts/` to `static/fonts/`
- [ ] `src/app.css` — global reset, dot-matrix body bg, CSS variables, base typography
- [ ] `src/lib/styles/glass.css` — extract `.glass` and `.liquid-glass` utility classes from `portfolio-combined.html` lines 140-307

### 1b — Layout + shared components
- [ ] `src/routes/+layout.svelte` — 3-pill glass topbar (port from `portfolio-combined.html` line 3288)
- [ ] `src/lib/components/PillTopbar.svelte` — props: `currentRoute`, `available`; handles active state via store
- [ ] `src/lib/components/NavLink.svelte` — single nav link with hover/active states
- [ ] `src/lib/components/WidgetGrid.svelte` — CSS grid container, accepts widgets as children
- [ ] `src/lib/components/Widget.svelte` — base glass widget wrapper (`s11`/`s12`/`s21`/`s22` size variants)
- [ ] `src/lib/components/Footer.svelte` — copyright + nav + contact links
- [ ] `src/lib/components/Icon.svelte` — sprite-based icon component (load `icons.svg` sprite, accept `name` prop)
  - Generate sprite from existing 137+ inline SVGs in `portfolio-combined.html`
  - Light-mode compatible (uses currentColor + CSS variables)
- [ ] `src/lib/stores/theme.ts` — Svelte store for `dark`/`light` theme (default: dark, persist to localStorage, mirror to `html[data-theme]`)
- [ ] `src/lib/stores/lang.ts` — `en`/`de` language store, translation function `$t('key')`, mirror to `html[lang]`
- [ ] `src/lib/stores/route.ts` — current route state, drives topbar active state

### 1c — Data layer
- [ ] `src/lib/data/projects.ts` — array of 8 projects (id, title, tagline, year, stack, tags, csSections, repoUrl, liveUrl) — extracted from `portfolio-combined.html` cs-sections
- [ ] `src/lib/data/skills.ts` — 6 core skills (Python, ML/AI, TypeScript, Docker, Linux, SvelteKit) with proficiency scores
- [ ] `src/lib/data/timeline.ts` — career timeline entries (year, title, org, description)
- [ ] `src/lib/data/edu.ts` — education entries (h_da CS, languages, certifications)
- [ ] `src/lib/data/topics.ts` — roadmap topics (from existing `TOPICS` const in `portfolio-combined.html`)
- [ ] `src/lib/data/now.ts` — current "now" widget content (what I'm working on, training status)
- [ ] `src/lib/data/about.ts` — bio, intro paragraphs, contact info
- [ ] Each file exports typed constants: `export const PROJECTS: Project[] = [...]` with `interface Project` defined in `src/lib/types/`

### 1d — Migration order (sequential, lowest risk first)

**1d.1 — `/me` page (simplest)**
- Why first: 1 section, mostly text, no complex interactions. Good test bed for the SvelteKit + data layer pattern.
- [ ] `src/routes/me/+page.svelte` — port identity vault content
- [ ] `src/routes/me/+page.ts` — load data from `src/lib/data/`
- [ ] Browser-verify at all 5 viewports (320, 400, 560, 860, 1920)
- [ ] Light-mode verify
- [ ] **Gate:** confirm pattern works before migrating more pages

**1d.2 — `/about` page**
- Why second: medium complexity, multiple data sections (bio, edu, skills, languages, interests, contact)
- [ ] `src/routes/about/+page.svelte` — port bio + edu + skills + languages + interests + contact
- [ ] Wire skills data + edu data + lang grid + contact grid components
- [ ] Browser-verify + light-mode + cross-breakpoint

**1d.3 — `/projects` page**
- Why third: has cs-sections + artifacts (node-diagram, pipeline, platform-grid) — components needed for other pages
- [ ] `src/routes/projects/+page.svelte` — list of project cards + detailed cs-sections
- [ ] `src/lib/components/ProjectCard.svelte` — `.pcard` style card
- [ ] `src/lib/components/CsSection.svelte` — case study section wrapper
- [ ] `src/lib/components/NodeDiagram.svelte` — for projects 5, 8
- [ ] `src/lib/components/Pipeline.svelte` — for project 6
- [ ] `src/lib/components/PlatformGrid.svelte` — for project 7
- [ ] `src/lib/components/BarChart.svelte` — for project 1 (Finance Buddy)
- [ ] Browser-verify all 8 project sections render correctly

**1d.4 — `/roadmap` page**
- Why fourth: has internal nav that swaps with shared topbar (`.nav-hidden` animation), timeline center-spine layout
- [ ] `src/routes/roadmap/+page.svelte` — port timeline + topic cards + career cards
- [ ] `src/lib/components/RoadmapPage.svelte` — self-contained roadmap component
- [ ] `src/lib/components/InternalNav.svelte` — for the in-page nav swap
- [ ] `src/lib/components/TimelineEntry.svelte`
- [ ] `src/lib/components/TopicCard.svelte`
- [ ] Browser-verify topbar morph animation works

**1d.5 — `/` homepage (highest risk — last)**
- Why last: most complex (widget grid, dynamic widgets, hero, multiple data sources)
- [ ] `src/routes/+page.svelte` — homepage with WidgetGrid
- [ ] Port all 12+ widgets from current grid (System Time, Identity, GitHub Activity, Skills, Now, Homelab, Stack, Featured Project, Projects stat, About, Contact, Timeline, All Projects)
- [ ] Wire dynamic widgets (System Time clock, GitHub contribution grid)
- [ ] Hero section with portrait + intro

### 1e — Pre-cutover verification
- [ ] All 5 routes pass Svelte/TypeScript strict-mode build
- [ ] All 5 routes render identical content to old `portfolio-combined.html` (visual diff at 1920px)
- [ ] All 5 routes render correctly at 320/400/560/860/1920px viewports (both modes)
- [ ] All routes load with no console errors
- [ ] Lighthouse audit: Performance >90, Accessibility >95, Best Practices >95, SEO >95
- [ ] Bundle size <200kb per route (gzipped)
- [ ] Deployed to `/v2` subpath on Vercel, accessible for 1 week parity testing

### 1f — Cutover
- [ ] Day 0: Deploy SvelteKit to apex `vishalkatariya.dev/v2/*`
- [ ] Days 1-7: User reviews daily, reports regressions to fix before cutover
- [ ] Day 7: Flip Vercel config to serve SvelteKit from apex
- [ ] Day 7+30: Keep old `portfolio-combined.html` archived in `archive/` for reference
- [ ] Day 37: Delete old `portfolio-combined.html` from repo

### 1g — Site opening latency optimization (queued 2026-06-30, deferred per user)

**Goal:** reduce cold load time from current ~400ms (Vercel analytics) to <200ms. Currently: 308 redirect (vishal-katariya.com → www, ~150ms) + meta refresh in index.html (~200ms) + 369KB single-file HTML payload (~200-300ms cold). Repeat visits cached at ~50ms.

**Priority order** (cheapest wins first):

1. **Eliminate the meta refresh redirect** (saves 200-300ms, biggest win)
   - Option A: Move `prototypes/portfolio-combined.html` to root `index.html`, update all internal asset paths
   - Option B: Use Vercel `vercel.json` rewrites to point `/` → `/prototypes/portfolio-combined.html` (if Vercel supports static rewrites)
   - Either approach: remove the `<meta http-equiv="refresh">` and `window.location.replace` from the current `index.html`
2. **Set `Cache-Control: public, max-age=300` on `portfolio-combined.html`** (saves 100-200ms on repeat visits, 5min cache is safe for portfolio content)
3. **Add preconnect + dns-prefetch to portfolio-combined.html `<head>`** (saves 20-50ms)
4. **Minify the HTML** (whitespace removal, saves 10-20ms cold, no functional change)
5. **Lazy-load the 137 inline SVG icons** (move to a sprite, fetch on demand, saves 50-100ms)
6. **Extract + minify the CSS** (saves 10-20ms)

**Realistic target after #1-#4:** 150-200ms cold load, 50-100ms warm. Vercel Hobby plan (current).

**Decisions needed before starting:**
- [ ] Choose Option A vs Option B for redirect elimination
- [ ] Confirm portfolio update cadence (how often does the site change? affects safe cache duration)
- [ ] Are you OK with the URL pattern change (no more `/prototypes/` prefix) if Option A?

**Long-term:** Phase 1 (SvelteKit migration) will solve most of this — static adapter output + per-route code splitting naturally reduces both payload and round trips. This section is the "Phase 0 stopgap" optimization.

**Reference measurement (2026-06-30):**
- `vishal-katariya.com/` (cold): 353ms total (308 redirect 153ms + meta refresh ~200ms)
- `vishal-katariya.com/` (warm, browser cached): 144ms
- `vishal-katariya.com/prototypes/portfolio-combined.html` (cold): 441ms (369KB payload)
- `vkkatariya.github.io/prototypes/portfolio-combined.html` (GitHub Pages, cold): 330ms

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

- [ ] **Host `/me/*` on athena behind Tailscale** (no public exposure; Caddy allowlist or bind to Tailscale IP only)
- [x] **Choose `/me` gating mechanism:** Tailscale network-layer enforcement only. No page-level password, no client-side auth. Reference: `homelab-configs/me-tailscale-caddy.conf`.
- [ ] `/me/vault` — identity vault (port from existing artifact)
- [ ] `/me/docs` — integrate artifacts from `notion-artifacts` project
- [ ] `/me/notes` — future Notion workspace mirror (backlog)

### Tailscale gate reference

Recommended Caddy rule:
```caddy
me.auxois-wyrm.ts.net {
    @not_tailscale {
        not remote_ip 100.64.0.0/10
    }
    respond @not_tailscale "Access denied — Tailscale required" 403
    reverse_proxy localhost:8900
}
```

Alternative: bind the upstream to the Tailscale IP only:
```bash
python3 -m http.server 8900 --bind "$(tailscale ip -4)"
```

---

## Phase 4 — Deploy

- [ ] Vercel project connected to `vkkatariya/vkkatariya.github.io` — public routes only
- [ ] Custom domain: `vishalkatariya.dev`
- [ ] Private `/me/*` served from athena via Tailscale MagicDNS (`auxois-wyrm.ts.net`)
- [ ] GitHub Pages mirror configured (optional)
- [ ] Smoke test all public routes

**Hybrid architecture decision (2026-06-20):** Public site on Vercel for speed/reliability; private backend and `/me` stay on athena behind Tailscale. Domain + Vercel already wired up.

---

## Backlog (unscheduled)

_(empty — all items moved to Phase 0)_
