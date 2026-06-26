# Dual Deployment Strategy — GitHub Pages + Vercel

> **Status:** Design (Vercel setup deferred)
> **Last updated:** 2026-06-27
> **Owner:** Vishal / Hermes

## Goals

1. **Zero-downtime Phase 1 development** — Phase 0 HTML stays live at the apex domain while Phase 1 (SvelteKit) is being built on a separate branch
2. **Live preview URLs for every dev commit** — no `python3 -m http.server` dance; push to dev and see the result at a public URL
3. **Public iteration visibility** — share Phase 1 progress with collaborators without giving them Tailscale access
4. **Fallback deployment** — if Vercel goes down, the portfolio is still reachable via GitHub Pages
5. **Production Core Web Vitals tracking** — Speed Insights on the production deployment only (not preview, not tests)

## Architecture

```
Phase 0 (HTML prototype) — main branch
  ↓ auto-deploys to BOTH
GitHub Pages (vkkatariya.github.io)         ← legacy / fallback
Vercel production (vishal-katariya.com)     ← primary apex domain

Phase 1 (SvelteKit) — dev branch
  ↓ auto-deploys to
Vercel preview (vishalkatariya.dev)         ← preview deployment URL
```

## Deployment Matrix

| Branch | GitHub Pages | Vercel Production | Vercel Preview |
|---|---|---|---|
| `main` | ✓ (fallback) | ✓ (apex) | — |
| `dev` | — | — | ✓ (preview) |
| `feat/*` | — | — | ✓ (ephemeral) |

## Domain Roles (resolved 2026-06-27)

| Domain | Status | Target | Notes |
|---|---|---|---|
| `vishal-katariya.com` | ✓ Production | Vercel main | Auto-deploys on push to `main` |
| `www.vishal-katariya.com` | ✓ Production | Vercel main | Auto-redirects to apex |
| `vkkatariya.github.io` | ✓ Fallback | GitHub Pages | Served by `GitHub.com`, not Vercel |
| `vishalkatariya.dev` | ✗ Not used | — | Bare/www redirect loop (Hobby plan limitation) |
| `www.vishalkatariya.dev` | ✗ Not used | — | Custom domain preview requires Pro |

**Decision (2026-06-27):** Use **auto-generated preview URLs** (`portfolio-website-XXX-orlon-team.vercel.app`) for previews instead of custom domain. Pro plan ($20/month) needed for custom preview domain.

## Auto-generated Preview URL Pattern

Every push to `dev` (or any non-production branch) creates a deployment with a URL like:
```
https://portfolio-website-jflgtqp50-orlon-team.vercel.app
```

The hash is deployment-specific (changes per push). For a **stable branch URL** that updates on each push, Vercel uses:
```
https://portfolio-website-git-dev-orlon-team.vercel.app
```

The exact pattern depends on Vercel's deployment URL generation. Verify by checking the Deployments tab.

## Production + Preview Flow (current setup)

```
git push origin main
    ↓
Vercel auto-deploys to PRODUCTION
    ↓
https://vishal-katariya.com updates (auto-promotion)

git push origin dev
    ↓
Vercel creates PREVIEW deployment
    ↓
https://portfolio-website-XXX-orlon-team.vercel.app is publicly accessible
(Deployment Protection is DISABLED — set 2026-06-27)

GitHub Pages runs .github/workflows/pages.yml
    ↓
https://vkkatariya.github.io updates
(Fallback — same content as production since main and dev are in sync)
```

## File Inventory (when Vercel is re-linked)

| File | Status | Action |
|---|---|---|
| `vercel.json` | Deleted | Re-add (single catch-all rewrite) |
| `package.json` | Deleted | Re-add (Vercel needs it for Speed Insights) |
| `lib/speed-insights.min.js` | Deleted | Re-add |
| `.gitignore` | Has `.vercel` + `.env*` | Keep as-is |
| `CNAME` | Deleted | Re-add `vishal-katariya.com` when ready |
| `index.html` | Points at `vkkatariya.github.io` | Update to point at `vishal-katariya.com` |
| `.github/workflows/pages.yml` | Active | Keep — handles GitHub Pages deploy |
| `.github/workflows/ci.yml` | Phase 1 placeholder | Keep — SvelteKit build check |

## Cutover Plan (Phase 0 → Phase 1)

1. **Phase 1 ships to `feat/phase-1-sveltekit` branch** (SvelteKit scaffold work)
2. **Vercel preview deployments** show the new SvelteKit version at `vishalkatariya.dev` automatically
3. **Iterate live without touching production** — every push to dev branch updates preview
4. **Test against Phase 0 side-by-side** for ~1 week
5. **Merge `feat/phase-1-sveltekit` → `dev`** → Vercel preview updates
6. **Merge `dev` → `main`** → Vercel production deploys to `vishal-katariya.com`
7. **GitHub Pages falls back to "this site has moved"** splash (or keep archived)
8. **After 30 days of stable Phase 1**: delete `portfolio-combined.html`, archive old prototypes

## DNS Strategy

| Domain | Type | Target |
|---|---|---|
| `vishal-katariya.com` | ALIAS / CNAME | `cname.vercel-dns.com` |
| `www.vishal-katariya.com` | CNAME | `cname.vercel-dns.com` |
| `vishalkatariya.dev` | ALIAS / CNAME | `cname.vercel-dns.com` (preview) |
| `www.vishalkatariya.dev` | URL redirect | `vishal-katariya.com` (registrar-level) |

## Vercel Configuration (when re-linked)

### Production Environment
- **Branch:** `main`
- **Domain:** `vishal-katariya.com`, `www.vishal-katariya.com`
- **Speed Insights:** enabled
- **Build:** `npm run build` (echoes "No build step for HTML")
- **Output:** `.`
- **Rewrites:** single catch-all `/(.*) → /prototypes/portfolio-combined.html`

### Preview Environment
- **Branch:** `dev` (and all `feat/*`)
- **Domain:** `vishalkatariya.dev`
- **Speed Insights:** disabled (avoid polluting data with test traffic)
- **Same build/output/rewrites as production**

## Smoke Test (post-deploy verification)

Every deploy (GitHub Pages + Vercel) must be smoke-tested:
- `curl https://<deploy-url>/` returns 200
- `curl https://<deploy-url>/projects` returns 200 (if Vercel rewrite works)
- `curl https://<deploy-url>/about` returns 200
- `curl https://<deploy-url>/roadmap` returns 200

For GitHub Pages: implemented in `.github/workflows/pages.yml` as a second job
For Vercel: pending, will be added in a future workflow run

## Known Risks (Lessons Learned)

### Risk: Vercel custom-domain 404 on subpaths
**Documented:** L-057
**Symptom:** `vishal-katariya.com` returns 200 on root, 404 on `/projects`, `/about`, `/roadmap` — even though `https://portfolio-website-bbwmnd8pz.vercel.app/projects` returns 200 (rewrite applied correctly).
**Mitigation:** Smoke test all subpaths after deploy. If broken: `vercel alias rm <domain>` + re-add + force-redeploy.

### Risk: CNAME on GitHub Pages creates hidden redirect layer
**Documented:** L-058
**Symptom:** `vkkatariya.github.io` 301s to CNAME target, masking whether GitHub Pages is actually serving correctly.
**Mitigation:** Check for `CNAME` file in repo root before debugging Pages. Delete if target is dead/broken.

### Risk: Main branch drift
**Documented:** Memory rule (no explicit L-number)
**Symptom:** `main` can get ahead of `dev` if you merge `dev → main` without going through `dev` first.
**Mitigation:** Always `git checkout dev` → `git merge main` → fast-forward dev to main. Then `dev → main` only via PR or explicit merge.

## Branch Protection Rules (when ready)

For `main` branch:
- ✓ Require pull request before merging
- ✓ Require `dev` to be up-to-date before merging
- ✓ Require linear history (no merge commits from features)
- ✗ Direct push disabled

## When to Re-enable Vercel

Re-link Vercel when:
- Phase 1 SvelteKit scaffold is started (so Vercel preview deployments are useful)
- OR you want a custom domain working on a production deployment
- OR you want Speed Insights tracking

Do NOT re-link just to re-link — the extra deploy complexity has a real cost.

## Implementation Order (when ready)

1. Verify GitHub Pages smoke test is in place (this document's check)
2. `vercel login` + `vercel link` to re-create project
3. Cherry-pick or recreate `vercel.json`, `package.json`, `lib/speed-insights.min.js`
4. Add Vercel domains in dashboard: `vishal-katariya.com` (production) + `vishalkatariya.dev` (preview)
5. Configure branch settings in Vercel dashboard
6. Update `index.html` to point at Vercel URL
7. Update `CNAME` if using GitHub Pages for custom domain (mutually exclusive)
8. Verify smoke tests pass on all deploy targets
9. Document the working state in DEVLOG

## References

- L-040 — Browser-verify, not just file inspection
- L-055 — Check `git branch --show-current` before committing
- L-056 — Inline styles can break responsive CSS Grid media queries
- L-057 — Vercel custom domain rewrites may 404 on subpaths
- L-058 — CNAME on `vkkatariya.github.io` creates hidden redirect layer
- Memory: "main should never be ahead of dev" — branch invariant
- Memory: "Use --no-ff on dev→main merges"
- Memory: "Don't use --delete-branch on gh pr merge"