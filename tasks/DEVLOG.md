# DEVLOG.md
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
