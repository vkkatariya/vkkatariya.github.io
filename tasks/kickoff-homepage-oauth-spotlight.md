# Kickoff: Move CONTACT widget down + add Hermes OAuth spotlight widget between STACK and CONTACT

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (CSS + HTML, single file)

---

## Goal

Reshuffle the homepage widget grid so that:

1. **CONTACT widget moves DOWN** to align horizontally with the ABOUT widget (both sitting on the same row).
2. **A new "FEATURED: Hermes One OAuth Fork" spotlight widget** is created in the space vacated by CONTACT, sitting between STACK and CONTACT.

Net result: same widget count on the homepage, but CONTACT is no longer "dangling" at the bottom right — it's part of the main grid, and the new spotlight widget fills the hole it leaves.

This is **option C** from the brainstorming discussion — the new widget showcases Hermes One OAuth Fork as the strongest shipping credential ("13 PRs merged upstream") instead of adding 4 separate cards for the 4 new projects.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-oauth-spotlight-widget` (already created)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Current layout (before changes)

The homepage `.grid` has 11 widgets. The bottom-right corner looks like this (approximate):

```
+----------+----------+
| 7        |          |
| FEATURED | 9 ABOUT  |
| PROJECT  | (2x2)    |
| (Finance |          |
|  Buddy)  +----------+
| (2x2)    |          |
+----------+          |
|10 PROJ.  |          |
|   STAT   |          |
+----------+----------+
|11 CONTACT |         |    ← CONTACT is here, BELOW the row containing ABOUT
| (1x2)     |         |
+-----------+---------+
```

After the move, the layout should be:

```
+----------+----------+
| 7        |          |
| FEATURED | 9 ABOUT  |
| PROJECT  | (2x2)    |
| (Finance |          |
|  Buddy)  +----------+
| (2x2)    |          |
+----------+          |
|10 PROJ.  |          |
|   STAT   |          |
+----------+----------+
|8 STACK    |NEW HERMES |  ← NEW widget here
|(1x2)      |OAUTH      |    (size 1x2 to match STACK height)
|           |SPOTLIGHT  |
|           |(1x2)      |
+-----------+----------+
|11 CONTACT             |    ← CONTACT moved DOWN here, below STACK + NEW
| (1x2 full width)       |
+-----------------------+
```

Wait — re-checking: CONTACT is currently `s12` (1×2). If STACK + NEW Hermes OAuth both sit in row 3, and CONTACT needs to be below them, CONTACT would be alone on a 4th row.

The user said: *"move contact widget bit lower ,in same line as about widget"*. That means CONTACT should be vertically aligned with ABOUT (which is at row 2, column 1). CONTACT needs to MOVE UP, not DOWN.

Re-reading: "create a new widget in between [STACK and CONTACT]" — between STACK (row 3) and CONTACT (row 4 currently). So the new widget goes in row 3, and CONTACT moves UP to align with ABOUT.

Revised target layout:

```
+----------+----------+
| 7        |          |
| FEATURED | 9 ABOUT  |    ← row 2
| PROJECT  | (2x2)    |
| (Finance +----------+
|  Buddy)  |11 CONTACT|    ← CONTACT moved UP here (was on row 4)
| (2x2)    | (1x2)    |       right column of row 2
+----------+----------+
|10 PROJ.  |          |
|   STAT   |          |    ← row 3
+----------+----------+
|8 STACK    |NEW HERMES|    ← NEW widget here (size 1x2)
|(1x2)      |OAUTH     |
|           |SPOTLIGHT |
|           |(1x2)     |
+-----------+----------+
```

Wait that's not right either — ABOUT is 2×2 (spans 2 rows × 2 cols). CONTACT is 1×2 (1 row × 2 cols? No, `s12` means 1 row × 2 cols... actually let me check the existing CSS).

---

## CURRENT GRID CSS (verify before making changes)

Read these from `portfolio-combined.html`:
- `.grid { display:grid; grid-template-columns: ...; gap: 12px; }` — find this rule
- `.w.s11` = 1×1 (1 col, 1 row)
- `.w.s12` = 1×2 (1 col, 2 rows)
- `.w.s21` = 2×1 (2 cols, 1 row)
- `.w.s22` = 2×2 (2 cols, 2 rows)
- `.w.glass` = liquid-glass surface treatment (see existing widget 9 for reference)

The existing CONTACT widget is class `s12 about-contact` with `style="width:260px;justify-self:start;gap:10px;padding:14px;overflow:visible;align-self:start;flex-shrink:0"` — note the inline `width:260px` and `align-self:start` (memory note: the original contact widget was 260px wide per the .about-grid layout).

**This is important:** CONTACT has explicit `align-self:start` and `width:260px` inline styles that override the grid's `s12` behavior. When moving CONTACT, **preserve these inline styles**.

---

## Task 1: Move CONTACT widget into the right column of row 2

**Source:** Lines 3533–3577 of `prototypes/portfolio-combined.html` (the entire `<!-- 11 · CONTACT -->` block).

**Destination:** Right column of row 2, immediately after the ABOUT widget (which ends at line 3532).

**How to do it:**

1. **Find the closing `</div>` of the ABOUT widget** (the `s22` block starting at line 3520). The CONTACT widget should be inserted as a sibling AFTER the ABOUT widget, before the closing `</div>` of the `.grid` container.

2. **Move the entire CONTACT block** (lines 3533–3577 inclusive, including the comment `<!-- 11 · CONTACT · 1×2 -->`) to right after the ABOUT widget's closing `</div>`.

3. **Preserve all inline styles** on the CONTACT wrapper:
   ```html
   <div class="w s12 about-contact" style="width:260px;justify-self:start;gap:10px;padding:14px;overflow:visible;align-self:start;flex-shrink:0">
   ```

4. **DO NOT modify the CONTACT widget's internal content** (the github link, email link, loc-label, avail-badge, CV download pill are all current and correct).

5. **DO NOT add a new widget in this task.** Task 2 adds the new widget in the OLD position of CONTACT.

---

## Task 2: Add new "FEATURED: Hermes One OAuth Fork" spotlight widget

**Source position:** Where CONTACT used to be (after PROJECTS STAT at line 3510, after FEATURED PROJECT at line 3466, before ABOUT at line 3520).

**Wait — re-read the user's instruction:**
> "between stack widget and contact widget, move contact widget bit lower ,in same line as about widget ,and create a new widget in between"

"Between STACK widget and CONTACT widget" — STACK is widget 8 (line 3448), CONTACT is widget 11. So the new widget goes between them in the DOM order. With CONTACT moved up to row 2, the new widget fills the row-3 spot that CONTACT vacated.

**Revised target layout (Task 1 + 2 combined):**

```
Row 1: | CLOCK (s22, 2×2)                              | IDENTITY (s21, 2×1) | GITHUB (s21, 2×1) |
       | CLOCK spans 2 cols × 2 rows                   | (top-right corner) |                   |
       |                                              |                    |                   |
Row 2: | FEATURED PROJECT (s22, 2×2)                  | ABOUT (s22, 2×2)                            |
       | Finance Buddy                                | 9 bio paragraphs                             |
       |                                              +-------------------+                   |
       |                                              | CONTACT (s12, moved here)                  |
       +-------------------+                          | width:260px, align-self:start              |
       | SKILLS (s12, 1×2)| STACK (s12, 1×2)         | github + email + loc + avail + cv          |
Row 3: | 4 SKILL bars      | 7 STACK items           +-------------------+                   |
       +-------------------+                          | PROJECTS STAT (s11, 1×1)                    |
Row 4: | HOMELAB (s11)     | CURRENTLY BUILDING (s11)|                   |
       +-------------------+-------------------+       +-------------------+                   |
       | NEW HERMES OAUTH SPOTLIGHT (s12, 1×2) [new widget fills the slot where CONTACT used to be]                |
       +-------------------+-------------------+                                                                  
       | TIMELINE heading + view all                                                                              |
```

Hmm, the layout is getting complex. **Just do what the user said:**

1. **Move CONTACT** to be in the same row/column as ABOUT (vertically aligned).
2. **Add a new widget** between STACK and CONTACT in the DOM (so the new widget appears between them visually if the grid flow puts it there).

**Don't fight the existing grid logic.** The current grid uses auto-flow; widgets just fill slots in the order they appear in the DOM (unless they have explicit `grid-column`/`grid-row` overrides). Since STACK (s12) and CONTACT (s12) are both 1×2, and CURRENTLY BUILDING (s11) + HOMELAB (s11) are 1×1 in row 4, the grid flow is non-trivial.

**Practical approach:**

- Move CONTACT's HTML block to immediately follow the ABOUT widget's closing `</div>` in the DOM.
- Insert the new Hermes OAuth spotlight widget HTML block at the position where CONTACT used to be (between STACK and where CONTACT was).
- Let CSS grid auto-flow handle the rest. Test in browser to verify visual layout matches the user's intent (CONTACT aligned with ABOUT, new widget between STACK and CONTACT).

---

## Task 3: Create the new widget content

### Widget container:

```html
<!-- 12 · FEATURED: HERMES ONE OAUTH FORK · 1×2 — NeoPOP highlight -->
<div class="w s12" style="display:flex;flex-direction:column;gap:10px;padding:14px;position:relative;overflow:hidden">
```

(Same structural pattern as STACK widget at line 3449: `class="w s12"` with `display:flex; flex-direction:column;`.)

### Widget content (in order, top to bottom):

**1. wlbl-row header:**
```html
<div class="wlbl-row">
  <svg class="ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="3" y="6" width="7" height="5.5" rx="1" stroke="rgba(255,255,255,.5)" stroke-width="1" fill="rgba(255,255,255,.07)"/>
    <path d="M4.5 6V4.5C4.5 3.4 5.4 2.5 6.5 2.5C7.6 2.5 8.5 3.4 8.5 4.5V6" stroke="rgba(255,255,255,.5)" stroke-width="1" fill="none"/>
    <circle cx="6.5" cy="9" r=".9" fill="rgba(255,255,255,.7)"/>
  </svg>
  featured · hermes oauth
</div>
```
(Padlock icon matching the cs-title icon for hermes-desktop-oauth on /projects.)

**2. Project title (big, attention-grabbing):**
```html
<div style="font-family:var(--font-ndot);font-size:clamp(28px,3.5vw,42px);font-weight:800;letter-spacing:-1.5px;line-height:.95;margin-top:2px;color:var(--w)">
  Hermes One<br>OAuth Fork
</div>
```

(Using the `var(--font-ndot)` (NDOT) font like other cs-title elements. The `<br>` is intentional — same trick as the original Homelab Dashboard pcard-title. Sized smaller than cs-title (clamp 28-42px vs 42-80px) so it fits inside a 1×2 widget without overwhelming.)

**3. One-line tagline:**
```html
<div style="font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--w60);line-height:1.4;margin-top:4px">
  OAuth + device-flow for gated dashboards.
</div>
```

**4. Stats row (3 mini stats, matching cs-stat style):**
```html
<div style="display:flex;gap:14px;margin-top:8px;font-family:'DM Mono',monospace">
  <div style="display:flex;flex-direction:column;gap:2px">
    <div style="font-size:22px;font-weight:500;color:var(--green);line-height:1">13</div>
    <div style="font-size:9px;color:var(--w30);letter-spacing:1.5px;text-transform:uppercase">PRs merged</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:2px">
    <div style="font-size:22px;font-weight:500;color:var(--acc);line-height:1">4</div>
    <div style="font-size:9px;color:var(--w30);letter-spacing:1.5px;text-transform:uppercase">phases</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:2px">
    <div style="font-size:22px;font-weight:500;color:var(--w);line-height:1">38/38</div>
    <div style="font-size:9px;color:var(--w30);letter-spacing:1.5px;text-transform:uppercase">tests pass</div>
  </div>
</div>
```

(Stats mirror the cs-section stat style: big number + tiny uppercase label. Colors: green for the strongest stat, accent for next, white for tests. The data comes from the hermes-desktop-oauth cs-section on /projects.)

**5. Buttons row (view + github, matching existing FEATURED PROJECT widget button style):**
```html
<div style="display:flex;gap:6px;margin-top:auto;padding-top:8px">
  <a class="np" href="javascript:void(0)" onclick="showPage('projects');setTimeout(()=>document.getElementById('hermes-desktop-oauth')?.scrollIntoView({behavior:'smooth'}),500);return false;" style="text-decoration:none;font-size:10px;padding:6px 12px">view →</a>
  <a class="np-ghost" href="https://github.com/vkkatariya" target="_blank" rel="noopener noreferrer" style="text-decoration:none;font-size:10px;padding:6px 12px">github →</a>
</div>
```

(Buttons match the existing pattern used on FEATURED PROJECT widget buttons. The `view →` button uses the showPage + setTimeout scrollIntoView pattern used elsewhere on /projects links.)

---

## Hard rules

1. **DO NOT change** any other widget on the homepage. Only move CONTACT (Task 1) and add the new widget (Task 2/3).
2. **DO NOT change** the CONTACT widget's internal content — only its position in the DOM.
3. **DO NOT change** the .grid CSS rules. Auto-flow should handle the new layout.
4. **DO NOT change** other pages (only /).
5. **DO NOT introduce new design tokens** — use existing CSS variables (`--w`, `--w30`, `--w60`, `--green`, `--acc`, `--font-ndot`, etc.).
6. **DO NOT change** the kickoff file or any /tasks files.
7. **The new widget is a single static widget** — no JS timer, no rotation. Just the OAuth project featured statically.
8. **Preserve all existing inline styles on the CONTACT widget** during the move.

---

## Verification

```bash
# 1. CONTACT widget block moved (search for its unique string)
grep -n '<div class="w s12 about-contact"' prototypes/portfolio-combined.html
# Should appear AFTER the ABOUT widget's closing div in line order

# 2. New widget exists with expected content
grep -n 'featured · hermes oauth' prototypes/portfolio-combined.html
# Should return 1 match

# 3. New widget contains 3 stat numbers (13, 4, 38/38)
grep -c '>13</div>' prototypes/portfolio-combined.html
# Should return >= 1 (the new widget contributes 1; check no duplicates)
grep -c '>38/38</div>' prototypes/portfolio-combined.html
# Should return exactly 1

# 4. Total .w widgets = 12 (11 existing + 1 new)
grep -c 'class="w ' prototypes/portfolio-combined.html
# Should be 12 (was 11)

# 5. Existing wlbl-row count preserved (no removals)
grep -c '<div class="wlbl-row">' prototypes/portfolio-combined.html
# Should be 18 (unchanged)

# 6. Existing .pi liquid-glass preserved
grep -c 'linear-gradient(135deg, rgba(255,255,255,.08)' prototypes/portfolio-combined.html
# Should be >= 1 (unchanged)

# 7. Existing contact form content unchanged
grep -c 'mailto:vishalkatariya404@gmail.com' prototypes/portfolio-combined.html
# Should be >= 2 (one in homepage cw-row, one in /about contact-card)
```

---

## Definition of Done

1. `git diff` shows ONLY: (a) CONTACT widget moved to new position, (b) NEW widget inserted at old CONTACT position. No other content changes.
2. All 7 grep verifications pass.
3. Commit: `feat(homepage): add hermes oauth spotlight widget between stack and contact; move contact to align with about`
4. Push: `git push -u origin feat/homepage-oauth-spotlight-widget`
5. Write DEVLOG entry at top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation each task succeeded, (b) grep results, (c) commit hash, (d) any visual issues from browser testing.

---

## Constraints

- Time budget: ~20 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- Use existing CSS classes (`np`, `np-ghost`, `wlbl-row`) — do not invent new ones.
- SVG icons: simple primitives, 13×13 viewBox, `rgba(255,255,255,.5)` strokes.

---

## Failure modes to avoid

- **Don't break the grid layout.** Test in browser after applying changes. If widgets overflow or wrap weirdly, adjust the new widget's inline `grid-column`/`grid-row` overrides minimally — but the goal is to NOT touch grid CSS.
- **Don't lose the CONTACT widget's inline styles** during the move (width:260px, align-self:start, etc.).
- **Don't add new design tokens** — `--green`, `--acc`, `--w`, etc. are all already defined in `:root`.
- **Don't touch the existing FEATURED PROJECT widget** (widget 7, Finance Buddy) — leave it alone.
- **Don't expand scope** to other pages or other widgets.

---

## Quick setup for dispatch

```bash
cd ~/dev-shared/projects/portfolio-website
git checkout feat/homepage-oauth-spotlight-widget
git pull origin feat/homepage-oauth-spotlight-widget  # if remote is ahead
```

---

## END-OF-TASK CONTRACT (mandatory)

1. Verify with grep commands above.
2. `git status` — confirm only `prototypes/portfolio-combined.html` modified.
3. `git add prototypes/portfolio-combined.html`.
4. `git commit -m "feat(homepage): add hermes oauth spotlight widget between stack and contact; move contact to align with about"`.
5. `git push -u origin feat/homepage-oauth-spotlight-widget`.
6. Append `tasks/DEVLOG.md` entry.
7. Return: branch, commit SHA, grep results, browser screenshot if possible, deviations.

---

**Tip:** Open the homepage in browser AFTER committing and confirm:
- CONTACT widget visually aligns with ABOUT widget (right side of row 2).
- New "HERMES OAUTH" widget sits between STACK and (former) CONTACT position (row 3).
- "13 PRs merged" stat is clearly visible and the strongest visual element.
- "view →" button scrolls to the hermes-desktop-oauth cs-section on /projects.