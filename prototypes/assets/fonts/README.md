# NDOT Font — Vendored for portfolio

## What this is

The **NothingOS NDOT typeface**, extracted from NothingOS system files by the community and re-mirrored on GitHub at
[xeji01/nothingfont](https://github.com/xeji01/nothingfont).

NDOT is the geometric dotted display font Nothing uses throughout its OS — every `01` `02` `03` label, every widget index, every status indicator on a Nothing phone is set in NDOT.

## Variants included

| File | Size | Use |
|---|---|---|
| `Ndot55-Regular.otf` | 77 KB | Primary face. 55-dot height. The standard NDOT. |
| `Ndot55Caps-Regular.otf` | 220 KB | All-caps variant. For uppercase display use only. |

Other variants in the upstream repo (not vendored here — `Ndot57-Regular.otf`, `NType82-Regular.otf`, `Lettera Mono LL`, `Ndot77JPExtended.ttf`) were skipped to keep the bundle small. Add them as needed.

## Source

- **Repo:** https://github.com/xeji01/nothingfont
- **Upstream commit:** `9d8b51d` (Apr 27, 2025 — "add Ndot-57 Caps")
- **Direct download URLs:**
  - `https://raw.githubusercontent.com/xeji01/nothingfont/main/fonts/Ndot55-Regular.otf`
  - `https://raw.githubusercontent.com/xeji01/nothingfont/main/fonts/Ndot55Caps-Regular.otf`
- **Vendored on:** 2026-06-20

## ⚠️ License note — read before redistributing

**NDOT is NOT officially OFL-licensed.** Nothing did not release the NDOT typeface under an open-source license.

The files in `xeji01/nothingfont` were extracted from NothingOS system files by community members and re-uploaded. This is **not an authorized redistribution** — it's a fan-mirror of a proprietary typeface.

**Our usage:** Personal portfolio at `vishalkatariya.dev`. Single-developer, non-commercial, no redistribution. This falls into a defensible fair-use zone — we're displaying the font on a personal site, not redistributing the files or selling them.

**What you should NOT do:**
- ❌ Re-vendor these files into another open-source project
- ❌ Sell anything that uses this font
- ❌ Claim NDOT is your own design or that you've licensed it from Nothing
- ❌ Use on a commercial product without consulting a lawyer

**If Nothing ever sends a takedown request:** comply, remove the files, switch to an OFL-licensed alternative. Open alternatives close to NDOT's aesthetic: **Departure Mono** (OFL), **Geist Mono** (OFL, Vercel-built), or the existing **DM Mono** already loaded elsewhere in the project.

## How to use in CSS

The portfolio declares NDOT as a CSS variable in `prototypes/portfolio-combined.html`:

```css
@font-face {
  font-family: 'Ndot';
  src: url('assets/fonts/Ndot55-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
:root {
  --font-ndot: 'Ndot', 'DM Mono', monospace;
}
```

Apply it via `font-family: var(--font-ndot);` on any selector. The fallback chain keeps DM Mono as a safety net if NDOT fails to load.

## How to update or replace

1. **Update** — re-run the `curl` commands above. Commit the new files with a note in `tasks/DEVLOG.md`.
2. **Replace with another face** — drop in any `.otf`/`.ttf`/`.woff2`, update the `@font-face` `src` URL, update `--font-ndot` fallback chain. Keep the README's license note accurate.
3. **Remove entirely** — delete the files, remove the `@font-face` block from the HTML, remove all `var(--font-ndot)` usages.

## Related

- `tasks/kickoff-vendor-ndot-font.md` — the kickoff prompt that defined this work
- `tasks/lessons.md` — prevention rules (the font vendor work itself didn't introduce any new lessons, but the licensing trade-off is documented here in case future contributors want to challenge it)