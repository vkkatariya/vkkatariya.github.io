# Kickoff: Content cleanup — fix photo placeholder, date consistency, roadmap stat

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (3 small content fixes)

---

## Goal

Fix 3 specific content issues found during a content audit. These are NOT design changes — they're text/data corrections only.

**File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** Create new branch `feat/content-cleanup` from `dev`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Fix 1 — About page photo placeholder

**Location:** `<div class="page" id="pg-about">` (around line 5305)

**Current (lines 5305-5314):**
```html
<div class="photo-block">
  <div class="photo-frame">
    <div class="photo-initials">VK</div>
    <div class="photo-placeholder">add photo</div>
  </div>
  <div class="photo-status">open to internships</div>
  <a class="cv-dl" ...>...</a>
</div>
```

**Issue:** `<div class="photo-placeholder">add photo</div>` is a literal placeholder text that should NOT be in production. It was there because no actual photo exists.

**Decision tree (apply in this order):**

1. **First check:** does the user have an actual photo file at `prototypes/assets/profile.jpg`, `prototypes/assets/profile.png`, `prototypes/assets/photo.jpg`, or similar?
   ```bash
   ls -la prototypes/assets/ | grep -iE 'profile|photo|vishal|headshot'
   ```
2. **If yes:** Replace the placeholder div with `<img src="assets/photo.jpg" alt="Vishal Katariya" class="photo-img">`. Also update `.photo-initials` to be hidden (or just remove the initials since the photo replaces it). Update the `.photo-frame` CSS if needed to accommodate an img tag.
3. **If no:** REMOVE the `<div class="photo-placeholder">add photo</div>` line entirely. Keep `.photo-initials` (VK initials) — that's a clean fallback that works without a photo. Do NOT change `.photo-frame` CSS.

**Most likely:** no photo file exists, so just delete the line.

---

## Fix 2 — Date inconsistency on /projects cs-badges

**Locations:** 8 cs-badges across the 8 cs-sections. The `<span class="cs-badge cb-acc">...</span>` showing the year.

**Current inconsistency:**
- finance-buddy: `2025–2026` (line ~3813)
- homelab: `2025–2026` (line ~3959)
- typeshift: `2026` (implicit)
- orlon-bot: `2026` (line ~4196)
- portfolio-website: `2026`
- hermes-desktop-oauth: `2026`
- openclaw-dashboard: `2026`
- unilox-fitness-ai: `2026`

**Decision:** standardize to **`2026`** for ALL 8 cs-sections. The `2025–2026` range was used when projects spanned both years, but since we're now in 2026, single-year labels are cleaner.

**Change:**
- `2025–2026` → `2026` in finance-buddy and homelab
- All others stay as `2026` (no change needed)

**DO NOT change** other badge text (status badges, type badges, etc.) — only the year badge.

---

## Fix 3 — Roadmap hero stats

**Location:** `<section class="hero" aria-label="Roadmap">` (around line 4756)

**Current:**
```html
<span class="stat-badge blue">📋 11 Core Topics</span>
<span class="stat-badge amber">⏱ 12–14 Months</span>
<span class="stat-badge green">👥 50K+ Developers</span>
```

**Issue:** `👥 50K+ Developers` is a generic marketing stat (from roadmap.sh's "trusted by 50K+ developers"). It's not specific to Vishal. Either remove it or replace with something Vishal-specific.

**Decision:** replace with one of:
- (a) Remove the badge entirely (cleaner)
- (b) Replace with something Vishal-specific: e.g., `🎓 h_da · CS · B.Sc.`, `🇩🇪 Based in Dieburg`, `🤖 ML + Infra + Full-stack`

**Recommended:** option (b) — replace with `🤖 ML · Infra · Full-stack` (matches the 3 areas of focus the user has consistently named across bio + projects).

**Change:**
```html
<span class="stat-badge green">👥 50K+ Developers</span>
```
↓
```html
<span class="stat-badge green">🤖 ML · Infra · Full-stack</span>
```

If you think removing it is cleaner, do that instead — both are acceptable per the user.

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT change widget structures, CSS classes, or visual treatment.
- DO NOT change cs-section content (only the year badge in Fix 2).
- DO NOT change any other page other than /about (Fix 1) and /projects (Fix 2) and /roadmap (Fix 3).
- DO NOT change page structure or layout.

---

## Verification

```bash
# 1. Fix 1: photo-placeholder text gone (unless replaced with img)
grep -c 'photo-placeholder">add photo' prototypes/portfolio-combined.html
# Expected: 0

# 2. Fix 2: all year badges now consistent
grep -c 'cb-acc">2025–2026</span>' prototypes/portfolio-combined.html
# Expected: 0
grep -c 'cb-acc">2026</span>' prototypes/portfolio-combined.html
# Expected: 8 (one per cs-section)

# 3. Fix 3: roadmap stat updated
grep -c '50K+ Developers' prototypes/portfolio-combined.html
# Expected: 0
grep -c 'ML · Infra · Full-stack' prototypes/portfolio-combined.html
# Expected: 1
```

If playwright works, take a screenshot of /about + /roadmap after the fixes.

---

## Definition of Done

1. `git diff` shows ONLY: (a) photo-placeholder deletion OR img insertion (Fix 1), (b) 2 date badge text changes (Fix 2), (c) 1 roadmap stat text change (Fix 3). **No other changes.**
2. grep verifications pass.
3. Commit: `polish(content): photo placeholder, date consistency, roadmap stat`
4. Push: `git push -u origin feat/content-cleanup`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation each fix succeeded, (b) grep verification results, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: ~10 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- Use existing CSS classes only — do not invent new ones.

---

## Failure modes to avoid

- **Don't invent content** — for Fix 1, the decision tree says either delete the placeholder OR insert a real photo. Don't write fake photo metadata.
- **Don't change other badges** — Fix 2 is ONLY about the year badge (`cb-acc`), not status/type badges.
- **Don't touch page structure** — these are content/data changes, not design changes.
- **Don't expand scope** — only the 3 listed fixes. If you notice other rough spots, mention them in the DEVLOG but don't fix them in this dispatch.
