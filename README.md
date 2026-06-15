# vkkatariya.github.io — portfolio-website

Personal portfolio web app. Live at `vishalkatariya.dev`.

Widget-based homepage (iOS home screen aesthetic) with live homelab metrics, project showcase, and planned `/me` personal section.

## Current state

| Artefact | Status |
|---|---|
| `prototypes/portfolio-prototype.html` | ✅ Feature-complete HTML prototype |
| `prototypes/homelab-dashboard.html` | ✅ Feature-complete HTML prototype |
| SvelteKit production build | ⬡ Not started |
| Fastify + WebSocket backend | ⬡ Not started |

See `tasks/todo.md` for the full phased task list.

---

## Features (prototype)

- **Widget grid** — iOS home-screen layout: live clock, GitHub contribution heatmap, skill bars, homelab node status, featured project (NeoPOP card), tech stack list, about (Liquid Glass), contact (inverted white)
- **Homelab dashboard** (`/lab`) — 3-tab ops dashboard: Infrastructure (CPU/RAM/storage/network widgets), Services (registry with URLs), Docs & Blueprints (Notion page viewer with slide-in panel)
- **NothingOS design** — dot-matrix background, DM Mono monospace, Syne 800 display numerals, `#080808` base
- **Liquid Glass navbar** — floating pill, `backdrop-filter: blur(28px)`, specular highlight, morphs to bottom dock on mobile
- **Responsive** — 4-col desktop → 3-col tablet → 2-col mobile; tested on Mac, iPad, iPhone
- **Animated SVG icons** — 3D server rack, rocket, chip, RAM stick, git branch, envelope, code brackets — all inline, no CDN

---

## Stack

| Layer | Prototype | Production |
|---|---|---|
| Frontend | Self-contained HTML | SvelteKit + TypeScript |
| Styling | Vanilla CSS | Shared `tokens.css` |
| Realtime | Simulated JS | WebSocket — Fastify + `ws` |
| Metrics | Static mock data | `systeminformation` on `athena` |
| Backend | None | Fastify + TypeScript on `athena` |
| Process | n/a | pm2 on `athena` |
| Ingress | `file://` | Caddy + Tailscale file-cert |
| Animations | CSS keyframes | Motion One |
| DB | n/a | SQLite (`better-sqlite3`) |

---

## Design system

**Three design languages zoned by purpose:**

| Layer | Design | CSS approach |
|---|---|---|
| Nav / frames | Liquid Glass (Apple iOS 26) | `backdrop-filter: blur(28px) saturate(200%)` + specular inset |
| Widget surfaces | Neomorphism | dual `box-shadow` — dark + faint light |
| CTAs / cards | NeoPOP (CRED) | offset 3D shadow in vanilla CSS |
| Widget internals | NothingOS | DM Mono, dot labels, dot-matrix bg |

**Palette:** `#080808` base, `#f0f0f0` text, `#3DDC84` green, `#FFBB33` amber.  
**Fonts:** `DM Mono` (data/labels) + `Syne 800` (display numerals) via Google Fonts CDN.  
**Icons:** 34-symbol self-contained inline SVG system.

---

## Running locally

```bash
open prototypes/portfolio-prototype.html
open prototypes/homelab-dashboard.html
# No build step — fully self-contained
```

---

## Repo structure

```
vkkatariya.github.io/
├── AGENTS.md               ← agent behavioural contract
├── CONTEXT.md              ← project context (stack, infra, conventions)
├── README.md               ← this file
├── prototypes/
│   ├── portfolio-prototype.html
│   └── homelab-dashboard.html
├── tasks/
│   ├── todo.md             ← sprint tracker (Vishal manages)
│   ├── DEVLOG.md           ← append-only session log (agents write)
│   └── lessons.md          ← prevention rules from corrections
└── web/                    ← SvelteKit project (Phase 2, not started)
    └── api/                ← Fastify project (Phase 1, not started)
```

---

## Related projects

- **homelab-dashboard** — separate repo, separate AGENTS/CONTEXT/DEVLOG, shares design tokens
- **finance-buddy** — separate repo, `vishalkatariya.dev/me/finance`

---

## Agent kickoff

```
Project: portfolio-website
Path: ~/dev/vkkatariya.github.io/
Read: AGENTS.md, CONTEXT.md, last 5 entries of tasks/DEVLOG.md, tasks/todo.md
```
