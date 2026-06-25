<!--- Kickoff: Replace basic SVG icons with rich vis-wrap visualizations in new 4 cs-sections -->

# Kickoff: Replace basic SVG icons with rich vis-wrap visualizations in new 4 cs-sections

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (HTML/CSS additions to 4 cs-sections)

---

## Goal

The 4 new cs-sections (`portfolio-website`, `hermes-desktop-oauth`, `openclaw-dashboard`, `unilox-fitness-ai`) currently have only a tiny 40×40 decorative SVG in the cs-hero corner. User calls this "pretty basic" — wants it upgraded to **rich vis-wrap visualizations matching the existing 4 projects** (finance-buddy, homelab, typeshift, orlon-bot).

The existing 4 each have a `vis-wrap` block with custom CSS class visualizations:
- **finance-buddy**: `<div class="bar-chart" id="financeChart">` — animated bar chart (real SVG)
- **homelab**: `<div class="node-diagram">` — 2-node infrastructure diagram with services
- **typeshift**: `<div class="platform-grid">` — 3 platform cards (Android / macOS / Windows)
- **orlon-bot**: `<div class="pipeline">` — 5-stage ML pipeline with arrows

The new 4 need similar rich vis-wrap content matching their project's domain.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** Stay on `feat/polish-task3` (currently active)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Current state (verified)

| Section | vis-wrap | cs-stats | feat-list | Tiny 40×40 SVG |
|---|---|---|---|---|
| finance-buddy | ✓ (bar-chart) | ✓ | ✓ | ❌ |
| homelab | ✓ (node-diagram) | ✓ | ✓ | ❌ |
| typeshift | ✓ (platform-grid) | ✓ | ✗ | ❌ |
| orlon-bot | ✓ (pipeline) | ✓ | ✗ | ❌ |
| portfolio-website | ✗ | ✗ | ✗ | ✓ |
| hermes-desktop-oauth | ✗ | ✗ | ✗ | ✓ |
| openclaw-dashboard | ✗ | ✗ | ✗ | ✓ |
| unilox-fitness-ai | ✗ | ✗ | ✗ | ✓ |

**Goal:** Add rich vis-wrap blocks to the 4 new cs-sections matching the existing 4's quality + diversity.

---

## Fix: Add vis-wrap blocks to each new cs-section

For each of the 4 new cs-sections, add a `vis-wrap` block between `cs-hero` and `cs-body` (same position as existing 4). Remove the small 40×40 decorative SVG from the cs-hero (it's being replaced).

### Common vis-wrap structure

```html
<div class="vis-wrap">
  <div class="vis-title">caption describing the visualization</div>
  <div class="<project-specific-class>">
    <!-- rich content: SVG, diagram, grid, etc -->
  </div>
</div>
```

The existing vis-wraps use these wrapper classes: `bar-chart`, `node-diagram`, `platform-grid`, `pipeline`. For the new 4, use **NEW classes** (don't conflict): e.g., `routing-flow`, `phase-timeline`, `route-flow`, `module-pipeline`.

---

### Project 05 — portfolio-website (Hybrid routing diagram)

**Caption:** `hybrid routing · public vs private`

**Class:** `routing-flow`

**Content:** Show the split between public (Vercel) and private (Tailscale → athena) routes. Example structure (use SVG with two paths):

```html
<div class="routing-flow">
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;margin:0 auto;display:block">
    <!-- Incoming request node -->
    <rect x="170" y="10" width="60" height="32" rx="6" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
    <text x="200" y="30" text-anchor="middle" fill="rgba(255,255,255,.7)" font-size="11" font-family="JetBrains Mono">request</text>
    
    <!-- Path 1: Public (Vercel) -->
    <path d="M 200 42 L 200 65" stroke="rgba(255,255,255,.3)" stroke-width="1" fill="none"/>
    <path d="M 200 65 L 100 90" stroke="var(--green)" stroke-width="1.5" fill="none" marker-end="url(#arrow-green)"/>
    <rect x="40" y="90" width="120" height="40" rx="6" fill="none" stroke="var(--green)" stroke-width="1"/>
    <text x="100" y="108" text-anchor="middle" fill="var(--green)" font-size="11" font-family="JetBrains Mono">/  /projects</text>
    <text x="100" y="122" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="9" font-family="JetBrains Mono">Vercel CDN</text>
    
    <!-- Path 2: Private (Tailscale) -->
    <path d="M 200 65 L 300 90" stroke="var(--blue)" stroke-width="1.5" fill="none" marker-end="url(#arrow-blue)"/>
    <rect x="240" y="90" width="120" height="40" rx="6" fill="none" stroke="var(--blue)" stroke-width="1"/>
    <text x="300" y="108" text-anchor="middle" fill="var(--blue)" font-size="11" font-family="JetBrains Mono">/me/*</text>
    <text x="300" y="122" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="9" font-family="JetBrains Mono">Tailscale gate</text>
    
    <!-- Arrow markers -->
    <defs>
      <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" fill="var(--green)"/>
      </marker>
      <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" fill="var(--blue)"/>
      </marker>
    </defs>
  </svg>
</div>
```

---

### Project 06 — hermes-desktop-oauth (4-phase timeline)

**Caption:** `OAuth fork · 4 phases · 13 PRs`

**Class:** `phase-timeline`

**Content:** A horizontal timeline showing the 4 phases of work with status colors. Use SVG with 4 nodes:

```html
<div class="phase-timeline">
  <svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;margin:0 auto;display:block">
    <!-- Connecting line -->
    <line x1="80" y1="50" x2="520" y2="50" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    
    <!-- Phase 1 -->
    <circle cx="100" cy="50" r="14" fill="var(--green)"/>
    <text x="100" y="55" text-anchor="middle" fill="#000" font-size="11" font-weight="bold" font-family="JetBrains Mono">1</text>
    <text x="100" y="90" text-anchor="middle" fill="var(--w60)" font-size="10" font-family="JetBrains Mono">audit</text>
    <text x="100" y="105" text-anchor="middle" fill="var(--green)" font-size="9" font-family="JetBrains Mono">3 PRs</text>
    
    <!-- Phase 2 -->
    <circle cx="240" cy="50" r="14" fill="var(--green)"/>
    <text x="240" y="55" text-anchor="middle" fill="#000" font-size="11" font-weight="bold" font-family="JetBrains Mono">2</text>
    <text x="240" y="90" text-anchor="middle" fill="var(--w60)" font-size="10" font-family="JetBrains Mono">oauth flow</text>
    <text x="240" y="105" text-anchor="middle" fill="var(--green)" font-size="9" font-family="JetBrains Mono">5 PRs</text>
    
    <!-- Phase 3 -->
    <circle cx="380" cy="50" r="14" fill="var(--green)"/>
    <text x="380" y="55" text-anchor="middle" fill="#000" font-size="11" font-weight="bold" font-family="JetBrains Mono">3</text>
    <text x="380" y="90" text-anchor="middle" fill="var(--w60)" font-size="10" font-family="JetBrains Mono">mac e2e</text>
    <text x="380" y="105" text-anchor="middle" fill="var(--green)" font-size="9" font-family="JetBrains Mono">5 PRs</text>
    
    <!-- Phase 4 -->
    <circle cx="520" cy="50" r="14" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="3 2"/>
    <text x="520" y="55" text-anchor="middle" fill="var(--amber)" font-size="11" font-weight="bold" font-family="JetBrains Mono">4</text>
    <text x="520" y="90" text-anchor="middle" fill="var(--w60)" font-size="10" font-family="JetBrains Mono">upstream</text>
    <text x="520" y="105" text-anchor="middle" fill="var(--amber)" font-size="9" font-family="JetBrains Mono">pending</text>
  </svg>
</div>
```

---

### Project 07 — openclaw-dashboard (Route + gateway flow)

**Caption:** `routes · WebSocket RPC to gateway`

**Class:** `route-flow`

**Content:** Show the 3 routes connecting to the OpenClaw gateway via WebSocket:

```html
<div class="route-flow">
  <svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;margin:0 auto;display:block">
    <!-- Three route nodes (left) -->
    <rect x="20" y="20" width="100" height="32" rx="6" fill="none" stroke="var(--acc)" stroke-width="1"/>
    <text x="70" y="40" text-anchor="middle" fill="var(--acc)" font-size="11" font-family="JetBrains Mono">/dashboard</text>
    
    <rect x="20" y="74" width="100" height="32" rx="6" fill="none" stroke="var(--acc)" stroke-width="1"/>
    <text x="70" y="94" text-anchor="middle" fill="var(--acc)" font-size="11" font-family="JetBrains Mono">/chat</text>
    
    <rect x="20" y="128" width="100" height="32" rx="6" fill="none" stroke="var(--acc)" stroke-width="1"/>
    <text x="70" y="148" text-anchor="middle" fill="var(--acc)" font-size="11" font-family="JetBrains Mono">/theme-test</text>
    
    <!-- WebSocket lines -->
    <path d="M 120 36 L 240 90" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-dasharray="4 2" fill="none"/>
    <path d="M 120 90 L 240 90" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-dasharray="4 2" fill="none"/>
    <path d="M 120 144 L 240 90" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-dasharray="4 2" fill="none"/>
    
    <!-- Gateway node (right) -->
    <rect x="240" y="60" width="160" height="60" rx="10" fill="none" stroke="var(--green)" stroke-width="2"/>
    <text x="320" y="84" text-anchor="middle" fill="var(--green)" font-size="13" font-family="JetBrains Mono">OpenClaw gateway</text>
    <text x="320" y="102" text-anchor="middle" fill="var(--w30)" font-size="10" font-family="JetBrains Mono">ws://127.0.0.1:18789</text>
    
    <!-- Label on line -->
    <text x="180" y="80" text-anchor="middle" fill="var(--w30)" font-size="9" font-family="JetBrains Mono">WS RPC</text>
  </svg>
</div>
```

---

### Project 08 — unilox-fitness-ai (7-module pipeline)

**Caption:** `7 AI modules · edge to cloud`

**Class:** `module-pipeline`

**Content:** Show the 7 modules in a flow with edge devices at the start:

```html
<div class="module-pipeline">
  <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
    <!-- Edge devices (left) -->
    <rect x="10" y="20" width="80" height="32" rx="6" fill="none" stroke="var(--blue)" stroke-width="1"/>
    <text x="50" y="40" text-anchor="middle" fill="var(--blue)" font-size="10" font-family="JetBrains Mono">Jetson</text>
    
    <rect x="10" y="64" width="80" height="32" rx="6" fill="none" stroke="var(--blue)" stroke-width="1"/>
    <text x="50" y="84" text-anchor="middle" fill="var(--blue)" font-size="10" font-family="JetBrains Mono">RPi 5</text>
    
    <rect x="10" y="108" width="80" height="32" rx="6" fill="none" stroke="var(--blue)" stroke-width="1"/>
    <text x="50" y="128" text-anchor="middle" fill="var(--blue)" font-size="10" font-family="JetBrains Mono">ESP32-CAM</text>
    
    <!-- MQTT hub -->
    <rect x="120" y="64" width="80" height="32" rx="6" fill="var(--green)" stroke="var(--green)" stroke-width="1"/>
    <text x="160" y="84" text-anchor="middle" fill="#000" font-size="11" font-family="JetBrains Mono" font-weight="bold">MQTT</text>
    
    <!-- Connecting lines from devices to MQTT -->
    <path d="M 90 36 L 120 80" stroke="rgba(255,255,255,.2)" stroke-width="1" fill="none"/>
    <path d="M 90 80 L 120 80" stroke="rgba(255,255,255,.2)" stroke-width="1" fill="none"/>
    <path d="M 90 124 L 120 84" stroke="rgba(255,255,255,.2)" stroke-width="1" fill="none"/>
    
    <!-- 7 modules (right side, 2 rows) -->
    <g font-family="JetBrains Mono" font-size="10" fill="var(--w60)">
      <rect x="240" y="10" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="290" y="25" text-anchor="middle">CV Trainer</text>
      
      <rect x="350" y="10" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="400" y="25" text-anchor="middle">Dietician</text>
      
      <rect x="460" y="10" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="510" y="25" text-anchor="middle">Habit Trk</text>
      
      <rect x="570" y="10" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="620" y="25" text-anchor="middle">Buddy</text>
      
      <rect x="240" y="40" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="290" y="55" text-anchor="middle">Pose Perf</text>
      
      <rect x="350" y="40" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="400" y="55" text-anchor="middle">Recommender</text>
      
      <rect x="460" y="40" width="100" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="510" y="55" text-anchor="middle">IoT Asst</text>
    </g>
    
    <!-- Connecting line from MQTT to module row -->
    <path d="M 200 80 L 230 32" stroke="rgba(255,255,255,.2)" stroke-width="1" fill="none"/>
    
    <!-- Cloud label -->
    <text x="450" y="100" text-anchor="middle" fill="var(--w30)" font-size="9" font-family="JetBrains Mono">FastAPI + MLflow + HuggingFace</text>
  </svg>
</div>
```

---

## CSS to add

Add these CSS rules near the existing `.vis-wrap` styles (around line 1455):

```css
.routing-flow, .phase-timeline, .route-flow, .module-pipeline {
  padding: 20px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.routing-flow svg, .phase-timeline svg, .route-flow svg, .module-pipeline svg {
  height: auto;
}
```

(These are minimal — SVGs are mostly self-contained. Adjust if your SVG renders at wrong size.)

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT change the existing 4 cs-sections' vis-wrap content (those are good).
- DO NOT touch the `.cs-skills` block (skill bars task is separate).
- DO NOT change the cs-body or cs-stack content.
- DO NOT remove the cs-hero, only remove the small 40×40 decorative `<svg>` inside it (replaced by the rich vis-wrap below).
- DO NOT change the existing CSS classes (`.vis-wrap`, `.vis-title`, `.bar-chart`, `.node-diagram`, `.platform-grid`, `.pipeline`) — they stay as-is for the existing 4.
- USE NEW CLASS NAMES for the 4 new vis-wrap wrappers: `.routing-flow`, `.phase-timeline`, `.route-flow`, `.module-pipeline`. Do not reuse existing class names.

---

## Verification

```bash
# 1. Each new cs-section has a vis-wrap (4 total, one each)
grep -c '<div class="vis-wrap">' prototypes/portfolio-combined.html
# Expected: 8 (4 existing + 4 new)

# 2. Each new vis-wrap has a vis-title
grep -c 'class="vis-title"' prototypes/portfolio-combined.html
# Expected: 8

# 3. New wrapper classes are present (one each)
grep -c 'class="routing-flow"' prototypes/portfolio-combined.html
grep -c 'class="phase-timeline"' prototypes/portfolio-combined.html
grep -c 'class="route-flow"' prototypes/portfolio-combined.html
grep -c 'class="module-pipeline"' prototypes/portfolio-combined.html
# Expected: 1, 1, 1, 1

# 4. Tiny 40×40 decorative SVGs are gone from new cs-sections
# (they were in cs-hero at width="40" height="40")
grep -c 'width="40" height="40"' prototypes/portfolio-combined.html
# Expected: 0

# 5. SVG count increased (each new vis-wrap has its own SVG)
grep -c '<svg viewBox' prototypes/portfolio-combined.html
# Expected: 4+ (depends on existing — at least 4 from new vis-wraps)
```

If playwright works, take a full-page screenshot at `/tmp/projects-with-rich-viswraps.png` showing the 4 new cs-sections with their visualizations.

---

## Definition of Done

1. `git diff` shows: (a) 4 new `vis-wrap` blocks added to the new cs-sections (one each), (b) 4 small 40×40 decorative SVGs removed from cs-heroes of new sections, (c) new CSS rules added for `.routing-flow`, `.phase-timeline`, `.route-flow`, `.module-pipeline`. **No other changes.**
2. grep verifications pass.
3. Commit: `feat(projects): rich vis-wrap visualizations for new cs-sections`
4. Push: `git push origin feat/polish-task3`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation all 4 vis-wraps added, (b) grep verification results, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: ~25 minutes (4 SVGs to write is non-trivial).
- Single file: `prototypes/portfolio-combined.html`.
- SVG must be self-contained (no external image refs).
- Use existing CSS variables (`var(--green)`, `var(--blue)`, `var(--amber)`, `var(--acc)`, `var(--w30)`, `var(--w60)`).

---

## Failure modes to avoid

- **Don't reuse existing class names** for new vis-wrap wrappers — `.routing-flow`, `.phase-timeline`, etc. must be new.
- **Don't keep the 40×40 decorative SVG** alongside the new rich vis-wrap — it's replaced, not added to.
- **Don't change the existing 4 vis-wraps** — they're already good.
- **Don't use raster images** (PNG/JPG) — SVG only, matching the existing 4's pattern.
- **Don't invent fake project details** — use the actual numbers (13 PRs, 3 routes, 7 modules, etc.).
