# Kickoff: feat/widget-liquid-glass

## Context

Project: `~/dev-shared/projects/portfolio-website` (single-file SPA spike: `prototypes/portfolio-combined.html`)
Current branch: `dev` (latest, pushed)
New branch: `feat/widget-liquid-glass`

Topbar pills (`.nav-logo`, `.nav-links`, `.nav-right`) already have a liquid-glass effect. The user wants that same effect applied to every widget card/panel on every page.

---

## Reference effect to replicate

Topbar left/center pill formula (from `.nav-logo` / `.nav-links`):

```css
background: linear-gradient(135deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.04) 100%);
backdrop-filter: blur(40px) saturate(180%);
-webkit-backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255,255,255,.16);
box-shadow: 0 4px 28px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.12) inset;
```

Do NOT use the stronger `.nav-right` formula. Do NOT change the topbar.

---

## Widget targets by page

Total: 85 widgets (±2 from user's stated counts).

### Homepage — 16 widgets
Selectors to style (apply to container, not inner chips):
1. `.hero-name` / `.widg.name` — name widget
2. `.hero-quick-stats .stat-line` items inside quick-stats (count each row as part of the quick-stats widget, or treat the whole block as one — preserve readability)
3. `.hero-widget` items: SYSTEM TIME, IDENTITY, GITHUB, SKILLS, NOW, HOMELAB, FEATURED PROJECT, STACK, ABOUT, PROJECTS, CONTACT
4. `.pcard` project cards (3 cards under "ALL PROJECTS")
5. `.timeline` as one widget

Use the user's visual intent: the 11 rounded dashboard widgets with labels (`SYSTEM TIME`, `IDENTITY`, etc.), the 3 `ALL PROJECTS` cards, and the `TIMELINE` block. Inner `chip` elements must NOT receive the glass background.

### Projects page — 11 widgets
1–4. `.pi` index cards (Finance Buddy, Homelab Dashboard, TypeShift, orlon-bot)
5. Finance Buddy case-study chart widget (`.cs-chart` / `.chart-wrap` containing "SPENDING BREAKDOWN · OCT 2022 – MAY 2026")
6. `athena` node (`.nd-node` inside Homelab Dashboard)
7. `atlas` node (`.nd-node` inside Homelab Dashboard)
8. `Android` platform (`.plat` inside TypeShift)
9. `macOS` platform (`.plat` inside TypeShift)
10. `Windows` platform (`.plat` inside TypeShift)
11. `.vis-wrap` ML pipeline (inside orlon-bot)

### Roadmap page — 38 widgets (month-by-month timeline EXCLUDED per user)
1–4. `.pcard.phase-card` (4 phase cards)
5. `.w.glass.guide-card` (getting started guide)
6–16. `.pcard.topic-card` (11 topic cards, rendered by JS)
17–26. `.pcard.career-card` (10 career cards, rendered by JS)
27–35. `.resource-item` (9 resource links)
36–38. `.stat-badge` (3 hero stat badges)

### About page — 19 widgets
1. `.photo-frame`
2. `.photo-status`
3. `.edu-card`
4. `.core-tech-card`
5–8. `.skill-group` (4 groups)
9–12. `.lang-card` (4 language cards)
13–16. `.int-card` (4 interest cards)
17–20. `.contact-card` (4 contact cards)

Note: count is 20 if `.photo-status` is separate; user said 19, so treat `.photo-frame` + `.photo-status` together as the single photo widget OR omit `.photo-status` from glass styling. Prefer: style `.photo-frame` and keep `.photo-status` as-is (the badge text should stay flat).

### /me page — 1 widget
1. `.me-auth-card`

---

## Rules / Constraints

1. **Apply liquid glass to widget containers only.** Do NOT style `.chip`, `.bchip`, `.sk`, `.badge`, `.tl-badge`, `.pi-tag`, `.sg-label`, `.edu-tag`, `.nd-svc-item`, `.plat-lang`, `.topic-footer`, `.career-footer`, `.career-chips`, `.contact-card` inner text, or any small inline elements.

2. **Preserve readability.** Widgets must remain visually usable. If a widget has dark content that would become unreadable with the semi-transparent glass background, keep an inner background or use a subtle inner gradient. Do NOT make text transparent.

3. **Keep existing layout.** Do not change grid placement, padding, margin, font sizes, or border-radius unless the existing radius is 0 and a rounded pill/card appearance is expected.

4. **Do NOT touch the topbar.** It already has liquid glass.

5. **Do NOT style timeline accordion items** on the roadmap page (`#pg-roadmap .tl-item`, `.tl-header`). The timeline block as a whole may be styled only if the user included it — on the roadmap page, the user explicitly said month-by-month timeline widgets are NOT counted, so skip them.

6. **Avoid double borders / doubled effects.** If a widget already has a background/border/shadow, replace it with the liquid glass formula, do not stack. Check existing CSS for each target selector first.

7. **Cross-browser:** keep `-webkit-backdrop-filter` alongside `backdrop-filter`.

8. **No `!important` unless absolutely necessary.** Prefer adding a new rule or increasing specificity with `#pg-home`, `#pg-projects`, `#pg-roadmap`, `#pg-about`, `#pg-me` page prefixes.

---

## Implementation plan

1. Create branch `feat/widget-liquid-glass` from `dev`.
2. Read current CSS around each target selector. Record existing background/border/shadow values.
3. Add a consolidated CSS block near the end of the `<style>` section (or after existing widget CSS) with all scoped liquid-glass overrides.
4. Apply the 5 liquid-glass properties to each target container:
   - `background`
   - `backdrop-filter`
   - `-webkit-backdrop-filter`
   - `border`
   - `box-shadow`
5. Preserve or slightly adapt `border-radius` if needed.
6. Run a local server and verify visually with browser tools.
7. Check for unintended regressions: topbar unchanged, timeline items unchanged, text readable, no double glass.

---

## Definition of Done

- [ ] `feat/widget-liquid-glass` branch exists and is based on latest `dev`
- [ ] All 85 target widgets have the liquid-glass effect applied
- [ ] Topbar is untouched
- [ ] Roadmap timeline accordion items are untouched
- [ ] No readability regressions (text still legible)
- [ ] No double borders or stacked shadows
- [ ] At least one screenshot/visual verification performed
- [ ] `git status` clean, all changes committed with `agent(<name>):` prefix
- [ ] Branch pushed to origin
- [ ] DEVLOG entry written
- [ ] Return summary with widget counts verified

---

## Agent mode / CLI

Mode: Execution (surgical CSS, large but mechanical)
CLI: `claude`
Model: `kimi-k2.7-code`
Toolsets: terminal, file

## End-of-task contract

Before declaring done, run:
```bash
current=$(git rev-parse --abbrev-ref HEAD)
[ "$current" = "feat/widget-liquid-glass" ] || exit 1
git status
git add prototypes/portfolio-combined.html tasks/DEVLOG.md
git commit -m "agent(<name>): feat(widget-liquid-glass): apply topbar liquid-glass effect to all page widgets"
git push origin feat/widget-liquid-glass
```

Then write a DEVLOG entry summarizing:
- Pages modified
- Widget count per page
- Issues encountered (if any)
- Verification method used

Return a concise summary to the parent agent.
