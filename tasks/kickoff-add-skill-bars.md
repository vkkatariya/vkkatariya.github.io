# Kickoff: Add scored skill bars to each project cs-section

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (single-file HTML edit, replaces `.cs-stack` chips with `.cs-skills` bars)

---

## Goal

Replace the existing `.cs-stack` chip row (plain colored pills) in each of the 8 project cs-sections on `/projects` with a **scored skill bar widget**. Each project gets 5 bars showing its top 5 techs, scored by usage depth, color-coded automatically.

This makes each project visually distinct and informative at a glance.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radra/dev-shared/projects/portfolio-website/`
- **Branch:** Create new branch `feat/cs-skills-bars` from `dev`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Source-of-truth: 8 project skill lists

Score band rules:
- **80-100** (green, primary): "Built core architecture with this; would choose again first"
- **65-79** (blue, production): "Shipped to users; comfortable debugging at any layer"
- **50-64** (amber, working): "Used for a real feature, but I'd Google basic syntax"
- **Below 50**: OMIT (don't pad lists with skills you barely used)

Per-project top-5, sorted by score descending (highest first):

### finance-buddy (private finance tracker, prototype complete)

| Tech | Score | Reason |
|---|---|---|
| SvelteKit + TypeScript | 90 | Core frontend framework, all 12 routes |
| Fastify (REST API) | 88 | Every API endpoint |
| PostgreSQL 16 | 85 | All 993 real transactions live here |
| Chart.js 4.x | 75 | Bar chart + donut chart on dashboard |
| Docker + Caddy | 70 | Deploy to `buddy.auxois-wyrm.ts.net` |

(Drop: Drizzle ORM — only setup, didn't write queries; Tailscale — networking layer not code; Argon2 JWT — library call, not deep use)

### homelab (realtime ops dashboard, prototype complete)

| Tech | Score | Reason |
|---|---|---|
| Fastify + TypeScript | 90 | All HTTP + WS routes |
| WebSocket (ws) | 85 | Core realtime data stream |
| Tailscale file-cert | 85 | Public exposure is Tailscale-only — load-bearing |
| Docker + Caddy | 80 | Production deploy stack |
| NothingOS CSS | 70 | Whole UI is built in this design language |

(Drop: systeminformation npm — single import; pm2 — daemon wrapper, not code; Notion MCP — integration glue)

### typeshift (cross-platform AI writing assistant, in progress)

| Tech | Score | Reason |
|---|---|---|
| Swift / SwiftUI | 85 | macOS native client — primary platform |
| Kotlin | 80 | Android native client — second platform |
| GitHub Actions | 75 | Multi-platform CI/CD setup |
| Shared AI API backend | 70 | All three clients consume this |
| C# / WinUI 3 | 65 | Windows client (least mature of the three) |

(All 5 — typeshift has clean stack, no fluff to drop)

### orlon-bot (Telegram bot with custom QLoRA model, in progress)

| Tech | Score | Reason |
|---|---|---|
| Telegram Bot API | 95 | Primary interface — every message goes through it |
| Python | 90 | Everything is Python — training, inference, bot glue |
| Unsloth | 85 | Training pipeline kernel optimization |
| QLoRA (PEFT) | 85 | Core fine-tuning technique |
| Kaggle T4 GPU | 80 | Training hardware constraint |

(Drop: rkllama NPU, Rock 5T — those are runtime infra, not code; pm2 — process wrapper)

### portfolio-website (this site, live)

| Tech | Score | Reason |
|---|---|---|
| Tailscale | 95 | All `/me/*` routes gate on it — load-bearing |
| Vercel | 85 | Public deploy platform — every page serves from here |
| SvelteKit | 85 | Whole SPA framework |
| Liquid Glass | 75 | Core design system surface |
| (only 4 — no fifth meaningful skill) | — | — |

**Special case:** portfolio-website has only 4 real skills (the rest of the stack is not "code I wrote"). Keep it at 4 bars; don't pad.

### hermes-desktop-oauth (Electron desktop client, 13 PRs merged)

| Tech | Score | Reason |
|---|---|---|
| Electron | 95 | The whole app — IPC + main + preload + renderer |
| React 18 | 85 | All UI components |
| Vite | 80 | Build tooling + dev server |
| Tailwind | 75 | UI styling throughout |
| better-sqlite3 | 70 | Native module, rebuilt for Electron ABI |

(Drop: TypeScript — language, not a stack entry; counted under "React 18 + Vite" implicitly)

### openclaw-dashboard (control UI for OpenClaw gateway, active dev)

| Tech | Score | Reason |
|---|---|---|
| React | 95 | All components, all routes |
| TypeScript | 90 | Strict mode throughout |
| WebSocket | 85 | RPC client is core feature |
| Neopop | 75 | Component library wrapping |

(Only 4 — clean stack, no padding)

### unilox-fitness-ai (AI Gym & Fitness Assistant, Phase 0 spec)

| Tech | Score | Reason |
|---|---|---|
| MQTT | 85 | IoT backbone — 7 modules depend on device telemetry |
| Next.js 14 | 80 | Web dashboard (App Router + RSC) |
| FastAPI | 80 | Backend API + WebSocket gateway |
| MediaPipe | 75 | CV pose estimation — flagship module |
| PostgreSQL | 70 | Primary datastore |

(Drop: HuggingFace — used but spec-only; counts under NLP module not code)

---

## Visual spec

```
┌─ STACK ────────────────────────────────────────┐
│  SvelteKit + TypeScript    ███████████░  90    │
│  Fastify (REST API)        ███████████░  88    │
│  PostgreSQL 16             ██████████░░  85    │
│  Chart.js 4.x              █████████░░  75    │
│  Docker + Caddy            ████████░░░  70    │
└───────────────────────────────────────────────┘
```

Each row:
- **Left:** tech name (existing `cs-tech` styling — `font-family: 'JetBrains Mono', monospace; font-size: 11px`)
- **Middle:** bar with colored fill on dim grey track
  - Track: `var(--w06)` or similar low-opacity white
  - Fill: auto-colored by score band (see below)
  - Bar height: 5px
  - Border radius: 3px
- **Right:** score number (small, dim, right-aligned, monospace)

Color bands (auto):
- 80-100: `var(--green)` (#3DDC84)
- 65-79: `var(--acc)` (or `--blue`, whatever the existing accent is)
- 50-64: `var(--amber)` (orange/amber)
- Below 50: omit (do not show this row)

---

## Implementation

### HTML structure (replaces existing `.cs-stack`)

```html
<div class="cs-h">stack</div>
<div class="cs-skills">
  <div class="cs-skills-row">
    <span class="cs-skills-name">SvelteKit + TypeScript</span>
    <div class="cs-skills-bar"><div class="cs-skills-fill s-high" style="width:90%"></div></div>
    <span class="cs-skills-score">90</span>
  </div>
  <div class="cs-skills-row">
    <span class="cs-skills-name">Fastify (REST API)</span>
    <div class="cs-skills-bar"><div class="cs-skills-fill s-high" style="width:88%"></div></div>
    <span class="cs-skills-score">88</span>
  </div>
  <!-- ... 3-4 more rows ... -->
</div>
```

### CSS to add (place near the existing `.cs-stack` rule, around line 2130)

```css
.cs-skills{
  display:flex;flex-direction:column;gap:10px;
  margin-bottom:32px;
}
.cs-skills-row{
  display:grid;
  grid-template-columns: 200px 1fr 32px;
  gap:14px;align-items:center;
  font-size:11px;
}
.cs-skills-name{
  font-family:'JetBrains Mono',monospace;
  color:var(--w60);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.cs-skills-bar{
  height:5px;border-radius:3px;
  background:var(--w06);
  overflow:hidden;
}
.cs-skills-fill{
  height:100%;border-radius:3px;
  transition:width .4s ease;
}
.cs-skills-fill.s-high{background:var(--green)}
.cs-skills-fill.s-mid{background:var(--acc)}
.cs-skills-fill.s-low{background:var(--amber)}
.cs-skills-score{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;color:var(--w30);
  text-align:right;
}
@media(max-width:700px){
  .cs-skills-row{grid-template-columns:120px 1fr 28px;gap:8px}
}
```

(Verify the exact variable names by grepping the existing CSS for `--green`, `--acc`, `--amber`, `--w06`, `--w30`, `--w60` — use what's already defined, don't invent.)

### Mapping score to band class

- 80-100 → `s-high`
- 65-79 → `s-mid`
- 50-64 → `s-low`
- Below 50 → omit row entirely

### Hard rule: REMOVE existing `.cs-stack` div

For each of the 8 cs-sections, **delete** the entire `<div class="cs-stack">...</div>` block (it's being replaced). The new `.cs-skills` div takes its place.

After the change, search for `class="cs-stack"` should return 0 results.

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT touch the existing `.cs-tech` chip CSS rule (other parts of the page may still use it — verify with grep first).
- DO NOT touch the `.pi-tag` chips (different class, used elsewhere).
- DO NOT change the `.pi` cards on /projects — only the cs-sections deep-dive content.
- DO NOT change the sec-head "all projects" + "view all →" arrow.
- DO NOT change the existing 4 cs-section's `.cs-hero` or `.cs-body` content.
- Use the **EXACT tech names** from the source-of-truth tables above. Don't rename.
- Use the **EXACT scores** from the tables. Don't reassign.
- If a project has <5 skills (e.g., portfolio-website has 4), keep it at 4. Don't pad.

---

## Verification

```bash
# 1. Confirm old .cs-stack blocks gone (should be 0)
grep -c 'class="cs-stack"' prototypes/portfolio-combined.html
# Expected: 0

# 2. Confirm new .cs-skills blocks added (should be 8)
grep -c 'class="cs-skills"' prototypes/portfolio-combined.html
# Expected: 8

# 3. Confirm score counts per project
# Total rows across all 8 sections: 4+5+5+5+4+5+4+5 = 37
grep -c 'class="cs-skills-row"' prototypes/portfolio-combined.html
# Expected: 37

# 4. Confirm color band classes used
grep -c 's-high' prototypes/portfolio-combined.html
grep -c 's-mid' prototypes/portfolio-combined.html
grep -c 's-low' prototypes/portfolio-combined.html
# Expected: matches the band counts in the source-of-truth tables
```

If playwright works, take a full-page screenshot at `/tmp/projects-with-skill-bars.png` showing the 8 cs-sections with bars.

---

## Definition of Done

1. `git diff` shows: (a) `.cs-stack` blocks DELETED for all 8 cs-sections, (b) `.cs-skills` blocks ADDED with exact scores + names from the tables above, (c) new CSS rules added near `.cs-stack`. **No other changes.**
2. grep verifications pass: 0 `.cs-stack`, 8 `.cs-skills`, 37 `.cs-skills-row`.
3. Commit: `feat(projects): replace cs-stack chips with scored skill bars`
4. Push: `git push -u origin feat/cs-skills-bars`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation all 8 sections updated, (b) grep verification results, (c) commit hash + branch name, (d) any deviations.

---

## Constraints

- Time budget: ~20 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- Use exact names + scores from source-of-truth tables.
- Total tech count: 37 rows across 8 sections.

---

## Failure modes to avoid

- **Don't dispatch before reading all 8 source-of-truth tables** — every score is specified exactly.
- **Don't reuse existing `.cs-stack` chip styling** — that's the old design. Use the new `.cs-skills-*` classes.
- **Don't add a 5th skill to portfolio-website** — it has 4 real ones. Pad = drift.
- **Don't change the variable names** in the CSS (`--green`, `--acc`, etc.) — use what's already defined in the file.
- **Don't touch the `<svg width="40" height="40">` icons in cs-sections** — different task; if those are still there, leave them.
