# Fonts Directory

> **Note (2026-06-27):** NDOT font files were removed. The `--font-ndot` CSS variable now points to `'Space Grotesk', sans-serif` as a one-line cascade for all 29 selectors that previously used NDOT. User feedback after deploying the site: the dot-matrix NothingOS aesthetic didn't suit the deployed portfolio.

## Vendored fonts

_None. All fonts are loaded from Google Fonts via the `<link>` tag in each HTML file:_

| Font | Use |
|---|---|
| Cormorant Garamond | Hero titles, calligraphic initials |
| Space Grotesk | Display, body, NDOT replacement |
| Outfit | Body text |
| DM Mono | Monospace labels, numbers |
| JetBrains Mono | Topbar metadata, monospace labels |
| Syne | About / projects page hero titles |

## Historical: NDOT (removed 2026-06-27)

NDOT 55 Regular and NDOT 55 Caps were vendored here from `xeji01/nothingfont` (community mirror) for NothingOS-style accents across widgets, topbar, and timeline entries. User feedback after the public deploy was that the dotted geometric character didn't fit the deployed aesthetic, so the font files were removed and the `--font-ndot` variable was repointed to Space Grotesk.

**Lesson recorded in `tasks/lessons.md`** — when user evaluates a deployed site (not the dev preview), font + color + spacing feedback is more reliable than during dev.