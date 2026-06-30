# Task: Rebuild OG sharing banner (business card style) + remove vishalkatariya.dev globally

**Branch:** `feat/og-banner-rebuild` (off `dev`)
**Mode:** Builder
**Complexity:** Non-trivial full workflow (image generation + multi-file text edits + visual QA)
**Author:** Hermes (kickoff)
**Date:** 2026-06-30
**Dispatched by:** Vishal (manually)
**Two parts:** OG image rebuild + global URL replace. Both in one branch, one commit, one PR.

---

## Context

The current OG sharing banner was generated during the `feat/logo-everywhere` task. It uses:
- Dark `#080808` background
- Plain "Vishal Katariya" text (no calligraphic treatment)
- Generic sans for the role labels (which got truncated — "Infrastructur" cut off)
- One URL: `vishalkatariya.dev` (wrong domain — site is on `vishal-katariya.com`)

Vishal's review (2026-06-30):
- Wants banner to read like a **personal business card** — glance tells you what you're clicking on
- Combine the **IDENTITY widget** + **CONTACT widget** visual treatment
- Use calligraphic Cormorant Garamond name (V/K drop initials, like the existing wordmark)
- Use DM Mono / JetBrains Mono for secondary text (matching the site's data-label typography)
- Treat the whole thing as a **widget block** (rounded glass, like the site's other widgets)
- Global URL replace: `vishalkatariya.dev` → `vishal-katariya.com` (13 files affected)

---

## Part 1: Rebuild `og-image.png` (the actual work)

### Target design — combines IDENTITY + CONTACT widget treatment

```
┌──────────────────────────────────────────────────────────────┐
│  📇 IDENTITY · 2026                          [↗]            │  ← kicker (top bar)
│                                                               │
│   [LOGO 80px]   𝗩ishal 𝗞atariya                              │  ← calligraphic name
│                                                               │
│   ┌─Darmstadt·DE─┐ ┌─h_da·CS─┐ ┌─intern-ready─┐              │  ← 3 monospaced pills
│                                                               │
│   ────  𝗼𝗽𝗲𝗻 𝘁𝗼 𝘄𝗲𝗿𝗸𝘀𝘁𝘂𝗱𝗲𝗻𝘁 𝗷𝗼𝗯𝘀  ────                    │  ← green status accent
│                                                               │
│   [✉]  vishalkatariya404@gmail.com                            │  ← contact line 1
│   [⌥]  github.com/vkkatariya                                 │  ← contact line 2
│   [⌘]  vishal-katariya.com                                    │  ← contact line 3
└──────────────────────────────────────────────────────────────┘
   ↑ 1200×630, dark glass on dark bg, widget-block treatment
```

### Specifications

| Property | Value | Source |
|---|---|---|
| Canvas | 1200 × 630 px | OG standard |
| Background | `#1B1C1D` (slightly lighter than `#080808`, matches the site's `--bg2`) — gives the widget a subtle lift off the page | Site's color tokens |
| Outer container | Rounded glass card: `border-radius: 24px`, `border: 1px solid rgba(255,255,255,.12)`, `background: rgba(255,255,255,.04)` (subtle glass) | Matches the site's widget-block treatment |
| Internal padding | 56px on all sides | Generous, business-card feel |
| Dot-matrix backdrop | `radial-gradient(circle, rgba(241,240,246,.04) 1px, transparent 1px)` at 18-20px (matches the site) | From the site's body::before pattern |
| Kicker | "📇 IDENTITY · 2026" in DM Mono 10px, `letter-spacing: 2px`, color `var(--w60)` (rgba white .6) | Matches `.lbl` / `.lbl-inv` typography |
| Top-right icon | Small `↗` (arrow up-right) in `var(--w30)` to match the identity widget's chevron | From the IDENTITY widget reference |
| Logo | Glass VK logo (`prototypes/assets/logo.png`), 80px display, top-left of the name | Use the existing source (DO NOT regenerate from the cropped favicon version — this is a different use case) |
| Name | "**V**ishal **K**atariya" with V and K as Cormorant Garamond italic drop initials (~120px), middle letters ("ishal", "atariya") in Space Grotesk 800 ~52px | Match the site's `.hn-script` + `.hn-sans` wordmark pattern (topbar pill, identity widget) |
| Status pills | 3 monospaced pills with `border: 1px solid rgba(255,255,255,.16)`, padding `6px 12px`, font `JetBrains Mono` 13px, color `var(--w60)`, gap 8px | Match the identity widget's "Darmstadt · DE", "h_da · CS", "intern-ready" pills |
| Status accent | Green line ("open to werkstudent jobs") in `var(--green)` (`#3DDC84`), font JetBrains Mono 16px, `letter-spacing: 1.5px`, with `───` decorative lines on either side | Match the contact widget's green pill but linear instead of a pill (more banner-appropriate) |
| Contact lines | 3 lines, each with an SVG icon (envelope, GitHub mark, globe) + text, font JetBrains Mono 15px, color `var(--w)`, gap 16px between icon and text | Match the contact widget's GitHub/email rows |

### What "done" looks like for Part 1

- `prototypes/assets/og-image.png` exists, 1200×630, ~30-80KB
- PNG looks like a screenshot of one of the site's widgets (rounded glass, dark theme, dot-matrix backdrop)
- Calligraphic name is readable at the 1200×630 size
- "Open to werkstudent jobs" is the most visually-prominent text after the name
- All 3 contact methods visible with icons
- No text truncation (the bug in the previous banner)

---

## Part 2: Global URL replace (`vishalkatariya.dev` → `vishal-katariya.com`)

### Files affected (13 total)

```
prototypes/portfolio-combined.html
prototypes/portfolio-prototypev.2.html
prototypes/portfolio-prototypev.1.html
prototypes/about.html
prototypes/resume.html
prototypes/portfolio-v4.html
tasks/todo.md
tasks/design-dual-deployment.md
tasks/DEVLOG.md
README.md
docs/portfolio_architecture_v2.html
docs/mental-model-tree.html
CONTEXT.md
```

### What to replace

`vishalkatariya.dev` → `vishal-katariya.com` (the actual live Vercel domain)

**CAUTION:** Do NOT replace in:
- Comments that say "vishalkatariya.dev was the old domain" (historical context — leave alone)
- URLs that include additional path/query (just replace the host portion)
- `vishalkatariya.dev` inside a string that's NOT a URL (e.g. user documentation explaining the old domain)

**Grep first** to make sure each replacement is sensible. Use a content-aware search, not a blind `sed -i`.

### What "done" looks like for Part 2

- `grep -r "vishalkatariya.dev" .` returns 0 results (except possibly in comments explaining history)
- All `<a href="...">`, `<link href="...">`, `og:url`, `canonical`, etc. point to `vishal-katariya.com`
- All user-visible text mentioning the URL says `vishal-katariya.com`
- No broken links (test by curling 2-3 of the new URLs after deploy)

---

## Workflow

### Phase 1 — Read context

1. `CONTEXT.md` — design system, color tokens, typography, deploy paths
2. `AGENTS.md` — behavior contract + DEVLOG hard rule
3. `tasks/DEVLOG.md` (last 3 entries) — current world state
4. `tasks/lessons.md` — L-068 (visual verification) is critical for Part 1
5. `tasks/todo.md` — current state of the Brand assets section

### Phase 2 — Branch + prep

1. `git status --short && git branch --show-current && git log --oneline -1` (L-055)
2. `git checkout dev && git pull origin dev`
3. `git checkout -b feat/og-banner-rebuild`

### Phase 3 — Generate the new OG image

1. Use Pillow (or write a Playwright HTML composition and screenshot — see approach B below):
   - Approach A: Pure Pillow — paint background, paste logo, draw text with `ImageFont.truetype()` for Cormorant Garamond + Space Grotesk + JetBrains Mono + DM Mono
   - **Approach B (recommended for typography):** Build the banner as an HTML file with the same CSS as the site (load the same Google Fonts, same CSS variables), render it with Playwright at 1200×630 viewport, screenshot the result. This guarantees the typography matches the live site exactly.
2. **Use Approach B.** Write `prototypes/assets/_og-template.html` (gitignored, temporary), put the banner content inside, render with `page.screenshot(clip={"x":0,"y":0,"width":1200,"height":630})`, save as `og-image.png`.
3. **Visual QA — REQUIRED per L-068:** render the PNG, screenshot it, show Vishal before committing. If V/K name doesn't read, status accent is wrong, pills are misaligned, etc. — iterate.

### Phase 4 — Update OG meta tags in all 7 HTML files

The og: tags are already in place (added in the favicon task). Just need to update:
- `og:image` → still `assets/og-image.png` (file is the same name, but the content is new)
- `og:title` → "Vishal Katariya — Portfolio" (consistent across all 7 files; currently varied)
- `og:description` → match the banner's value prop / status
- `og:url` → `https://vishal-katariya.com` (per Part 2)

Don't ADD new meta tags (already there). Just update the content.

### Phase 5 — Global URL replace

1. `grep -rln "vishalkatariya.dev" .` to confirm all 13 files
2. For each file: review the matches, decide which to replace, do the replacement
3. After: `grep -r "vishalkatariya.dev" .` should return 0 (or only historical-context comments)
4. Curl test: `curl -I https://vishal-katariya.com` (after deploy, before this branch merges) to confirm 200

### Phase 6 — Verify

1. **Visual QA — Part 1:** render the new OG image, screenshot, show Vishal
2. **HTML lint:** `npm run lint:html` (should pass)
3. **URL replace sanity:** `grep -r "vishalkatariya.dev" .` = 0 (or only history comments)
4. **No broken references:** check `<a href>` and `<link href>` for typos
5. **OG meta consistency:** all 7 HTML files have the same og:title/og:description/og:image

### Phase 7 — Commit + DEVLOG

```bash
git add prototypes/assets/og-image.png
git add prototypes/portfolio-combined.html prototypes/portfolio-v4.html prototypes/projects.html prototypes/about.html prototypes/cs-roadmap.html prototypes/resume.html index.html
git add prototypes/portfolio-prototypev.1.html prototypes/portfolio-prototypev.2.html
git add tasks/todo.md tasks/DEVLOG.md tasks/design-dual-deployment.md
git add README.md CONTEXT.md docs/portfolio_architecture_v2.html docs/mental-model-tree.html
git commit -m "agent(<your-cli>): rebuild OG banner as business card + global URL replace

Part 1 - OG image rebuild:
- New og-image.png (1200x630) designed as personal business card
- Combines IDENTITY widget + CONTACT widget visual treatment
- Calligraphic V/K name (Cormorant Garamond italic, matches site wordmark)
- DM Mono / JetBrains Mono for secondary text (matches site typography)
- Widget-block glass surface (rounded, border, dot-matrix backdrop)
- 'open to werkstudent jobs' green status accent (conversion hook)
- 3 contact lines with icons: email, GitHub, domain
- All 7 HTML files: og:title/og:description updated to match

Part 2 - Global URL replace:
- vishalkatariya.dev → vishal-katariya.com across 13 files
- 6 HTML files (live deploy)
- 3 docs files (CONTEXT.md, README.md, 2 docs/*.html)
- 3 task files (todo.md, DEVLOG.md, design-dual-deployment.md)

Visual QA at 1200x630: V/K readable, status accent prominent, no truncation.
No broken links. HTML lint passes."
git push origin feat/og-banner-rebuild
```

**MANDATORY DEVLOG entry** appended to `tasks/DEVLOG.md` (newest at top):
```markdown
## [YYYY-MM-DD HH:MM] [your-cli] — feat/og-banner-rebuild

**Did:**
- Generated new og-image.png (1200x630) using Playwright HTML composition (Approach B)
- Widget-block glass treatment, calligraphic name, 3 monospaced pills, green status, 3 contact lines
- Updated og:title/og:description on all 7 HTML files
- Replaced vishalkatariya.dev → vishal-katariya.com across 13 files

**State:** ready for Vishal review + merge
**Decided:** Approach B (Playwright HTML composition) for typography accuracy
**Blocked/Next:** waiting for Vishal to eyeball the new og-image.png
**Modified:** 14 files (1 image, 6 HTML live, 3 docs, 3 tasks)
```

**The DEVLOG entry is non-negotiable.** Per `AGENTS.md`: "If the session ends without a DEVLOG entry, write it as the final message anyway."

---

## Hard constraints

- **Use existing `prototypes/assets/logo.png`** for the banner — do not regenerate from the cropped favicon version
- **Visual verification before commit (L-068):** render the new og-image.png, screenshot it, show Vishal, only commit after sign-off
- **Use Playwright HTML composition (Approach B)** for the banner — guarantees the typography matches the live site exactly. Pure Pillow (Approach A) will look subtly off in font rendering
- **No new external dependencies** — use Pillow + Playwright + the existing Google Fonts (Cormorant Garamond, Space Grotesk, JetBrains Mono, DM Mono are all already loaded on the site)
- **No breaking the live deploy** — the URL change is global, but the live `vishal-katariya.com` is already serving the right content. The change is just to internal references and OG meta
- **No commits to `main` or `dev` directly** — work on `feat/og-banner-rebuild`, push, wait for Vishal
- **Don't touch the favicon work** (already on dev, do not modify those assets)
- **Don't touch the topbar logo work** (already on dev, do not modify those assets)
- **Don't touch `logo.png` itself** — use it as the source for the banner, no edits

## After completing

- Push `feat/og-banner-rebuild` to origin
- **Send Vishal the new og-image.png** as a preview (open in browser, screenshot, share)
- DO NOT auto-merge to dev. Wait for Vishal to review + merge.
- DO NOT delete any branches (per L-067 / branch discipline)
