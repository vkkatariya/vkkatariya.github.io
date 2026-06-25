# Kickoff v3: Restore rich content in new cs-sections + fix proj-nav placement + fix multi-line cs-titles

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (single-file HTML edits, 3 specific polish fixes)

---

## Context

`feat/polish-task3` already has agy's first round of polish (resize 8 cards, single-line pi-titles, UNILOX rename, remove decorative SVGs). User reviewed and found 3 more issues. This kickoff is the v3 polish.

**File in scope:** `prototypes/portfolio-combined.html` ONLY
**Branch:** Stay on `feat/polish-task3` (don't create new branch)

---

## Current state (verified via grep)

| cs-section | cs-stats | feat-list | vis-wrap | cs-body | cs-stack | proj-nav | cs-title |
|---|---|---|---|---|---|---|---|
| finance-buddy | 4 | 7 | ✓ | ✓ | ✓ | ❌ | **Finance\<br\>Buddy** (multi-line) |
| homelab | 4 | 3 | ✓ | ✓ | ✓ | ❌ | **Homelab\<br\>Dashboard** (multi-line) |
| typeshift | 4 | 0 | ✓ | ✓ | ✓ | ❌ | TypeShift (single-line) |
| orlon-bot | 4 | 0 | ✓ | ✓ | ✓ | ✓ | orlon-bot (single-line) |
| portfolio-website | 0 | 0 | ❌ | ✓ | ✓ | ✓ | Portfolio Website |
| hermes-desktop-oauth | 0 | 0 | ❌ | ✓ | ✓ | ✓ | Hermes Desktop (OAuth fork) |
| openclaw-dashboard | 0 | 0 | ❌ | ✓ | ✓ | ✓ | OpenClaw Dashboard |
| unilox-fitness-ai | 0 | 0 | ❌ | ✓ | ✓ | ✓ | UNILOX Fitness AI — AI Gym & Fitness Assistant |

---

## The 3 fixes

### Fix 1 — Single-line `cs-title` for the 2 multi-line existing titles

The cs-section `<h2 class="cs-title">` for `finance-buddy` and `homelab` are multi-line:

**Current:**
- `<h2 class="cs-title">Finance<br>Buddy</h2>` (line 3771)
- `<h2 class="cs-title">Homelab<br>Dashboard</h2>` (line 3900)

**Change to:**
- `<h2 class="cs-title">Finance Buddy</h2>`
- `<h2 class="cs-title">Homelab Dashboard</h2>`

Just remove the `<br>` tags. DO NOT change the title text content.

(Other cs-titles — `TypeShift`, `orlon-bot`, `Portfolio Website`, `Hermes Desktop (OAuth fork)`, `OpenClaw Dashboard`, `UNILOX Fitness AI — AI Gym & Fitness Assistant` — are already single-line. Leave them.)

### Fix 2 — Remove per-section proj-nav from new 4 cs-sections + add ONE bottom proj-nav

Currently each of the 4 new cs-sections has its own `proj-nav` at the bottom:

```html
<div class="proj-nav">
  <a href="#home" class="pnav-btn" onclick="showPage('home'); return false;">← home</a>
  <a href="#<id>" class="pnav-btn">↑ back to top</a>
</div>
```

User wants:
- **REMOVE** these 4 proj-nav blocks (one from each of the 4 new cs-sections: portfolio-website, hermes-desktop-oauth, openclaw-dashboard, unilox-fitness-ai)
- **ADD** a single proj-nav at the very bottom of /projects — right after the LAST cs-section closes, but **BEFORE** the `</div><!-- /cs -->` close. Like orlon-bot has within its section.

**Location for the new single proj-nav:**
Insert it after the closing `</section>` of `id="unilox-fitness-ai"`, before the `</div><!-- /cs -->`.

```html
  </section>  <!-- end of unilox-fitness-ai -->

  <!-- Bottom nav for entire /projects page -->
  <div class="proj-nav">
    <a href="#home" class="pnav-btn" onclick="showPage('home'); return false;">← home</a>
    <a href="#finance-buddy" class="pnav-btn">↑ back to top</a>
  </div>

</div><!-- /cs -->
</div><!-- /pg-projects -->
```

Use `#finance-buddy` as the back-to-top anchor (it's the first project, matches the existing `orlon-bot` pattern which also uses `#finance-buddy`).

### Fix 3 — Add rich content to new 4 cs-sections (cs-stats + feat-list + vis-wrap)

The existing 4 cs-sections each have a rich structure beyond just `cs-body + cs-stack`:
- `cs-stats` (4 stat blocks: `<div class="cs-stat"><div class="cs-stat-n">N</div><div class="cs-stat-l">label</div></div>`)
- `vis-wrap` (visualization: `<div class="vis-wrap"><div class="vis-title">title</div><div class="..."></div></div>`)
- `feat-list` (feature cards: `<div class="feat-list"><div class="feat"><div class="feat-icon">emoji</div><div><div class="feat-title">title</div><div class="feat-desc">desc</div></div></div>`)

The new 4 cs-sections (`portfolio-website`, `hermes-desktop-oauth`, `openclaw-dashboard`, `unilox-fitness-ai`) lack all three. Add them — each project gets stats + visualization + feature cards matching the existing pattern.

**Insertion order** in each new cs-section (between `cs-hero` and `cs-body`):

```html
<div class="cs-hero">...</div>

<!-- Stats -->
<div class="cs-stats">
  <div class="cs-stat"><div class="cs-stat-n">N</div><div class="cs-stat-l">label</div></div>
  <div class="cs-stat"><div class="cs-stat-n">N</div><div class="cs-stat-l">label</div></div>
  <div class="cs-stat"><div class="cs-stat-n">N</div><div class="cs-stat-l">label</div></div>
  <div class="cs-stat"><div class="cs-stat-n">N</div><div class="cs-stat-l">label</div></div>
</div>

<!-- Visualization -->
<div class="vis-wrap">
  <div class="vis-title">caption</div>
  <div class="<project-specific-class>"><!-- SVG or HTML visualization --></div>
</div>

<div class="cs-body">...</div>
```

---

## Per-project rich content (source-of-truth)

For each of the 4 new cs-sections, define **4 stat blocks**, **1 visualization**, and **3-5 feature cards**. Content must be sourced from the project CONTEXT.md / README.md / CLAUDE.md (or your actual knowledge of the project). DO NOT invent.

### Project 05 — portfolio-website

**Stats (4):**
- `<div class="cs-stat-n">7</div><div class="cs-stat-l">pages · single SPA</div>`
- `<div class="cs-stat-n">3</div><div class="cs-stat-l">design systems</div>` (Liquid Glass, Neomorphism, NeoPOP)
- `<div class="cs-stat-n">8</div><div class="cs-stat-l">project cards on top</div>`
- `<div class="cs-stat-n">2</div><div class="cs-stat-l">deploy targets</div>` (Vercel public + Tailscale private)

**Visualization (`vis-wrap`):** A horizontal flow diagram showing the hybrid routing:
```html
<div class="vis-wrap">
  <div class="vis-title">hybrid routing · public vs private</div>
  <div style="display:flex;gap:8px;align-items:center;justify-content:center;padding:20px 0;flex-wrap:wrap">
    <span class="cs-tech">/</span>
    <span style="opacity:.5">→</span>
    <span class="cs-tech">Vercel CDN</span>
    <span style="opacity:.5">→</span>
    <span class="cs-tech">/</span>
    <span class="cs-tech">/projects</span>
    <span class="cs-tech">/roadmap</span>
    <span class="cs-tech">/about</span>
    <span style="opacity:.5">|</span>
    <span class="cs-tech">/me/*</span>
    <span style="opacity:.5">→</span>
    <span class="cs-tech">Caddy Tailscale-gate</span>
    <span style="opacity:.5">→</span>
    <span class="cs-tech">athena:8900</span>
  </div>
</div>
```

**Feature cards (3):**
- 📐 `Hybrid Hosting` — Public routes on Vercel CDN + private `/me/*` behind Tailscale + Caddy IP allowlist on athena
- 🎨 `3 Design Systems` — Liquid Glass (nav/frames), Neomorphism (widgets), NeoPOP (CTAs) layered together
- ⚡ `Single SPA` — `portfolio-combined.html` consolidates all 5 standalone prototype pages into one experience

### Project 06 — hermes-desktop-oauth

**Stats (4):**
- `<div class="cs-stat-n">13</div><div class="cs-stat-l">PRs merged</div>`
- `<div class="cs-stat-n">4</div><div class="cs-stat-l">phases shipped</div>`
- `<div class="cs-stat-n">38</div><div class="cs-stat-l">tests pass</div>`
- `<div class="cs-stat-n">1</div><div class="cs-stat-l">upstream PR pending</div>`

**Visualization:** A 4-phase timeline showing the OAuth fork work:
```html
<div class="vis-wrap">
  <div class="vis-title">OAuth fork · 4 phases</div>
  <div style="display:flex;gap:6px;align-items:center;justify-content:center;padding:16px 0;flex-wrap:wrap">
    <span class="cs-badge cb-green">P1 audit</span>
    <span style="opacity:.5">→</span>
    <span class="cs-badge cb-green">P2 OAuth flow</span>
    <span style="opacity:.5">→</span>
    <span class="cs-badge cb-green">P3 Mac e2e</span>
    <span style="opacity:.5">→</span>
    <span class="cs-badge cb-amber">P4 upstream</span>
  </div>
</div>
```

**Feature cards (4):**
- 🔐 `Nous Portal OAuth` — Replaces `?token=` URL auth with proper OAuth code path so the community app can talk to gated dashboards
- 🎟️ `Single-Use WS Tickets` — Mints per-connection WS auth tickets that don't get burned by probes before the renderer can use them
- 🔍 `Provider Discovery` — Discovers dashboard auth providers from `/api/status` instead of hardcoding `nous` — community-portable
- 🧪 `38/38 Tests` — Vitest suite covers IPC channels, OAuth flow, WS ticket lifecycle, dashboard connection

### Project 07 — openclaw-dashboard

**Stats (4):**
- `<div class="cs-stat-n">3</div><div class="cs-stat-l">routes</div>` (`/dashboard`, `/chat`, `/theme-test`)
- `<div class="cs-stat-n">7</div><div class="cs-stat-l">agents orchestrated</div>` (Claude Code, Codex, agy, abacus, opencode, gh-copilot, gemini)
- `<div class="cs-stat-n">2</div><div class="cs-stat-l">themes</div>` (hybrid-dark primary, hybrid-light)
- `<div class="cs-stat-n">1</div><div class="cs-stat-l">gateway port</div>` (`ws://127.0.0.1:18789`)

**Visualization:** The 3 routes in a 3-column layout:
```html
<div class="vis-wrap">
  <div class="vis-title">3 routes · AppShell layout</div>
  <div style="display:flex;gap:8px;align-items:center;justify-content:center;padding:16px 0;flex-wrap:wrap">
    <span class="cs-tech">/dashboard</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">/chat</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">/theme-test</span>
  </div>
</div>
```

**Feature cards (3):**
- 🌐 `WebSocket RPC` — Ed25519 device identity + RPC client connecting to OpenClaw gateway over `ws://127.0.0.1:18789`
- 🎨 `NeoPOP + Neumorphism` — Hybrid design system via `@cred/neopop-web`, tokens in `src/theme/tokens.ts`, two themes (dark + light)
- ⚡ `Command Palette` — Keyboard-first navigation in `src/components/commands/`, slash commands like `/network` and `/agent` in chat

### Project 08 — unilox-fitness-ai

**Stats (4):**
- `<div class="cs-stat-n">7</div><div class="cs-stat-l">AI modules</div>` (CV Trainer, Dietician, IoT Assistant, Habit Tracker, Virtual Buddy, Pose-Performance, Recommender)
- `<div class="cs-stat-n">3</div><div class="cs-stat-l">deploy targets</div>` (Next.js web, React Native mobile, edge devices)
- `<div class="cs-stat-n">5</div><div class="cs-stat-l">IoT edge devices</div>` (Jetson Nano, RPi 5, ESP32-CAM)
- `<div class="cs-stat-n">0</div><div class="cs-stat-l">shipping yet</div>` (Phase 0 spec only)

**Visualization:** The 7 AI modules in a flowing row:
```html
<div class="vis-wrap">
  <div class="vis-title">7 AI modules</div>
  <div style="display:flex;gap:6px;align-items:center;justify-content:center;padding:16px 0;flex-wrap:wrap">
    <span class="cs-tech">CV Trainer</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">Dietician</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">IoT Asst</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">Habit Trk</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">Buddy</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">Pose</span>
    <span style="opacity:.5">·</span>
    <span class="cs-tech">Recommender</span>
  </div>
</div>
```

**Feature cards (3):**
- 📷 `Computer Vision` — MediaPipe Pose + custom CNN heads for rep counting, form scoring, biomechanical analysis
- 🤖 `7 AI Modules` — Combines CV + NLP + IoT + behavioral ML + conversational AI in a single ecosystem
- 📡 `Edge + Cloud` — MQTT (Mosquitto) on Jetson Nano / RPi 5 / ESP32-CAM, FastAPI backend, MLflow for experiment tracking

---

## CSS verification

Before dispatching, verify these classes already exist in the CSS:
- `cs-stats`, `cs-stat`, `cs-stat-n`, `cs-stat-l`
- `vis-wrap`, `vis-title`
- `feat-list`, `feat`, `feat-icon`, `feat-title`, `feat-desc`
- `proj-nav`, `pnav-btn`

```bash
grep -E '\.cs-stats\s*\{|\.vis-wrap\s*\{|\.feat-list\s*\{|\.proj-nav\s*\{' prototypes/portfolio-combined.html
```

If any are missing, the kickoff author (Hermes) needs to add them before this dispatch. **DO NOT invent new CSS classes for this fix.**

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT change `portfolio-combined.html` outside the 8 cs-sections + the post-orlon-bot area.
- DO NOT touch the `.pi` cards at the top (already polished).
- DO NOT touch widget #11 CONTACT or any other widgets on the homepage.
- DO NOT change the sec-head "all projects" + "view all →" arrow.
- DO NOT remove or change the existing rich content (cs-stats/feat-list/vis-wrap) in the existing 4 cs-sections.
- Use the EXACT stats numbers, feature card text, and visualization structure from the source-of-truth tables above.
- Use existing CSS classes — do not invent new ones.

---

## Verification

```bash
# 1. cs-title multi-line should now be 0
grep -E 'cs-title">[^<]*<br' prototypes/portfolio-combined.html
# Expected: 0 matches

# 2. proj-nav inside cs-sections should now be 1 (only orlon-bot)
awk '/<section class="cs-section"/,/<\/section>/' prototypes/portfolio-combined.html | grep -c 'proj-nav'
# Expected: 1

# 3. proj-nav total in file should be 2 (1 inside orlon-bot, 1 outside all cs-sections at the bottom)
grep -c 'class="proj-nav"' prototypes/portfolio-combined.html
# Expected: 2
```bash
# 4. Each cs-section should have cs-stats
grep -c 'class="cs-stats"' prototypes/portfolio-combined.html
# Expected: 8 (one per cs-section)

# 5. Each cs-section should have vis-wrap
grep -c 'class="vis-wrap"' prototypes/portfolio-combined.html
# Expected: 8

# 6. feat-list count
grep -c 'class="feat-list"' prototypes/portfolio-combined.html
# Expected: 8 (one per cs-section — add feat-list to all 4 new cs-sections for consistency)
```

If playwright works, take a full-page screenshot at `/tmp/projects-with-rich-sections.png` showing the 8 cs-sections.

---

## Definition of Done

1. `git diff` shows: (a) 2 cs-title `<br>` removals, (b) 4 proj-nav blocks REMOVED from new cs-sections, (c) 1 proj-nav block ADDED at bottom of /projects, (d) 4 new `cs-stats`, 4 new `vis-wrap`, 4 new `feat-list` blocks. **No other changes.**
2. grep verifications pass.
3. Commit: `polish(projects): rich content in new cs-sections + single-line cs-titles + bottom-only proj-nav`
4. Push: `git push origin feat/polish-task3`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation all 3 fixes succeeded, (b) grep verification results, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: ~25 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- Stay on `feat/polish-task3` branch — DO NOT create a new branch.
- Use existing CSS classes only.

---

## Failure modes to avoid

- **Don't dispatch before reading all 4 per-project content tables** — every stat number and feature text is specified exactly.
- **Don't add new CSS classes** — all the ones you need already exist.
- **Don't put proj-nav back inside any of the 4 new cs-sections** — that's exactly what Fix 2 removes.
- **Don't change the existing 4 cs-sections' rich content** — only ADD to the new 4.
- **Don't change any of the existing 4 cs-titles** (only the 2 multi-line ones need fixing).
