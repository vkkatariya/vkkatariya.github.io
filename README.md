# vkkatariya.github.io — portfolio-website

![CI](https://github.com/vkkatariya/vkkatariya.github.io/actions/workflows/ci.yml/badge.svg)

Personal portfolio web app. Live at `vishalkatariya.dev`.

This is a **simple standalone portfolio** — not a monolith. Real projects (homelab dashboard, finance buddy) live on their own private subdomains and are linked from `/projects`. Private notes and tools live behind `/me` auth.

## Current state

| Prototype | Status |
|---|---|
| `prototypes/portfolio-v4.html` | Homepage — 3-pill topbar, widget grid, timeline |
| `prototypes/projects.html` | Project showcase linking to standalone apps |
| `prototypes/about.html` | Bio, education, skills, languages, contact |
| `prototypes/cs-roadmap.html` | Dedicated CS roadmap page |
| `prototypes/portfolio-combined.html` | Single-file SPA spike (reference only) |
| SvelteKit production build | not started |

See `tasks/todo.md` for the full phased task list.

---

## Features

- **Widget grid** — iOS home-screen layout with live clock, status widgets, project cards
- **3-pill glass topbar** — left logo, center nav, right controls (search, EN/DE, theme, profile)
- **Project showcase** — cards that link out to real standalone apps
- **CS Roadmap** — dedicated `/roadmap` page in NothingOS style
- **About/Contact** — bio, education, skills, 4 languages, interests
- **Private `/me` section** — identity vault, Notion docs, notes (behind auth)
- **Self-contained SVG icons** — no external CDN dependency

---

## Architecture v2

| Route | Public/Private | Host |
|---|---|---|
| `/` | public — homepage | Vercel |
| `/projects` | public — project links | Vercel |
| `/roadmap` | public — CS roadmap | Vercel |
| `/about` | public — about + contact | Vercel |
| `/me/*` | private — vault, docs, notes | athena (Tailscale) |

Standalone projects:
- `studio.auxois-wyrm.ts.net` — homelab dashboard
- `buddy.auxois-wyrm.ts.net` — finance buddy

### Tailscale gating for `/me`

`/me/*` is served only from athena and is never part of the public Vercel deployment. Access control is enforced at the reverse proxy / network layer, not in the page:

- **Recommended pattern:** Caddy `remote_ip` matcher that rejects any client outside the Tailscale CGNAT range `100.64.0.0/10` with `403`. See `homelab-configs/me-tailscale-caddy.conf`.
- **Alternative pattern:** bind the static server to the Tailscale IP only, e.g. `python3 -m http.server 8900 --bind "$(tailscale ip -4)"`, so the service has no public listening socket.
- **Not allowed:** page-level passwords, client-side auth checks, or exposing `/me` content on `vishalkatariya.dev`.

The `/me` section shown in `portfolio-combined.html` is just a static information card; the real gate lives on athena.

---

## Stack

| Layer | Prototype | Production |
|---|---|---|
| Frontend | Self-contained HTML | SvelteKit + TypeScript |
| Styling | Vanilla CSS | Shared `tokens.css` |
| Fonts | Google Fonts CDN | Same CDN |
| Backend | none | Vercel serverless functions (contact form, GitHub API proxy) |
| DB | none | none; private data stays on athena |
| Auth | none | Tailscale-gated access for `/me` on athena |

---

## Design system

**Fonts:**
- Cormorant Garamond italic — artistic `V`/`K` initials
- Space Grotesk — display text, nav, headings
- Outfit — body/readable text
- DM Mono — data labels

**Three design languages zoned by purpose:**

| Layer | Design | CSS approach |
|---|---|---|
| Nav / frames | Liquid Glass | `backdrop-filter: blur(40px) saturate(180%)` |
| Widget surfaces | Neomorphism | dual `box-shadow` |
| CTAs / cards | NeoPOP | offset 3D shadow in vanilla CSS |
| Widget internals | NothingOS | DM Mono, dot labels, dot-matrix bg |

**Palette:** `#080808` base, `#f0f0f0` text, `#3ddc84` green, `#00D4AA` teal accent.

---

## Running locally

```bash
open prototypes/portfolio-v4.html
open prototypes/projects.html
open prototypes/about.html
open prototypes/cs-roadmap.html
# No build step for prototypes
```

---

## Repo structure

```
vkkatariya.github.io/
├── AGENTS.md               ← agent behavioural contract
├── CONTEXT.md              ← project context (stack, infra, decisions)
├── README.md               ← this file
├── prototypes/             ← HTML prototypes
│   ├── portfolio-v4.html
│   ├── projects.html
│   ├── about.html
│   ├── cs-roadmap.html
│   └── portfolio-combined.html
├── docs/                  ← architecture diagrams, references
│   ├── mental-model-tree.html
│   └── portfolio_architecture_v2.html
└── tasks/
    ├── todo.md             ← sprint tracker
    ├── DEVLOG.md           ← session log
    └── lessons.md          ← prevention rules
```

---

## Related projects

- **notion-artifacts** — separate project that generates HTML docs from Notion for `/me/docs`
- **homelab-dashboard** — separate project at `studio.auxois-wyrm.ts.net`
- **finance-buddy** — separate project at `buddy.auxois-wyrm.ts.net`

---

## Agent kickoff

```
Project: portfolio-website
Path: ~/dev-shared/projects/portfolio-website/
Read: AGENTS.md, CONTEXT.md, last 5 entries of tasks/DEVLOG.md, tasks/todo.md
```
