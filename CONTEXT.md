# CONTEXT.md — portfolio-website
> Single source of truth for stack, infrastructure, decisions, and conventions.
> Every agent reads this before touching any file.
>
> **Mental model:** This is a simple personal portfolio web app. It is **not** a monolith.
> It links to standalone projects (homelab dashboard, finance buddy) that live on their own
> subdomains. Private notes and tools live behind `/me` auth. Keep it simple.

---

## What this is

A personal portfolio web app at `vishalkatariya.dev`.

- Public: homepage, project showcase, CS roadmap, about/contact.
- Private (behind auth): `/me/vault`, `/me/docs`.
- External: real apps live on their own subdomains and are only linked from `/projects`.

---

## Current status

**Phase 0 — HTML Prototypes:** in progress
- `prototypes/portfolio-v4.html` — homepage with 3-pill glass topbar, widget grid, timeline.
- `prototypes/projects.html` — project showcase linking to standalone apps.
- `prototypes/about.html` — bio, education, skills, languages, contact.
- `prototypes/portfolio-combined.html` — single-file SPA spike.
- `prototypes/cs-roadmap.html` — dedicated CS roadmap page.

**Phase 1 — SvelteKit production scaffold:** NOT STARTED

---

## Architecture v2

| Route | Public/Private | What it is | Host |
|---|---|---|---|
| `/` | public | Homepage — widget grid + career timeline + "now" status | Vercel |
| `/projects` | public | Cards linking to standalone project sites | Vercel |
| `/roadmap` | public | Port of `cs-roadmap.html` | Vercel |
| `/about` | public | Bio, h_da education, skills, 4 languages, contact | Vercel |
| `/me/vault` | private | Identity vault — aliases tracker | athena (Tailscale) |
| `/me/docs` | private | Notion artifacts rendered as HTML | athena (Tailscale) |
| `/me/notes` | private | Future Notion workspace mirror (backlog) | athena (Tailscale) |

| Standalone app | Subdomain | Why it's separate |
|---|---|---|
| Homelab dashboard | `studio.auxois-wyrm.ts.net` | Private metrics + service control panel |
| Finance buddy | `buddy.auxois-wyrm.ts.net` | Private transaction dashboard |

**Hosting split:**
- **Vercel (`vishalkatariya.dev`)** serves all public routes. Repo already connected; domain already configured.
- **athena (`auxois-wyrm.ts.net`)** serves anything private or backend-heavy via Tailscale. No public exposure.
- This is a hybrid architecture: public edge CDN for speed + reliability; homelab for private control and self-hosted data.

### Tailscale gating for `/me`

`/me/*` is private and never deployed to the public Vercel site. Access is enforced at the homelab edge, not inside the page:

1. **Preferred: Caddy `remote_ip` matcher** (see `homelab-configs/me-tailscale-caddy.conf`):
   - Match the Tailscale IPv4 CGNAT range `100.64.0.0/10`.
   - Return `403` to any non-Tailnet client before the request reaches the upstream.
   - Upstream is the static server/container bound to `127.0.0.1:8900` on athena.

2. **Alternative: bind the static server to the Tailscale IP only** so the service has no public listening socket:
   ```bash
   python3 -m http.server 8900 --bind "$(tailscale ip -4)"
   ```
   With this approach no Caddy `remote_ip` rule is required, but the Caddy reverse-proxy + certificate path is still the recommended production pattern.

3. **Explicitly not allowed:** page-level passwords, client-side auth checks, or exposing `/me` content on `vishalkatariya.dev`.

The `/me` page in `portfolio-combined.html` is only an informational placeholder used inside the prototype; the real gate lives at the reverse proxy / network layer on athena.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | SvelteKit + TypeScript | Vercel deploy, `vishalkatariya.dev` |
| Styling | Vanilla CSS with shared tokens | NothingOS + Liquid Glass + Neomorphism + NeoPOP |
| Fonts | Cormorant Garamond + Space Grotesk + Outfit + DM Mono | Google Fonts CDN |
| Backend | None for portfolio itself | Vercel serverless functions for contact form + GitHub contribution grid proxy; private `/me` backend on athena |
| DB | None planned | Project metadata hardcoded or fetched at build time; private data stays on athena |
| Auth (for `/me`) | Tailscale-gated access on athena | Tailscale IP allowlist or Caddy `remote_ip` matcher; no public auth surface. The `/me` page in `portfolio-combined.html` is just a static info card — real enforcement is at the reverse proxy / network layer. |

---

## Infrastructure

| Node | Role | Tailscale |
|---|---|---|
| `athena` | Rock 5T — Docker host, homelab dashboard backend | ✅ on tailnet |
| `atlas` | Dell OptiPlex — Proxmox VE, finance buddy backend | ✅ on tailnet |
| `hermes` | MacBook — dev workstation | ✅ on tailnet |
| Vercel | Portfolio frontend CDN | public |

**Tailnet:** `auxois-wyrm.ts.net`  
**Portfolio deploy:** Vercel → `vishalkatariya.dev`  
**GitHub mirror:** `vkkatariya.github.io`

---

## Repo

- **GitHub:** `vkkatariya/vkkatariya.github.io`
- **Domain:** `vishalkatariya.dev`
- **GitHub username:** `vkkatariya`

---

## Design system

**Palette (from `portfolio-v4.html`):**
```css
--bg:   #080808;          /* near-black base */
--bg2:  #0f0f0f;
--bg3:  #141414;
--w:    #f0f0f0;          /* primary text */
--w60:  rgba(240,240,240,.6);
--w30:  rgba(240,240,240,.3);
--w12:  rgba(240,240,240,.12);
--green:#3ddc84;          /* online / success */
--acc:  #00D4AA;          /* teal accent */
--amber:#ffbb33;
--blue: #5b9cf6;
--red:  #ff453a;
```

**Three design layers (zoned):**
- **Liquid Glass** → navbar, widget frames, overlays (`backdrop-filter: blur(40px) saturate(180%)`)
- **Neomorphism** → widget card surfaces (`box-shadow` dual dark + faint light)
- **NeoPOP** → CTAs, project cards (offset 3D shadow in vanilla CSS)

**NothingOS elements:** DM Mono, dot-matrix background, dot widget labels, uppercase letter-spaced labels.

**Font stack:**
- **Cormorant Garamond italic** — artistic `V`/`K` initials
- **Space Grotesk** — display text, nav, headings
- **Outfit** — body/readable text
- **DM Mono** — data labels, code, technical labels

**Icons:** Self-contained inline SVG only — no external CDN.

---

## Page transitions & animation spec

**Rule:** Page transitions are optional in Phase 0, mandatory in Phase 1. No jarring hard cuts.

### HTML prototype behavior (Phase 0)

`portfolio-combined.html` uses an inline SPA switch via `showPage(slug)`:
- The active page gets `.active` (`opacity:1; pointer-events:auto; transform:translateY(0) scale(1)`).
- Inactive pages keep `.page` (`opacity:0; pointer-events:none; transform:translateY(10px) scale(.99)`).
- Transition: `opacity .45s cubic-bezier(.22,.61,.36,1), transform .55s cubic-bezier(.22,.61,.36,1)`.
- Scroll resets to top on every switch (`window.scrollTo(0,0)`).
- No exit animation — fade-in only (simplest and avoids layout thrash).

### SvelteKit behavior (Phase 1)

Use `svelte/transition` with a global layout wrapper keyed to `$page.url.pathname`:
```ts
import { fly, fade } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

const pageTransition = (node, { y = 16, duration = 350 }) =>
  fly(node, { y, duration, easing: cubicOut });
```
- Enter: `fly` from `y:16` + `fade` from `0` (simultaneous).
- Exit: none (Phase 1 MVP) or a fast `fade` if performance budget allows.
- Easing: `cubic-bezier(.22,.61,.36,1)` (`cubicOut` in Svelte).
- Duration: 350–450ms on desktop, 250ms on mobile (`prefers-reduced-motion` → instant).
- Scroll behavior: `scrollTo(0,0)` on route change.

### Motion budget

- Avoid layout-triggering animations (no `width`/`height` transitions on route change).
- Prefer `transform` + `opacity`.
- Respect `prefers-reduced-motion: reduce` — disable all transitions.

### Roadmap exception

`/roadmap` is a **single long scrollable page**, not a nested SPA. Internal anchors (overview, topics, careers, resources) scroll smoothly within the page. The roadmap internal nav morphs from the shared topbar center pill.

---

## File conventions

| Pattern | Usage |
|---|---|
| kebab-case | All filenames |
| `prototypes/` | HTML prototypes, source of truth for design |
| `ref:resources/` | Architecture diagrams, reference images |
| `src/lib/styles/tokens.css` | Shared design tokens (Phase 1) |
| `src/lib/components/` | SvelteKit components (Phase 1) |
| `src/routes/` | SvelteKit routes |
| `tasks/` | `todo.md`, `DEVLOG.md`, `lessons.md` |

---

## Hard constraints
- No public backend ports for the portfolio — external subdomains handle their own security.
- All containers on `athena` bind to `127.0.0.1` — never `0.0.0.0`.
- No external dependencies without asking Vishal first.
- Keep the portfolio app simple. No live WebSocket, no embedded dashboards, no monolith.

---

## Rollout phases (v2)

| Phase | Focus | Status |
|---|---|---|
| 0 | HTML prototypes — homepage, projects, about, roadmap | in progress |
| 1 | SvelteKit scaffold, shared tokens, port design system | not started |
| 2 | Public routes: `/`, `/projects`, `/about`, `/roadmap` | not started |
| 3 | `/projects` links to standalone subdomains | not started |
| 4 | `/me` auth + private routes (`/me/vault`, `/me/docs`) | planned |
| 5 | Deploy Vercel + custom domain | planned |

---

## Current focus

`Phase 0: finalize homepage (portfolio-v4.html), then scaffold SvelteKit.`

---

## Related projects

- `notion-artifacts` — separate project that generates HTML docs from Notion for `/me/docs`
- `homelab-dashboard` — separate project at `studio.auxois-wyrm.ts.net`
- `finance-buddy` — separate project at `buddy.auxois-wyrm.ts.net`
