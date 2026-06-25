# Kickoff: Add 4 new projects to /projects page + resize top 4 cards

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (8 pi cards + 4 cs-sections, single file)

---

## Goal

Expand the /projects page from 4 projects to 8 projects:

1. **Resize** the existing 4 `.pi` cards at the top of /projects to be more compact (so 8 fit nicely)
2. **Add 4 new `.pi` cards** alongside the existing 4 (8 total)
3. **Add 4 new `.cs-section` blocks** below the existing 4 cs-sections (full detail blocks matching existing style — hero, body, stack, proj-nav)
4. **Everything below the cs-sections stays exactly the same** — the `</div><!-- /cs -->` close, the `</div><!-- /pg-projects -->` close, transition to /roadmap — DO NOT modify

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** Create new branch `feat/add-4-projects` from `dev`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Source-of-truth content for new projects

User-verified content (from project READMEs + CONTEXT.md files). Use these directly — do NOT make up content.

### Project 05 — portfolio-website (this project itself)
- **Anchor id:** `portfolio-website`
- **Tagline (`.pi-sub`):** "This site · Vercel + Tailscale"
- **Status:** "Live" (`.pi-status s-done`)
- **Tech tags (3-4):** SvelteKit (future), Vercel, Tailscale, Liquid Glass
- **cs-section title:** "Portfolio Website"
- **cs-section description (2-3 paragraphs):**
  - "Personal portfolio at vishalkatariya.dev — built as a self-contained SvelteKit SPA, hybrid-hosted with public routes on Vercel and private `/me/*` behind a Tailscale + Caddy IP allowlist on athena."
  - "Design system uses three layered surfaces: liquid glass (nav/frames), neomorphism (widgets), and NeoPOP (CTAs). Typography stacks Cormorant Garamond italic (initials) with Space Grotesk (display), Outfit (body), DM Mono (labels), and NDOT (accent)."
  - "Every page is a single HTML prototype in `prototypes/` — `portfolio-combined.html` is the consolidated SPA, with separate `projects.html`, `about.html`, and `cs-roadmap.html` still in use as standalone entry points."

### Project 06 — hermes-desktop-oauth
- **Anchor id:** `hermes-desktop-oauth`
- **Tagline:** "Hermes One · OAuth for gated dashboards"
- **Status:** "13 PRs merged · Phase 4" (`.pi-status s-done` — phase 3 complete; can use a custom label or reuse `s-done`)
- **Tech tags:** Electron, TypeScript, React 18, Vite, Tailwind, better-sqlite3
- **cs-section title:** "Hermes Desktop (OAuth fork)"
- **cs-section description (2-3 paragraphs):**
  - "A patch project on top of `fathah/hermes-desktop` — the community Electron desktop client for Hermes Agent — that adds the Nous Portal OAuth login flow plus single-use WebSocket ticket minting so the app can connect to a Hermes dashboard bound to 0.0.0.0 in gated mode."
  - "Without this patch, the community client's `?token=` URL-based auth can't reach a Nous Portal-gated dashboard: the dashboard returns 302 to the login page because the spawned backend is a separate Node process without the app's main-process OAuth cookies. The fix is in `src/main/oauth.ts` and `src/main/dashboard.ts` — provider discovery via `/api/status` + ticket-based WS auth that doesn't burn the single-use ticket before the renderer can use it."
  - "13 PRs shipped across 4 phases: Phase 1 audit, Phase 2 OAuth dashboard auth flow, Phase 3 Mac end-to-end, and Phase 4 (pending) upstream PR to fathah/hermes-desktop:main. 38/38 OAuth tests pass."

### Project 07 — openclaw-dashboard
- **Anchor id:** `openclaw-dashboard`
- **Tagline:** "Control UI for OpenClaw gateway"
- **Status:** "Active dev" (`.pi-status s-wip`)
- **Tech tags:** React, TypeScript, Vite, WebSocket, Zustand, Neopop
- **cs-section title:** "OpenClaw Dashboard"
- **cs-section description (2-3 paragraphs):**
  - "React + TypeScript control UI for the OpenClaw gateway running on athena — the local-first agent orchestration layer that hosts Claude Code, Codex, Gemini CLI, agy, abacus, opencode, and gh-copilot as supervised coding-agent subprocesses."
  - "Connects to the OpenClaw gateway over WebSocket RPC with Ed25519 device identity stored in localStorage. AppShell layout with Sidebar + Topbar; routes for `/dashboard` (channels/instances/sessions metrics), `/chat` (with slash commands like `/network` and `/agent`), and `/theme-test`."
  - "Hybrid NeoPOP + Neumorphism design system with two themes (`hybrid-dark` primary, `hybrid-light`). Theme tokens in `src/theme/tokens.ts`. Command palette (`src/components/commands/`) for keyboard-first navigation across the registered agents."

### Project 08 — unilox-fitness-ai (UNILOX)
- **Anchor id:** `unilox-fitness-ai`
- **Tagline:** "AI Gym & Fitness Assistant · 7 modules"
- **Status:** "Phase 0 spec" (`.pi-status s-wip` — in design/spec phase)
- **Tech tags:** Next.js 14, FastAPI, MediaPipe, HuggingFace, PostgreSQL, MQTT, MLflow
- **cs-section title:** "UNILOX — AI Gym & Fitness Assistant"
- **cs-section description (2-3 paragraphs):**
  - "Unified AI-powered fitness ecosystem by Revolux Learning Private Limited. Seven core modules: AI Gym Trainer (CV pose estimation + rep counting + form correction), AI Dietician (NLP diet recommendations + meal planning), Smart Gym Assistant (IoT equipment integration via MQTT + Node-RED), AI Habit Tracker (behavioral ML predicting skipped workouts), Virtual Gym Buddy (conversational AI + sentiment analysis), Pose-to-Performance Analyzer (motion efficiency + biomechanical reports), and Gym Recommender."
  - "Stack spans Next.js 14 web dashboard + React Native (Expo) mobile + FastAPI backend, with Hugging Face transformers + MediaPipe for ML, MQTT (Mosquitto) for IoT edge devices (Jetson Nano / RPi 5 / ESP32-CAM), MLflow for experiment tracking, and Caddy reverse proxy in production."
  - "Phase 0 (specification & design) is complete. Phase 1+ (foundation scaffold, core AI modules, integration) not started — staged via monorepo with `apps/web`, `apps/mobile`, `apps/api`, `ml/`, `iot/`, `infrastructure/`, and `shared/` workspaces."

---

## Step 1 — Resize the existing 4 `.pi` cards (lines ~3651-3700)

Make each card smaller so 8 cards in a 2-column grid don't dominate the page. The `.pi` class currently has `padding:36px 40px` (set globally in `.pi` CSS rule).

**Approach: shrink padding, fewer tags, shorter taglines.**

**Existing 4 changes (use `style` overrides inline so you don't have to touch the global `.pi` CSS):**

| Card | Change |
|---|---|
| finance-buddy | `pi-sub` → "Personal finance tracker" (already short, keep). Reduce tags: keep SvelteKit, Chart.js, PostgreSQL. Drop Fastify, Drizzle. |
| homelab-dashboard | `pi-sub` → "Realtime ops · 2-node cluster" (keep). Reduce tags: Fastify, WebSocket, Docker. Drop Tailscale. |
| typeshift | `pi-sub` → "Cross-platform AI · collab" (shorter). Reduce tags: Kotlin, Swift, C#. Drop AI. |
| orlon-bot | `pi-sub` → "QLoRA fine-tune · Telegram" (shorter). Reduce tags: Python, Unsloth, QLoRA. |

Also update each card's `pi-num` from `01 / 04` to `01 / 08`, etc.

**Add inline `style="padding:28px 32px"`** on each `.pi` card to shrink padding from 36/40 → 28/32.

---

## Step 2 — Add 4 new `.pi` cards (immediately after the existing 4, before `</div>` of `.proj-index`)

The `.proj-index` div closes around line 3700 (after the orlon-bot `.pi` card). Add the 4 new cards BEFORE the closing `</div>` of `.proj-index`.

**Template for each new card:**
```html
<a href="javascript:void(0)" class="pi" style="text-decoration:none;color:inherit;padding:28px 32px" onclick="scrollToAnchor('<id>')">
  <div class="pi-num">0N / 08</div>
  <div class="pi-title"><Title goes here></div>
  <div class="pi-sub"><tagline></div>
  <div class="pi-tags">
    <span class="pi-tag">tag1</span>
    <span class="pi-tag">tag2</span>
    <span class="pi-tag">tag3</span>
  </div>
  <div class="pi-status <status-class>"><status text></div>
  <div class="pi-arrow">↗</div>
</a>
```

Status classes available: `.s-done` (green), `.s-wip` (amber), `.s-future` (gray). Use `.s-done` for "Live" and "13 PRs merged", `.s-wip` for "Active dev" and "Phase 0 spec".

**New cards (in order — same as listed above):**

| # | pi-num | Title (`.pi-title`) | Tagline | Tags | Status |
|---|---|---|---|---|---|
| 5 | `05 / 08` | Portfolio<br>Website | "This site · Vercel + Tailscale" | SvelteKit, Vercel, Tailscale | Live (s-done) |
| 6 | `06 / 08` | Hermes One<br>(OAuth fork) | "Hermes One · OAuth for gated dashboards" | Electron, TypeScript, React, Vite | 13 PRs merged (s-done) |
| 7 | `07 / 08` | OpenClaw<br>Dashboard | "Control UI for OpenClaw gateway" | React, TypeScript, WebSocket, Neopop | Active dev (s-wip) |
| 8 | `08 / 08` | UNILOX | "AI Gym & Fitness Assistant · 7 modules" | Next.js, FastAPI, MediaPipe, MLflow | Phase 0 spec (s-wip) |

---

## Step 3 — Add 4 new `.cs-section` blocks (after the existing 4 cs-sections, before the closing `</div><!-- /cs -->`)

The existing 4 cs-sections end at line ~4145 with `<div class="proj-nav">...</div></section>` for orlon-bot. The `</div><!-- /cs -->` close is right after that.

**Insert the 4 new cs-sections BEFORE the `</div><!-- /cs -->` close.**

**Each cs-section must follow this exact structure** (use the existing `orlon-bot` cs-section as your template — same hero, body, stack, proj-nav layout):

```html
<!-- ── 05: <TITLE> ── -->
<section class="cs-section" id="<id>">
  <div class="cs-hero">
    <div>
      <div class="cs-number">05 / 08</div>
      <h2 class="cs-title"><Title></h2>
      <p class="cs-tagline"><One-line tagline></p>
      <div class="cs-badges">
        <span class="cs-badge cb-<color>"><Status></span>
        <span class="cs-badge cb-blue"><Type · privacy></span>
        <span class="cs-badge cb-acc">2026</span>
      </div>
    </div>
    <!-- (Optional) decorative SVG same style as existing sections -->
  </div>
  
  <div class="cs-body">
    <div>
      <div class="cs-h">section heading 1</div>
      <p class="cs-p">paragraph 1...</p>
      <p class="cs-p">paragraph 2...</p>
    </div>
    <div>
      <div class="cs-h">section heading 2</div>
      <p class="cs-p">paragraph 3...</p>
      <p class="cs-p">paragraph 4...</p>
    </div>
  </div>
  
  <div class="cs-h">stack</div>
  <div class="cs-stack">
    <span class="cs-tech">tag1</span>
    <span class="cs-tech">tag2</span>
    <span class="cs-tech">tag3</span>
    <!-- 5-7 tags -->
  </div>
  
  <!-- Bottom nav -->
  <div class="proj-nav">
    <a href="#home" class="pnav-btn" onclick="showPage('home'); return false;">← home</a>
    <a href="#<id>" class="pnav-btn">↑ back to top</a>
  </div>
</section>
```

**Badge colors available:** `cb-green` (done), `cb-blue` (private/type), `cb-amber` (in progress), `cb-acc` (accent/year), `cb-purple` (AI/ML).

**Each new cs-section needs the content from the source-of-truth section above (2-3 paragraphs per cs-body block).** Aim for 2 `.cs-h` blocks per cs-section (like the existing cs-sections do).

**Decorative SVG:** the existing sections have small SVGs in the hero (bar chart for finance, node diagram for homelab, mobile icons for typeshift, pipeline for orlon). For the new 4, you can:
- (a) Reuse the existing SVG style (small icon, ~40-80px, top-right of hero)
- (b) Skip the SVG (just text content)
- Recommendation: include a small SVG for visual rhythm — pick a simple icon that fits the project (e.g., a stack icon for portfolio-website, an OAuth handshake for hermes, a gateway router for openclaw, a dumbbell for UNILOX). Keep them simple — under 40 lines of SVG each.

**For the proj-nav of each new cs-section**, update the previous-section link. Each new cs-section should have a "← prev" button linking to the previous cs-section (e.g., section 06's "← prev" links to section 05's `#portfolio-website`).

---

## Step 4 — Add IDs to existing cs-section proj-nav buttons (optional but recommended)

The existing cs-sections have `<a href="#finance-buddy" class="pnav-btn">↑ back to top</a>` for back-to-top. If you want consistency with new sections that get prev links, leave existing ones as-is (they only have back-to-top).

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT modify the `.pi`, `.cs-section`, `.cs-hero`, `.cs-body`, `.cs-stack`, `.cs-tech`, `.pi-tag`, `.pi-status` CSS classes.
- DO NOT change the order of existing widgets (finance-buddy, homelab-dashboard, typeshift, orlon-bot).
- DO NOT touch `/home`, `/about`, `/roadmap`, `/me` pages.
- DO NOT touch the existing cs-section content (only ADD new cs-sections below them).
- DO NOT touch the bottom of /projects page after the new cs-sections — preserve the `</div><!-- /cs -->` close, `</div><!-- /pg-projects -->` close, and transition to /roadmap.
- DO NOT change fonts, colors, or visual treatment of new content — match existing cs-section style exactly.

---

## Verification — REQUIRED before declaring done

1. Open the file in a browser via `python3 -m http.server` (already running on port 8900 from earlier sessions, or restart it).
2. **Verify the .pi grid:**
   - Navigate to `#projects` (or click "projects" in topbar)
   - Take a screenshot at the top of /projects showing all 8 cards in a 2-column grid
   - Save to `/tmp/projects-8-cards.png`
3. **Verify each cs-section:**
   - Click card 5 (portfolio-website) — confirm page scrolls to its cs-section
   - Click card 6 (hermes-desktop-oauth) — confirm page scrolls
   - Click card 7 (openclaw-dashboard) — confirm page scrolls
   - Click card 8 (unilox-fitness-ai) — confirm page scrolls
   - Take a full-page screenshot of /projects, save to `/tmp/projects-8-full.png`
4. **Verify nothing else changed:**
   - /home, /about, /roadmap, /me pages render identically to before
   - The bottom of /projects (after the last cs-section) still flows into /roadmap cleanly

If playwright is slow or fails, use `curl http://localhost:8900/prototypes/portfolio-combined.html | grep -E 'cs-section|pi-title|cs-title'` to verify presence of expected anchors/titles.

---

## Definition of Done

1. `git diff` shows ONLY: (a) inline style overrides on 4 existing `.pi` cards (padding + tag count), (b) `pi-num` updates on 4 existing cards (`01/04 → 01/08` etc.), (c) 4 new `.pi` cards added inside `.proj-index`, (d) 4 new `.cs-section` blocks added before `</div><!-- /cs -->`. No other changes.
2. Screenshots at `/tmp/projects-8-cards.png` and `/tmp/projects-8-full.png` confirm visual correctness.
3. All 8 cards scroll to their corresponding cs-sections on click.
4. Commit: `feat(projects): add 4 new projects (portfolio-website, hermes-desktop-oauth, openclaw-dashboard, unilox-fitness-ai) + resize top 4 cards`
5. Push: `git push -u origin feat/add-4-projects`
6. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
7. Report back with: (a) confirmation each step succeeded, (b) screenshot paths, (c) commit hash + branch name, (d) any deviations.

---

## Constraints

- Time budget: ~45 minutes (this is the largest single-file edit tonight).
- DO NOT invent project content — use the source-of-truth content above.
- If a github URL is needed for `pnav-btn` external links, use `https://github.com/vkkatariya/<repo-name>` for verified repos (hermes-desktop-oauth, unilox-fitness-ai). For unverified (openclaw-dashboard, portfolio-website), skip the external link or use `#` placeholder.

---

## Failure modes to avoid

- **Don't dispatch before this kickoff is fully read** — 4 cards + 4 cs-sections is a lot of context.
- **Don't rewrite existing cs-section content** — only ADD new cs-sections.
- **Don't change the page structure below the new cs-sections** — preserve closing divs.
- **Don't invent project content** — use the source-of-truth text above verbatim.
- **If playwright is slow**, fall back to grep verification — don't burn context on browser automation that's failing.
