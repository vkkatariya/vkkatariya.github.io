# Kickoff: feat/widget-liquid-glass (v2 — resume from audit)

## Context

Project: `~/dev-shared/projects/portfolio-website`
Target file: `prototypes/portfolio-combined.html`
Branch: `feat/widget-liquid-glass` (already created from `dev` at 34b1874, clean working tree, no commits yet)

A prior `claude` agent completed the audit phase and identified page boundaries + widget-container selector families. **This kickoff skips audit — go straight to applying CSS.**

---

## Reference effect to replicate (left/center topbar pill)

From `.nav-logo` / `.nav-links` in the same file:

```css
background: linear-gradient(135deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.04) 100%);
backdrop-filter: blur(40px) saturate(180%);
-webkit-backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255,255,255,.16);
box-shadow: 0 4px 28px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.12) inset;
```

Do NOT use the stronger `.nav-right` formula. Do NOT change the topbar.

---

## Page line boundaries (from prior audit)

- `pg-home` ≈ lines 2928–3339
- `pg-projects` ≈ lines 3340–3851
- `pg-roadmap` ≈ lines 3853–4387
- `pg-about` ≈ lines 4404–4743
- `pg-me` ≈ lines 4744–4753

Widget CSS is redefined across multiple blocks:
- home base ≈ line 343
- home responsive ≈ line 697
- roadmap ≈ line 1989
- global hover ≈ line 2782

You do NOT need to edit every block. Add a single consolidated override block near the end of the `<style>` section (after existing widget CSS) with page-prefixed selectors. Specificity must beat the existing rules; use `#pg-home .w`, `#pg-projects .pi`, etc.

---

## Widget targets and selectors

### Homepage — 16 widgets
1. `.hero-name` / `.widg.name` — name widget
2. `.hero-quick-stats` (whole block)
3–13. `.hero-widget` items: SYSTEM TIME, IDENTITY, GITHUB, SKILLS, NOW, HOMELAB, FEATURED PROJECT, STACK, ABOUT, PROJECTS, CONTACT
14–16. `.pcard` project cards under "ALL PROJECTS" (3 cards)
17. `.timeline` block as one widget (optional — user said timeline work already done; skip if it conflicts)

Use page prefix: `#pg-home .hero-name, #pg-home .hero-quick-stats, #pg-home .hero-widget, #pg-home .pcard, #pg-home .timeline`

### Projects page — 11 widgets
1–4. `.pi` index cards (Finance Buddy, Homelab Dashboard, TypeShift, orlon-bot)
5. `.vis-wrap` / `.chart-wrap` for Finance Buddy spending breakdown
6. `.nd-node` athena (inside Homelab Dashboard)
7. `.nd-node` atlas (inside Homelab Dashboard)
8. `.plat` Android (inside TypeShift)
9. `.plat` macOS (inside TypeShift)
10. `.plat` Windows (inside TypeShift)
11. `.vis-wrap` ML pipeline (inside orlon-bot)

Use page prefix: `#pg-projects .pi, #pg-projects .vis-wrap, #pg-projects .chart-wrap, #pg-projects .nd-node, #pg-projects .plat`

### Roadmap page — 36 widgets (month-by-month timeline EXCLUDED)
1–4. `.phase-card`
5. `.guide-card`
6–16. `.topic-card` (rendered by JS from `TOPICS` array)
17–26. `.career-card` (rendered by JS from `CAREERS` array)
27–35. `.resource-item`
36–38. `.stat-badge` (3 hero stat badges)

Use page prefix: `#pg-roadmap .phase-card, #pg-roadmap .guide-card, #pg-roadmap .topic-card, #pg-roadmap .career-card, #pg-roadmap .resource-item, #pg-roadmap .stat-badge`

### About page — 19 widgets
1. `.photo-frame`
2. `.core-tech-card`
3. `.edu-card`
4–7. `.skill-group` (4 groups)
8–11. `.lang-card` (4 cards)
12–15. `.int-card` (4 cards)
16–19. `.contact-card` (4 cards)

Optionally also `.avail-block` if present. Skip `.photo-status` (keep flat).

Use page prefix: `#pg-about .photo-frame, #pg-about .core-tech-card, #pg-about .edu-card, #pg-about .skill-group, #pg-about .lang-card, #pg-about .int-card, #pg-about .contact-card, #pg-about .avail-block`

### /me page — 1 widget
1. `.me-auth-card`

Use page prefix: `#pg-me .me-auth-card`

---

## Rules / Constraints

1. **Apply liquid glass to widget containers only.** Do NOT style `.chip`, `.bchip`, `.sk`, `.badge`, `.tl-badge`, `.pi-tag`, `.sg-label`, `.edu-tag`, `.nd-svc-item`, `.plat-lang`, `.topic-footer`, `.career-footer`, `.career-chips`, `.contact-card` inner text, or any small inline elements.

2. **Preserve readability.** If a widget has dark content that would become unreadable with the semi-transparent glass background, keep an inner background or use a subtle inner gradient. Do NOT make text transparent.

3. **Keep existing layout.** Do not change grid placement, padding, margin, font sizes, or border-radius unless the existing radius is 0 and a rounded pill/card appearance is expected.

4. **Do NOT touch the topbar.** It already has liquid glass.

5. **Do NOT style timeline accordion items** on the roadmap page (`#pg-roadmap .tl-item`, `.tl-header`). The month-by-month timeline is explicitly excluded.

6. **Avoid double borders / doubled effects.** Replace existing background/border/shadow with the liquid glass formula; do not stack.

7. **Cross-browser:** keep `-webkit-backdrop-filter` alongside `backdrop-filter`.

8. **No `!important` unless absolutely necessary.** Use page-prefixed selectors for specificity.

---

## Implementation steps

1. Confirm you are on `feat/widget-liquid-glass`.
2. Open `prototypes/portfolio-combined.html`.
3. Find the end of the `<style>` section and add a consolidated block named `/* WIDGET LIQUID GLASS PASS */`.
4. Apply the 5 glass properties to each target selector, grouped by page.
5. For each selector, first inspect its existing `background`, `border`, `box-shadow` and `border-radius`. Replace, don't stack.
6. Start a local server on `127.0.0.1:8900` (or another free port) and verify visually.
7. Check at least 3 pages for regressions.
8. Run `git status`, `git add`, commit, push, write DEVLOG.

---

## Definition of Done

- [ ] Liquid-glass CSS block added at the end of `<style>`
- [ ] All target widgets on all 5 pages have glass applied
- [ ] Topbar unchanged
- [ ] Roadmap timeline accordion items unchanged
- [ ] Text readable, no double borders/stacked shadows
- [ ] Local server verification performed
- [ ] Committed with `agent(opencode):` prefix
- [ ] Pushed to `origin feat/widget-liquid-glass`
- [ ] DEVLOG entry written
- [ ] Summary returned with verified per-page widget counts

---

## Agent mode / CLI

Mode: Execution (surgical CSS, large but mechanical)
CLI: `opencode`
Model: `kimi-k2.7-code`
Toolsets: terminal, file

## End-of-task contract

Before declaring done, run:
```bash
current=$(git rev-parse --abbrev-ref HEAD)
[ "$current" = "feat/widget-liquid-glass" ] || exit 1
git status
git add prototypes/portfolio-combined.html tasks/DEVLOG.md
git commit -m "agent(opencode): feat(widget-liquid-glass): apply topbar liquid-glass effect to all page widgets"
git push origin feat/widget-liquid-glass
```

Then write a DEVLOG entry summarizing pages modified, widget counts, issues, verification.

Return a concise summary to the parent agent.
