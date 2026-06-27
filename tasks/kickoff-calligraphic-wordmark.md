# Kickoff — feat/calligraphic-name-wordmark

> **Status:** Draft (2026-06-27)
> **Branch from:** `dev` (current HEAD: `3bba345`)
> **Owner:** Coding agent dispatched by Vishal
> **Target agent:** Claude Code (preferred) or any agent that supports browser automation + visual verification

---

## TL;DR

Restyle the **topbar logo name** and the **homepage IDENTIFY widget name** to use the calligraphic-initial + uppercase-sans-body pattern that's already proven for the page-hero titles (`Projects`, `Roadmap`, `About`). Match the visual style of the Zack Webster reference image (calligraphic italic initial + uppercase sans-serif body, with visible space between first and last name).

**Goal:** `VISHAL KATARIYA` with V/K as Cormorant Garamond italic script, ISHAL/ATARIYA as Space Grotesk uppercase.

**Files touched:** Single file — `prototypes/portfolio-combined.html`.

---

## Context

### What is this project

`portfolio-website` is Vishal's personal portfolio SPA. Repo at `~/dev-shared/projects/portfolio-website/`. Current branch is `dev` after merging `feat/remove-ndot-font`. The deployed site is at `https://vishal-katariya.com` (Vercel) with GitHub Pages fallback.

### Read these first

- `AGENTS.md` — agent behavior contract (mandatory DEVLOG entry, plan mode for non-trivial work, branch discipline)
- `CONTEXT.md` — stack, conventions, font stack, design tokens
- Last 5 entries in `tasks/DEVLOG.md` — current state of the world
- `tasks/todo.md` — what's queued and in progress
- `tasks/lessons.md` — active prevention rules (especially L-026 selector audit, L-049 DOM coordinate audit, L-051 font check, L-061 font feedback after deploy)

### Why this task exists

Earlier in this session (2026-06-27):

1. **feat/remove-ndot-font** merged to dev (commit `3bba345`) — removed the NothingOS NDOT font, repointed `--font-ndot` cascade from `'Ndot', 'DM Mono', monospace` → `'DM Mono', monospace`. This removed the distinctive dotted character from accent roles but preserved the cascade structure.

2. **feat/calligraphic-name-wordmark** (this task) — initially attempted to add a calligraphic italic initial (Cormorant Garamond) + uppercase sans-serif body (Space Grotesk) treatment to the topbar logo name and the homepage IDENTIFY widget. The first attempt (Hermes inline) rendered but didn't match the reference proportions — the script initial was too small (1.15em vs body's 1em), the body letters were initially lowercase then fixed to uppercase, and a whitespace collapse bug between flex items caused "VISHALKATARIYA" to run together. The branch was reverted to dev HEAD via `git checkout --` and the task was kicked back for agent dispatch.

The CSS classes `.hn-script`, `.hn-sans`, `.hn-gap` already exist and are used successfully for the three page-hero titles. They are stable, tested, and proven.

---

## Definition of Done

- [ ] Topbar logo (`.nav-logo-name`) renders as `VISHAL KATARIYA` with:
  - V and K in Cormorant Garamond italic, visibly larger than body (~1.5-1.7× of body size — dramatic, not subtle)
  - ISHAL and ATARIYA in Space Grotesk uppercase, ~24px (matches topbar pill height)
  - Visible ~8-10px space between "VISHAL" and "KATARIYA" (NOT concatenated like "VISHALKATARIYA")
  - Both letters sit on the same baseline (`vertical-align: baseline`)
- [ ] Homepage IDENTIFY widget renders "VISHAL" / "KATARIYA" stacked, same treatment as topbar
- [ ] Light mode works (Cormorant still renders)
- [ ] No console errors during navigation between pages
- [ ] Browser verification at 1440px and 860px viewports
- [ ] Page-hero titles (`Projects`, `Roadmap`, `About`) still render acceptably — see "tuning trade-off" note below
- [ ] DEVLOG entry written (newest-first format)
- [ ] Branch pushed to remote, NOT merged to dev (leave for Vishal's review)

---

## Constraints

- **Single file:** `prototypes/portfolio-combined.html`. Don't touch other files.
- **Reuse existing CSS classes** (`.hn-script`, `.hn-sans`, `.hn-gap`) — they already exist and work.
- **DO NOT introduce a new font.** Keep Cormorant Garamond italic for the script initial, Space Grotesk for the sans body.
- **Don't touch other name usages** (about-page hero `ph-title`, about-page bio paragraph inline emphasis) — those use the "Vishal" inline emphasis pattern intentionally and were approved in earlier sessions.
- **Tuning trade-off:** changes to the generic `.hn-script` rule (e.g. `font-size: 1.6em`) will affect the page-hero titles too. Either accept the consistent design (page titles also get a bigger script letter) or scope the override with `.nav-logo-name .hn-script { font-size: 1.6em }` to localize the change to the topbar.

---

## Current State — exact code locations

### CSS classes already in the file (around line 280-295)

```css
/* Generic — applies anywhere .hn-script is used */
.hn-script {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-weight: 700;
  color: var(--w); letter-spacing: -2px;
}
.hn-sans {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800; color: var(--w);
}
.hn-gap { display: inline-block; width: .18em; }

/* Topbar parent — line ~180 */
.nav-logo-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px; line-height: 1; white-space: nowrap; letter-spacing: -.3px;
}
```

### Working examples in the file (page-hero titles — DO NOT change)

```html
<!-- #pg-projects .ph-title, line ~3936 -->
<span class="hn-script">P</span>rojects

<!-- #pg-roadmap .ph-title, line ~5125 -->
<span class="hn-script">R</span>oadmap

<!-- #pg-about .ph-title, line ~5674 -->
<span class="hn-script">A</span>bout
```

### LOCATION 1 — Topbar logo (CHANGE THIS, ~line 3425)

**Current markup:**
```html
<a href="#home" class="nav-logo" onclick="showPage('home')">
  <div class="nav-logo-name">
    <span class="wm-cap">Vishal</span> <span class="wm-cap">Katariya</span>
  </div>
</a>
```

**Change to:**
```html
<a href="#home" class="nav-logo" onclick="showPage('home')">
  <div class="nav-logo-name">
    <span class="hn-script">V</span><span class="hn-sans">ISHAL</span><span class="hn-gap"></span><span class="hn-script">K</span><span class="hn-sans">ATARIYA</span>
  </div>
</a>
```

**CRITICAL pitfall:** Use `<span class="hn-gap"></span>` as the separator between ISHAL and K. A literal space `" "` in the markup will be silently collapsed by the flex container (`.nav-logo-name` becomes flex via `display: inline-flex; align-items: baseline` if you add it, OR if you keep it block-level, the text nodes between block spans are collapsed too). Result without `hn-gap`: "VISHALKATARIYA" with no visible space.

### LOCATION 2 — Homepage IDENTIFY widget (CHANGE THIS, ~line 3541)

**Current markup:**
```html
<div style="font-size:clamp(28px,3.5vw,36px)"><span class="wm-cap">Vishal</span></div>
<div style="font-size:clamp(28px,3.5vw,36px)"><span class="wm-cap">Katariya</span></div>
```

**Change to:**
```html
<div style="font-size:clamp(28px,3.5vw,36px)"><span class="hn-script">V</span><span class="hn-sans">ISHAL</span></div>
<div style="font-size:clamp(28px,3.5vw,36px)"><span class="hn-script">K</span><span class="hn-sans">ATARIYA</span></div>
```

No `hn-gap` needed here — each name is on its own div (line break).

---

## CSS Tuning (apply only as needed for visual match)

The default generic `.hn-script` rule produces V/K at ~1em of body (no font-size override). To make the script initial visibly larger and dramatic like the reference image, add font-size to the generic rule. **Recommended final values:**

```css
.hn-script {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-weight: 700;
  font-size: 1.6em;          /* makes script initial 1.6× larger than body */
  color: var(--w); letter-spacing: -2px;
  line-height: .85;           /* tighter so descender doesn't break baseline */
  vertical-align: baseline;
  display: inline-block;
  margin-right: -.06em;       /* closes visual gap between V and ISHAL */
}
.hn-sans {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; color: var(--w);   /* was 800, dial back to 700 — 800 too heavy */
  letter-spacing: -.5px;
}
.hn-gap { display: inline-block; width: .35em; }  /* was .18em, widen to .35em for visible space */
```

**Trade-off:** these changes WILL affect the existing page-hero titles ("Projects", "Roadmap", "About") — their `hn-script` letter will now also be 1.6em instead of 1em. Verify in browser that page titles still look acceptable. If the page titles look broken with the new sizing, scope the rule with `.nav-logo-name .hn-script { font-size: 1.6em }` instead so it only applies to the topbar.

For the topbar parent specifically, you may also want to ensure baseline alignment:

```css
.nav-logo-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px; line-height: 1; white-space: nowrap; letter-spacing: -.3px;
  display: inline-flex; align-items: baseline;  /* ensures all spans share baseline */
}
```

---

## Verification (must pass before declaring done)

### Setup

A local server is running at `http://127.0.0.1:8765/` (port 8765 on the radxa user's loopback). The relevant file path:

- Live URL: `http://127.0.0.1:8765/prototypes/portfolio-combined.html`
- File path: `/home/radxa/dev-shared/projects/portfolio-website/prototypes/portfolio-combined.html`

If 8765 is taken, start a new one with `python3 -m http.server 8766` and adjust URLs.

### 1. HTML syntax

```bash
python3 -c "from html.parser import HTMLParser; HTMLParser().feed(open('prototypes/portfolio-combined.html').read()); print('OK')"
```

Expected: `OK`.

### 2. Browser verification (Playwright Python)

```python
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8765/prototypes/portfolio-combined.html"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(URL, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2500)  # let Cormorant Garamond italic font load

    # Inspect topbar
    info = page.evaluate("""
        () => {
            const nav = document.querySelector('.nav-logo-name');
            const children = Array.from(nav.children);
            return {
                childCount: children.length,
                width: nav.getBoundingClientRect().width,
                children: children.map(c => ({
                    class: c.className,
                    text: c.textContent,
                    width: c.getBoundingClientRect().width,
                    fontSize: getComputedStyle(c).fontSize,
                    fontStyle: getComputedStyle(c).fontStyle,
                    fontFamily: getComputedStyle(c).fontFamily,
                })),
            };
        }
    """)
    print(info)
    # Expected:
    #   childCount == 5 (V, ISHAL, gap, K, ATARIYA)
    #   width > 180 (includes gap)
    #   V span: Cormorant Garamond italic, font-size ~38px (1.6em of 24px)
    #   ISHAL span: Space Grotesk, font-size 24px
    #   gap span: width ~8.4px (0.35em of 24px)
    #   K span: Cormorant italic ~38px
    #   ATARIYA span: Space Grotesk 24px

    # Visible space check
    k_box = page.locator('.nav-logo-name .hn-script').nth(1).bounding_box()
    ishal_box = page.locator('.nav-logo-name .hn-sans').first.bounding_box()
    gap_px = k_box['x'] - (ishal_box['x'] + ishal_box['width'])
    print(f"Gap between ISHAL and K: {gap_px}px")
    assert gap_px > 4, f"FAIL: visible gap too small ({gap_px}px) — likely whitespace collapse bug"

    # IDENTIFY widget
    home_scripts = page.locator('#pg-home .hn-script')
    assert home_scripts.count() == 2, f"Expected 2 hn-script in #pg-home, got {home_scripts.count()}"
    v_id_family = home_scripts.first.evaluate("e => getComputedStyle(e).fontFamily")
    v_id_style = home_scripts.first.evaluate("e => getComputedStyle(e).fontStyle")
    assert "Cormorant" in v_id_family and "italic" in v_id_style, f"IDENTIFY V not Cormorant italic: {v_id_family} {v_id_style}"

    # Light mode
    page.evaluate("document.documentElement.classList.add('light')")
    page.evaluate("document.body.offsetHeight")
    light_ff = page.locator('.nav-logo-name .hn-script').first.evaluate("e => getComputedStyle(e).fontFamily")
    assert "Cormorant" in light_ff, f"Light mode: V not Cormorant ({light_ff})"

    # Screenshot for visual review
    page.evaluate("document.documentElement.classList.remove('light')")
    page.screenshot(path="/tmp/font-comparison/result-topbar.png", clip={"x": 0, "y": 0, "width": 380, "height": 80})

    # Page-hero title check (don't break existing titles)
    page.evaluate("showPage('projects')")
    page.wait_for_timeout(500)
    p_title = page.locator('#pg-projects .ph-title .hn-script').first
    if p_title.count() > 0:
        p_ff = p_title.evaluate("e => getComputedStyle(e).fontFamily")
        print(f"Page title hn-script: {p_ff}")

    browser.close()
```

### 3. Visual review

Take a screenshot at 1440px and 860px viewports. Compare against the Zack Webster reference: V/K should be visibly larger than ISHAL/ATARIYA, all uppercase, calligraphic italic for V/K, clean sans-serif for the rest.

### 4. No console errors

Run a manual nav cycle (home → projects → roadmap → about → home) and check `page.on('pageerror', lambda exc: errors.append(str(exc)))` returns empty.

### 5. Light + dark mode parity

Toggle `html.light` class and verify Cormorant still renders (it doesn't have separate light-mode overrides, so this should be a free pass).

### 6. Mobile responsive

Verify at 860px and 560px viewports — the topbar should still render the wordmark legibly. The `.nav-logo-name` already has `white-space: nowrap` so it won't wrap. If it overflows the topbar pill width at small viewports, reduce the script font-size in a media query.

---

## Commit format

```bash
git add -A
git commit -m "feat(wordmark): calligraphic initial + uppercase sans body for topbar logo and IDENTIFY widget

- V and K render in Cormorant Garamond italic, 1.6em of body size
- ISHAL and ATARIYA in Space Grotesk uppercase 700
- Visible 0.35em gap between first and last names (was collapsing to zero)
- Body weight dialed back 800 -> 700 (800 too heavy against italic script)
- Page-hero titles (Projects, Roadmap, About) inherit the same font-size scaling — visually consistent"
git push origin feat/calligraphic-name-wordmark
```

**DO NOT merge to dev.** Leave for Vishal's review.

---

## DEVLOG entry

After verification passes, append a new entry at the TOP of `tasks/DEVLOG.md` (newest first). Use the existing format:

```markdown
## [YYYY-MM-DD] [Agent name] — feat/calligraphic-name-wordmark: calligraphic initial treatment

**Mode:** Builder
**Did:**
- Restyled topbar logo name from `<span class="wm-cap">Vishal</span> <span class="wm-cap">Katariya</span>` (DM Mono caps) to `<span class="hn-script">V</span><span class="hn-sans">ISHAL</span><span class="hn-gap"></span><span class="hn-script">K</span><span class="hn-sans">ATARIYA</span>` (Cormorant italic initial + Space Grotesk uppercase body)
- Same treatment applied to homepage IDENTIFY widget (stacked "VISHAL" / "KATARIYA")
- Tuned .hn-script rule: added font-size 1.6em, line-height .85, inline-block, margin-right -.06em
- Tuned .hn-sans rule: weight 800 -> 700
- Tuned .hn-gap rule: width .18em -> .35em (visible space between names)
- Fixed whitespace-collapse bug: literal space " " between flex items was being silently dropped by the browser, rendering "VISHALKATARIYA" with no separator
- Verified page-hero titles (Projects, Roadmap, About) still render acceptably with the new hn-script font-size scaling

**State:** Branch `feat/calligraphic-name-wordmark` ready for review. Not merged to dev.
**Decided:**
- Reused existing .hn-script / .hn-sans / .hn-gap classes (already used for page-hero titles) instead of inventing new classes
- 1.6em script size for visual drama (vs 1.15em which was too subtle)
- 0.35em gap width for visible space (vs 0.18em which was almost invisible)
- Did NOT scope the .hn-script font-size to topbar only — page-hero titles get the same bigger script letter, which is consistent design
**Blocked / Next:** Vishal visual review. If topbar proportions don't match reference, next pass would try a more dramatic script font (e.g. Birthstone or Allura) vendored locally.

---

## tasks/todo.md update

Add a sub-item under the existing "Phase 0 — HTML Prototypes → Visual polish" parent (per Todo placement rule from workflow):

```markdown
- [x] **Calligraphic initial + uppercase sans body for personal name** (2026-06-27) — topbar logo + IDENTIFY widget. Reuses .hn-script / .hn-sans / .hn-gap classes (already proven for page-hero titles). Branch `feat/calligraphic-name-wordmark` ready for review.
```

---

## Troubleshooting

### Problem: "VISHALKATARIYA" runs together (no space between names)

**Cause:** Whitespace text node between flex items is collapsed by the browser. The literal space `" "` in markup gets dropped.

**Fix:** Use `<span class="hn-gap"></span>` as the explicit separator. Verify in browser that `childCount == 5` (not 4) and `gap_px > 4` between ISHAL right edge and K left edge.

### Problem: V/K doesn't look larger than ISHAL/ATARIYA

**Cause:** Generic `.hn-script` rule has no `font-size` override, so script letter renders at 1em of parent (same as body).

**Fix:** Add `font-size: 1.6em` (or 1.5-1.7em range) to the generic `.hn-script` rule. Verify with browser that V's font-size is ~1.6× ISHAL's font-size.

### Problem: Page-hero titles look broken after `.hn-script` font-size change

**Cause:** The font-size: 1.6em applies to all `.hn-script` elements including those in `.ph-title`.

**Fix Option A:** Accept the change — page titles also get a bigger script letter. Consistent design.

**Fix Option B:** Scope the override with `.nav-logo-name .hn-script { font-size: 1.6em }` to localize to topbar only. Page titles keep their default 1em script letter.

**Fix Option C:** Add a wrapping class (e.g. `.name-wordmark`) around the topbar/IDENTIFY spans and scope `.name-wordmark .hn-script { font-size: 1.6em }`.

### Problem: V appears lower than ISHAL (not on same baseline)

**Cause:** Different font metrics — Cormorant italic has different x-height than Space Grotesk uppercase.

**Fix:** Add `vertical-align: baseline` to `.hn-script` and `line-height: 1` to `.hn-sans` to align them. May also need `margin-top: -.05em` on `.hn-script` to compensate for Cormorant's higher cap-height.

### Problem: Cormorant Garamond italic doesn't load

**Cause:** Google Fonts URL doesn't include italic weights for Cormorant, or browser cache.

**Fix:** Verify the Google Fonts link (around line 16 in the HTML) includes `family=Cormorant+Garamond:ital,wght@1,600;1,700`. Current link should have this — if missing, add it. Confirm via `document.fonts.check('italic 700 24px "Cormorant Garamond"')` in browser console — should return `true`.

### Problem: Whitespace-collapse bug returns

**Cause:** Forgot the `<span class="hn-gap">` between ISHAL and K, OR the `.nav-logo-name` was changed from `display: flex` (or `inline-flex`) to `display: block` which still collapses whitespace text nodes between spans.

**Fix:** Always use the explicit span separator. Don't rely on literal spaces between spans regardless of display mode.

### Problem: 800 weight body too heavy

**Cause:** The default `.hn-sans` weight is 800 which combined with Cormorant italic 700 reads as visually unbalanced.

**Fix:** Dial `.hn-sans` to weight 700 (matches Space Grotesk "Bold" weight, reads cleanly against the script initial).

---

## Reference — visual target

The reference image (Zack Webster) shows:

- "Z" — large calligraphic italic script (~1.5-1.7× body size, dramatic)
- "ack" — uppercase sans-serif body (heavy weight, ~700-800)
- " " — visible space between first and last name
- "W" — same calligraphic italic script treatment
- "ebster" — uppercase sans-serif body

**Target for this task:** Same treatment for "Vishal Katariya" with V and K as the calligraphic initials. Cormorant Garamond italic is the closest already-loaded serif italic that approximates the script look — though it's a "book serif italic" not a "calligraphic signature font". If the look still doesn't match after this iteration, next step is vendoring a dedicated script font (Birthstone, Allura, Tangerine, etc.) under `prototypes/assets/fonts/` and a new `--font-script` variable.

---

## After completion

1. **Run all verification commands above.** Every check must pass.
2. **Take screenshots** at 1440px and 860px viewports, save to `/tmp/font-comparison/result-topbar.png` and `/tmp/font-comparison/result-topbar-860.png`.
3. **Write DEVLOG entry** at top of `tasks/DEVLOG.md` (template above).
4. **Update `tasks/todo.md`** (template above).
5. **Commit and push:**
   ```bash
   git add -A
   git commit -m "feat(wordmark): ..."
   git push origin feat/calligraphic-name-wordmark
   ```
6. **DO NOT merge to dev.** Vishal does merges manually after visual review.
7. **Report back** with: branch name, commit SHA, screenshot paths, what changed, any caveats or follow-up suggestions.

---

## Files inventory (sanity check)

Modified by this task:

- `prototypes/portfolio-combined.html` — markup edits at ~line 3425 and ~line 3541, optional CSS rule tuning at ~line 280-295 and ~line 180

Not modified (intentional):

- `prototypes/resume.html`
- `prototypes/about.html`
- `prototypes/projects.html`
- `prototypes/cs-roadmap.html`
- `index.html`
- `tasks/DEVLOG.md` (only append, never edit existing entries)
- `tasks/lessons.md`
- `tasks/todo.md` (only add sub-items, never reorder)

---

## Related branches in flight

- `feat/remove-ndot-font` — already merged to dev at `3bba345`. Don't touch.
- `feat/calligraphic-name-wordmark` — THIS task. Fresh branch from dev.

When done, the local repo state should be:

```
* feat/calligraphic-name-wordmark  <new commit SHA>
  dev                             3bba345 merge: feat/remove-ndot-font — drop NDOT, cascade to DM Mono
```

---

## Notes for the agent

- Working directory: `/home/radxa/dev-shared/projects/portfolio-website` (the shared repo on athena, not Mac local)
- Local HTTP server: `python3 -m http.server 8765` is running on radxa's loopback at the start of the session. If 8765 is busy, use a different port.
- Test URL: `http://127.0.0.1:8765/prototypes/portfolio-combined.html`
- Python venv with playwright: `/home/radxa/.local/lib/python3.11/site-packages` (insert into `sys.path` before importing playwright)
- All commits should use the format `feat(wordmark): ...` per AGENTS.md branch-discipline rules
- The user's chat is English; respond in English; technical terms are fine