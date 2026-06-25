# Kickoff v2: Polish task #3 — resize all 8 cards, single-line titles, UNILOX rename, remove decorative SVGs

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (single-file HTML edits, 4 specific fixes)

---

## Context

Task #3 was already merged to dev at `0341448`, but the user reviewed the result and found 4 specific issues. This kickoff is the polish pass.

**File in scope:** `prototypes/portfolio-combined.html` ONLY
**Branch:** Create new branch `feat/polish-task3` from `dev`

---

## The 4 fixes

### Fix 1 — Resize all 8 `.pi` cards (smaller)

Currently `.pi` cards use inline `padding:28px 32px`. User wants them **smaller** — apply to **all 8 cards** (existing 4 + new 4).

**Target padding:** `padding:22px 24px` (down from 28/32)

Apply by editing the inline `style` attribute on every `.pi` card's opening `<a>` tag.

Currently affected lines (after the merge):
- Existing 4: `finance-buddy` (≈3654), `homelab` (≈3669), `typeshift` (≈3684), `orlon-bot` (≈3699)
- New 4: `portfolio-website` (≈3718), `hermes-desktop-oauth` (≈3733), `openclaw-dashboard` (≈3752), `unilox-fitness-ai` (≈3768)

**Pattern to find:** `<a href="javascript:void(0)" class="pi" style="text-decoration:none;color:inherit;padding:28px 32px" onclick=`

**Change to:** replace `padding:28px 32px` with `padding:22px 24px` (8 occurrences total)

### Fix 2 — Single-line `.pi-title` for ALL 8 cards

Currently 4 cards have multi-line titles using `<br>`:
- `Homelab<br>Dashboard`
- `Portfolio<br>Website`
- `Hermes One<br>(OAuth fork)`
- `OpenClaw<br>Dashboard`

User wants all project titles on **one line**, like "Finance Buddy", "TypeShift", "orlon-bot" already are.

**Change to:**
- `Homelab<br>Dashboard` → `Homelab Dashboard`
- `Portfolio<br>Website` → `Portfolio Website`
- `Hermes One<br>(OAuth fork)` → `Hermes One (OAuth fork)`
- `OpenClaw<br>Dashboard` → `OpenClaw Dashboard`

The other 4 cards (`Finance Buddy`, `TypeShift`, `orlon-bot`, `UNILOX`) are already single-line — leave them.

### Fix 3 — Rename "UNILOX" → "UNILOX Fitness AI"

The `UNILOX` label is too short/mysterious. User wants the full name.

**Locations to change:**

1. **`.pi-title`** of card 08 (line ~3768):
   `<div class="pi-title">UNILOX</div>` → `<div class="pi-title">UNILOX Fitness AI</div>`

2. **`.cs-title`** of section 08 (line ~4335):
   `<h2 class="cs-title">UNILOX — AI Gym & Fitness Assistant</h2>` → `<h2 class="cs-title">UNILOX Fitness AI — AI Gym & Fitness Assistant</h2>`

3. **HTML comment** above the cs-section (line ~4335):
   `<!-- ── 08: UNILOX FITNESS AI ── -->` stays the same (already has full name)

4. **Anchor `id`** stays as `unilox-fitness-ai` (already has full name)

5. The `.pi-sub` and body content stays as is ("AI Gym & Fitness Assistant · 7 modules" — that's the tagline, not the name).

### Fix 4 — Remove decorative SVGs from new 4 cs-sections

agy added 4 small `<svg width="40" height="40" ...>` icons to the new cs-sections' heroes. The user wants them removed — they don't match the existing cs-section style (which has decorative imagery only inside `cs-body` or specific areas, not in the hero as a small corner icon).

**Remove these 4 SVG elements** (one per new cs-section):

| Section | Line (approx) | Content |
|---|---|---|
| `portfolio-website` | ~4218 | `<svg width="40" height="40" viewBox="0 0 24 24" ...><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>...` (stack icon) |
| `hermes-desktop-oauth` | ~4259 | `<svg ...><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>...` (handshake icon) |
| `openclaw-dashboard` | ~4304 | `<svg ...><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>...` (gateway router icon) |
| `unilox-fitness-ai` | ~4346 | `<svg ...><path d="M18 6v12"></path><path d="M6 6v12"></path>...` (dumbbell icon) |

**Delete each `<svg ...>...</svg>` line entirely.** Do not replace with anything. The hero block stays clean (just title + tagline + badges).

**Do NOT touch** the decorative SVGs in the existing 4 cs-sections (the bar chart in finance-buddy, the node diagram in homelab, etc.) — those are pre-existing.

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT touch the existing 4 cs-sections' content (only the new 4 — Fix 4 is about removing SVGs agy added).
- DO NOT change the sec-head "all projects" + "view all →" arrow.
- DO NOT change widget #11 CONTACT or any other widgets.
- DO NOT change fonts, colors, or visual treatment.
- DO NOT change the `.pi`, `.pi-title`, `.pi-num`, `.pi-sub`, `.pi-tags`, `.pi-status`, `.pi-arrow` CSS classes.
- DO NOT change scroll anchors (the `onclick="scrollToAnchor('<id>')"` still needs to work).

---

## Verification

Take a full-page screenshot at `/tmp/projects-polished.png` after the fixes.

Verify:
- All 8 `.pi` cards visibly smaller (more compact)
- All 8 titles on single line (no `<br>` in any `.pi-title`)
- Card 08 shows "UNILOX Fitness AI" not "UNILOX"
- New 4 cs-sections don't have decorative SVGs in hero
- Existing 4 cs-sections' SVGs preserved
- "view all →" arrow still present on homepage sec-head
- Scroll anchors still work (verify by clicking each card — page scrolls to correct cs-section)

If playwright is unavailable, use `grep` to verify:
- `grep 'class="pi" style=".*padding:28px 32px"'` should return 0 (all 8 `.pi` cards replaced)
- `grep 'class="pi" style=".*padding:22px 24px"'` should return 8 (all 8 `.pi` cards using new padding)
- `grep 'pi-title">[^<]*<br'` should return 0 (no multi-line titles)
- `grep 'pi-title">UNILOX</div>'` should return 0
- `grep 'pi-title">UNILOX Fitness AI</div>'` should return 1
- `grep 'cs-title">UNILOX —'` should return 0
- `grep 'cs-title">UNILOX Fitness AI —'` should return 1
- `grep -c '<svg width="40" height="40"'` should return 0 (4 SVGs removed)

---

## Definition of Done

1. `git diff` shows: (a) 8 inline `padding:28px 32px` → `padding:22px 24px`, (b) 4 `<br>` removals in `.pi-title`, (c) 2 UNILOX label changes (one in `.pi-title`, one in `.cs-title`), (d) 4 SVG removals. **No other changes.**
2. Screenshot at `/tmp/projects-polished.png` (or grep verification if playwright unavailable) confirms all 4 fixes visually.
3. Scroll anchors still work.
4. Commit: `polish(projects): resize 8 cards, single-line titles, rename UNILOX, remove decorative svgs`
5. Push: `git push -u origin feat/polish-task3`
6. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
7. Report back with: (a) confirmation each of the 4 fixes succeeded, (b) verification results (grep counts or screenshot path), (c) commit hash + branch name, (d) any deviations.

---

## Constraints

- Time budget: ~15 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- DO NOT expand scope beyond the 4 listed fixes.

---

## Failure modes to avoid

- **Don't dispatch before reading the kickoff** — 4 fixes are small but specific. Wrong placement of `<br>` removal will break titles.
- **Don't touch the existing 4 cs-section SVGs** — only remove the 4 agy added.
- **Don't change the view-all arrow** — that was a previous fix and the user is happy with it.
- **Don't change taglines, badges, or stack content** — only the 4 fixes listed.
