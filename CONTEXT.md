# CONTEXT.md — portfolio-website
> Single source of truth for stack, infrastructure, decisions, and conventions.
> Every agent reads this before touching any file.
> **This is the portfolio-website project only. Homelab dashboard is a separate project.**

---

## What this is
Personal portfolio web app hosted at `vishalkatariya.dev`.
Widget-based homepage (iOS home screen style) with live data, animations, and a project showcase.
Homelab dashboard added later as `/lab` route — **not yet built**.

---

## Current status
**Phase 0 — HTML Prototype:** COMPLETE
`prototypes/portfolio-prototype.html` — self-contained, NothingOS + Liquid Glass + Neomorphism + NeoPOP design.
`prototypes/homelab-dashboard.html` — separate prototype for the /lab route (not yet ported).
**Phase 1 — SvelteKit + Fastify production build:** NOT STARTED

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | SvelteKit + TypeScript | Vercel deploy, `vishalkatariya.dev` |
| Styling | Custom CSS — NothingOS + Liquid Glass + Neomorphism + NeoPOP | Shared tokens in `src/lib/styles/tokens.css` |
| Fonts | DM Mono + Syne | Google Fonts CDN |
| Backend | Fastify + TypeScript | REST + WebSocket, runs on `athena` via pm2 |
| Realtime | WebSocket (`ws` npm) | Push homelab metrics every 2s |
| Metrics | `systeminformation` npm | CPU, RAM, disk, network from `athena` |
| DB | SQLite (`better-sqlite3`) | Project metadata only |
| Process | pm2 | Always-on WS backend on `athena` |
| Animations | Motion One | Scroll-triggered + page transitions |

---

## Infrastructure

| Node | Role | LAN | Tailscale |
|---|---|---|---|
| `athena` | Rock 5T — Docker host, WS backend, NPU | 192.168.178.198 | ✅ on tailnet |
| `atlas` | Dell OptiPlex — Proxmox VE | 192.168.178.x | ✅ on tailnet |
| `hermes` | MacBook — dev workstation | — | ✅ on tailnet |
| Vercel | Frontend CDN | — | public |

**Tailnet:** `auxois-wyrm.ts.net`
**Frontend deploy:** Vercel → `vishalkatariya.dev`
**Mirror:** GitHub Pages → `vkkatariya.github.io` (optional, same repo)
**WS backend:** `athena` (Rock 5T), port `7200` internal, Caddy proxied via Tailscale

> ⚠️ Old VPS (`sovikata`, DigitalOcean) — **subscription cancelled**. All services migrated on-premises to `athena`.

---

## Repo
- **GitHub:** `vkkatariya/vkkatariya.github.io`
- **Domain:** `vishalkatariya.dev`
- **GitHub username:** `vkkatariya` (not `vishalkatariya`)

---

## Design system

**Palette:**
```css
--bg:  #080808;          /* near-black base */
--w:   #f0f0f0;          /* primary text */
--w60: rgba(240,240,240,.6);
--w30: rgba(240,240,240,.3);
--w12: rgba(240,240,240,.12);
--green: #3DDC84;        /* online / success */
```

**Three design layers (zoned):**
- **Liquid Glass** → navbar, widget frames, overlays (`backdrop-filter: blur(28px) saturate(200%)`)
- **Neomorphism** → widget card surfaces (`box-shadow: 5px 5px 16px rgba(0,0,0,.85), -2px -2px 7px rgba(255,255,255,.035)`)
- **NeoPOP** → CTAs, project cards (offset 3D shadow in vanilla CSS — NOT the npm package)

**NothingOS elements:** DM Mono monospace, 20px dot-matrix background, 3px dot widget labels, `letter-spacing: 3px` uppercase labels.

**Icons:** Self-contained inline SVG only — no external CDN.

---

## Caddy config pattern (athena — file-cert)
```caddyfile
api.auxois-wyrm.ts.net {
    bind <tailscale-ip>
    tls /etc/caddy/certs/athena.auxois-wyrm.ts.net.crt \
        /etc/caddy/certs/athena.auxois-wyrm.ts.net.key
    reverse_proxy 127.0.0.1:7200
}
```

---

## File conventions

| Pattern | Usage |
|---|---|
| kebab-case | All filenames |
| `src/lib/components/` | SvelteKit components |
| `src/lib/styles/tokens.css` | Shared design tokens |
| `src/lib/api/` | API client + WS client helpers |
| `api/src/routes/` | Fastify route handlers |
| `api/src/ws/` | WebSocket server logic |
| `api/src/metrics/` | systeminformation collectors |
| `prototypes/` | HTML prototypes (source of truth for design) |

---

## Hard constraints
- No public ports — all backend traffic through Tailscale
- Bind mounts only, never named Docker volumes
- Always `cd` into service dir before any `docker compose` command
- All containers bind to `127.0.0.1` — never `0.0.0.0`
- `systemctl restart caddy` (not `reload`) when Caddy is in broken state
- TLS cert key: `root:caddy 640` / cert: `root:caddy 644`
- No external dependencies without asking Vishal first
- `athena` is ARM64 (`aarch64`) — never copy x86 binaries

---

## Rollout phases

| Phase | Focus | Status |
|---|---|---|
| 0 | HTML prototypes — design system, widget grid, homelab dashboard | ✅ Done |
| 1 | Fastify + WS backend on `athena` — systeminformation pipe | Not started |
| 2 | SvelteKit scaffold — port widget grid components | Not started |
| 3 | Live data wiring — metricsStore → widgets | Not started |
| 4 | Deploy — Vercel + pm2 on `athena` + Caddy config | Not started |
| 5 | `/me` integration — `/me/finance`, `/me/notes`, `/me/bookmarks` | Planned |

---

## Current focus
[Vishal updates this line when the sprint changes]
`Prototype complete. Next: Fastify WS backend scaffold on athena.`
