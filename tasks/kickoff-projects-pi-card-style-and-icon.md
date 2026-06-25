# Kickoff: `/projects` index cards (`.pi`) — match homepage widget style

## Goal

The 8 `.pi` cards on the `/projects` page currently look **flat and inconsistent** with homepage widgets (`.w` class). The user has explicitly said the homepage widgets have:

1. **Rounded corners** — `.pi` cards have `border-radius:0` (only outer corners of the 2×2 grid get a 16px override via per-`:nth-child` rules; the inner gutter between cards has no rounded shape)
2. **Gap between cards** — `.proj-index` grid uses `gap:2px` (basically touching); homepage `.grid` uses `gap:9px`
3. **SVG icon + uppercase label above the title** — homepage `.w` widgets use `<div class="wlbl-row"><svg>...</svg> label</div>`. `.pi` cards have only a plain `<div class="pi-num">01 / 08</div>` with no icon

End state: the 8 `.pi` cards should visually feel like the same widget family as homepage `.w` widgets.

## Project context

- **Path:** `/home/radxa/dev-shared/projects/portfolio-website`
- **Base branch:** `dev` (current tip `fb4a697`)
- **Working branch:** `fix/projects-pi-card-style-and-icon` (create from `dev`)
- **Files in scope:**
  - `prototypes/portfolio-combined.html` (single file; CSS rules at lines ~1245-1260 + HTML for 8 `.pi` cards at lines 3713-3815)
- **Files NOT in scope:** anything else. Do not touch homepage `.w` widgets, `.cs-section`, `.cs-skills`, or any other selector.

## Current state (verified, line numbers from current `dev`)

**`.proj-index` grid (line 1245-1249):**
```css
.proj-index{
  position:relative;z-index:1;max-width:1100px;margin:0 auto;
  padding:0 20px 40px;
  display:grid;grid-template-columns:1fr 1fr;gap:2px;
}
```
→ `gap:2px` is the issue.

**`.pi` rule (line 1251-1255):**
```css
.pi{
  padding:36px 40px;cursor:pointer;
  border:1px solid var(--w06);border-radius:0;
  transition:background .2s;position:relative;overflow:hidden;
}
```
→ No liquid-glass background, no `box-shadow`, no `backdrop-filter`, `border-radius:0`. The `.pi:hover{background:var(--bg2)}` at line 1256 is the only depth indicator — a flat solid color flip.

**`.pi:nth-child` radius overrides (line 1257-1260):** Four per-corner radius rules that round only the outer corners of the 2×2 grid (`16px 0 0 0` etc.). These create the cluster shape; we keep them.

**`.pi` HTML (8 instances, lines 3713, 3725, 3737, 3749, 3761, 3774, 3789, 3802):**
```html
<a href="javascript:void(0)" class="pi" style="text-decoration:none;color:inherit;padding:22px 24px" onclick="scrollToAnchor('finance-buddy')">
  <div class="pi-num">01 / 08</div>
  <div class="pi-title">Finance Buddy</div>
  <div class="pi-sub">Personal finance tracker</div>
  ...
</a>
```
→ Note the inline `padding:22px 24px` overrides the `.pi` rule's `padding:36px 40px`. We keep that inline override (smaller cards) and don't fight it. The `<div class="pi-num">` is what we replace/add-to.

**`.wlbl-row` rule (line 2138-2142):**
```css
.wlbl-row {
  display: flex; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 3px;
  color: var(--w30); text-transform: uppercase; margin-bottom: 10px;
}
```
→ This is the canonical "icon + uppercase label" row used by homepage `.w` widgets. We reuse this class verbatim.

## What to do

### Step 1 — Fix the gap (`.proj-index`, line 1248)

Change `gap:2px` → `gap:9px`. Match homepage `.grid { gap: 9px }`.

### Step 2 — Give `.pi` liquid-glass surface treatment (line 1251-1255)

Replace the `.pi` rule block with:
```css
.pi{
  padding:36px 40px;cursor:pointer;
  border:1px solid var(--w06);border-radius:14px;
  background:linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  box-shadow:0 4px 20px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.10);
  transition:background .2s, box-shadow .2s, transform .2s;position:relative;overflow:hidden;
}
.pi:hover{
  background:linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
  box-shadow:0 6px 28px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.14);
  transform:translateY(-2px);
}
```

Note: the existing `.pi:hover{background:var(--bg2)}` at line 1256 gets **replaced** by the new hover rule above (which also lifts the card). The per-`:nth-child` radius overrides at lines 1257-1260 stay.

### Step 3 — Add `wlbl-row` icon + label to each `.pi` card (8 instances)

For each of the 8 `.pi` cards, **insert** a `<div class="wlbl-row">...</div>` block immediately **before** the existing `<div class="pi-num">01 / 08</div>` line.

Icon-to-project mapping (each SVG uses the same 13×13 dimensions, monochrome `rgba(255,255,255,.5)` strokes, and uppercase label text matching the homepage pattern):

| Card | pi-num | Label text | SVG concept |
|---|---|---|---|
| 1. Finance Buddy | 01 / 08 | `finance · tracker` | Bar chart icon (3 ascending bars) |
| 2. Homelab Dashboard | 02 / 08 | `homelab · observability` | Server stack icon (3 horizontal lines + dots) |
| 3. TypeShift | 03 / 08 | `typeshift · typing` | Keyboard / keystroke icon (3 key outlines) |
| 4. Orlon Bot | 04 / 08 | `orlon · discord bot` | Chat bubble / node icon |
| 5. Portfolio Website | 05 / 08 | `portfolio · meta` | Browser-window icon (rect + topbar) |
| 6. Hermes Desktop OAuth | 06 / 08 | `hermes · oauth` | Lock + arrow icon |
| 7. OpenClaw Dashboard | 07 / 08 | `openclaw · dashboard` | Grid/dashboard icon (4 squares) |
| 8. UNILOX Fitness AI | 08 / 08 | `unilox · fitness ai` | Activity / pulse icon |

**Format** (matches the existing `.wlbl-row` in homepage `.w` widgets exactly, including inline SVG attributes):

```html
<div class="wlbl-row">
  <svg class="ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
    <!-- 3 bars: short, medium, tall ascending -->
    <rect x="1" y="8" width="2.5" height="4" fill="rgba(255,255,255,.5)"/>
    <rect x="5.25" y="5" width="2.5" height="7" fill="rgba(255,255,255,.5)"/>
    <rect x="9.5" y="2" width="2.5" height="10" fill="rgba(255,255,255,.5)"/>
  </svg>
  finance · tracker
</div>
```

For each card, swap the inner SVG `<path>`/`<rect>`/etc. content per the table above. Keep the outer `<svg>` wrapper identical (same width/height/viewBox/fill). Use simple monochrome geometric shapes (rects, circles, paths with `stroke-width="1"`) — NOT detailed illustrations. Match the visual density of homepage icons.

The `pi-num` line stays unchanged below the new `wlbl-row`.

## Source-of-truth content

**Liquid-glass canonical formula** (from `~/.hermes/skills/autonomous-ai-agents/autonomous-coding-agent-dispatch/references/portfolio-liquid-glass-formula.md`):

```css
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.10),
  rgba(255, 255, 255, 0.04)
);
backdrop-filter: blur(40px) saturate(180%);
-webkit-backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.16);
border-radius: 20px;
box-shadow:
  0 4px 28px rgba(0, 0, 0, 0.55),
  inset 0 1px 0 rgba(255, 255, 255, 0.12);
```

We've scaled the box-shadow down slightly (28px → 20px blur) and the alpha (0.55 → 0.4) for the smaller `.pi` cards — these still match the homepage family without over-shading the smaller cards. **Do NOT change the gradient stops, the border opacity, the backdrop-filter, or the inset highlight** — these are the canonical surface treatment tokens.

## Hard rules

- **DO NOT** modify any homepage `.w` widget CSS or HTML
- **DO NOT** modify `.cs-section`, `.cs-skills`, `.cs-hero`, `.cs-stats`, `.cs-body`, `.vis-wrap`, `.feat-list`, or `.proj-nav` rules
- **DO NOT** touch the per-`:nth-child` border-radius overrides at lines 1257-1260 — they give the 2×2 grid its outer-corner cluster shape
- **DO NOT** touch the inline `padding:22px 24px` on each `.pi` card (line 3713 etc.) — that's intentional for the smaller index-card sizing vs full cs-section sizing
- **DO NOT** remove the existing `.pi-num` div — it stays, we add `wlbl-row` ABOVE it
- **DO NOT** change the `.wlbl-row` rule itself at line 2138 — we reuse it as-is, only adding usage of the class
- **DO NOT** add any new SVG illustrations — use simple geometric primitives (rect, circle, path) at 13×13 viewBox
- **DO NOT** add any new CSS variables, colors, or design tokens
- **DO NOT** touch `/me` page, contact widget, topbar, or any other surface

## Verification (mandatory — do all 6 before declaring done)

1. **CSS grep:** confirm the new `.pi` rule block contains all 6 properties: `linear-gradient`, `backdrop-filter`, `box-shadow`, `inset`, `border-radius:14px`, `gap:9px` (in `.proj-index`)
2. **HTML grep:** confirm exactly 8 `<div class="wlbl-row">` blocks were inserted in `.pi` cards (use `grep -c 'class="wlbl-row"'` before and after — should grow by 8)
3. **SVG sanity:** confirm all 8 new `<svg>` elements have `width="13" height="13" viewBox="0 0 13 13" fill="none"`
4. **No-regression:** confirm 0 of the existing cs-section `.wlbl-row` blocks were touched (use `git diff` and check only the lines near line 3713, 3725, 3737, 3749, 3761, 3774, 3789, 3802 have new content)
5. **pi-num preserved:** confirm all 8 `<div class="pi-num">01 / 08</div>` (etc.) lines are still present and unchanged
6. **Visual sanity (if possible):** open `prototypes/portfolio-combined.html` in a browser, navigate to /projects, confirm:
   - Cards have visible rounded corners
   - Visible gap between cards (not touching)
   - Visible drop shadow under each card
   - Small icon + uppercase label visible above each "01 / 08" number

## Definition of Done

- [ ] All 3 CSS changes applied (Step 1, 2)
- [ ] All 8 HTML insertions applied (Step 3)
- [ ] Verification commands 1-5 pass
- [ ] `git diff --stat` shows ~50-70 line change in `prototypes/portfolio-combined.html`
- [ ] Single commit with message: `fix(projects): apply liquid-glass to .pi cards + add wlbl-row icon row (match homepage style)`
- [ ] Pushed to `origin/fix/projects-pi-card-style-and-icon`
- [ ] `tasks/DEVLOG.md` entry appended (title, scope, files changed, self-verification result)

## Constraints

- **One file only.** No CSS file split, no new HTML file, no JS changes.
- **No new dependencies, no new tokens, no new SVG illustrations.**
- **10-15 minute time budget.** This is a small visual consistency fix, not architecture.
- **Do not push to dev.** The user merges manually after reviewing.

## Failure modes to avoid (from kickoff anatomy reference, L-031)

- **Don't invent SVG icons** — use the 8-row table above as the spec. Don't generate detailed illustrations, don't import icon fonts, don't pull from a CDN.
- **Don't change the per-`:nth-child` radius overrides** — they look like duplicates of `border-radius:14px` on `.pi` but they're the cluster-shape tokens. Removing them flattens the 2×2 visual.
- **Don't add `wlbl-row` inside `.pi-num`** — must be a sibling, not nested. The `.pi-num` div stays untouched.
- **Don't change `padding:22px 24px` to match the canonical 36/40** — the inline override is intentional for index-card sizing.
- **Don't refactor the `.pi:hover` rule into a hover variant of all the new properties** without keeping the `transform:translateY(-2px)` — the lift is the depth signal.