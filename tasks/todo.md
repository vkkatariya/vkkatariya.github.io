# tasks/todo.md — portfolio-website
> Current sprint items. Vishal manages this file.
> Agents: read at session start. Mark items complete as you go.

---

## Status legend
- `[ ]` — queued
- `[~]` — in progress
- `[x]` — done
- `[!]` — blocked

---

## Phase 0 — HTML Prototypes ✅ COMPLETE

- [x] Design system defined: NothingOS + Liquid Glass + Neomorphism + NeoPOP
- [x] Portfolio prototype v1 — iOS widget grid, 11 widgets, all design languages
- [x] Responsive: 4-col desktop → 3-col tablet → 2-col mobile
- [x] Homelab dashboard prototype v1 — NothingOS, 3-tab layout, simulated metrics
- [x] SVG icon system — 3D animated, self-contained, no CDN dependency
- [x] Icons on both prototypes (portfolio + dashboard)
- [x] Fixed duplicate `const SVC_ICON` / `TYPE_ICON` bug in dashboard
- [x] Project dev setup: AGENTS.md, CONTEXT.md, README.md, DEVLOG.md, todo.md, lessons.md

---

## Phase 1 — Fastify + WebSocket Backend

### 1a — Project scaffold (on `athena`)
- [ ] SSH into `athena`, navigate to `/srv/dev-shared/homelab/`
- [ ] `mkdir dashboard && cd dashboard`
- [ ] `mkdir api && cd api && npm init -y && npx tsc --init`
- [ ] Install: `fastify @fastify/websocket ws systeminformation dotenv`
- [ ] Install dev: `typescript ts-node nodemon @types/ws @types/node`
- [ ] `src/index.ts` — Fastify server, bind `127.0.0.1:7200`

### 1b — Metrics collector
- [ ] `src/metrics/collector.ts` — `systeminformation` polling class
  - [ ] `currentLoad()` → CPU percent
  - [ ] `mem()` → used / total bytes
  - [ ] `fsSize()` → per-disk used / total
  - [ ] `networkStats()` → rx_sec / tx_sec per interface
  - [ ] `time()` → uptime seconds
- [ ] Poll every 2000ms, store latest snapshot
- [ ] Graceful shutdown: clear interval on SIGTERM

### 1c — WebSocket endpoint
- [ ] `src/ws/metrics.ts`
  - [ ] Register `@fastify/websocket` plugin
  - [ ] Route: `GET /ws/metrics` → upgrade to WS
  - [ ] On connect: send snapshot immediately
  - [ ] Push every 2000ms to all connected clients
  - [ ] On disconnect: remove client from set
- [ ] Payload: `MetricsPush` TypeScript interface (cpu, mem, disk, net, uptime)

### 1d — REST endpoints
- [ ] `GET /api/health` — uptime + version
- [ ] `GET /api/metrics/current` — latest snapshot (for initial page load)

### 1e — pm2 + Caddy
- [ ] `pm2 start src/index.ts --name portfolio-api --interpreter ts-node`
- [ ] `pm2 save && pm2 startup`
- [ ] `tailscale cert --cert-file ... --key-file ... athena.auxois-wyrm.ts.net`
- [ ] `chown root:caddy key && chmod 640 key && chmod 644 cert`
- [ ] Add Caddy block: `api.auxois-wyrm.ts.net → 127.0.0.1:7200`
- [ ] `sudo caddy fmt --overwrite && sudo caddy validate && sudo systemctl restart caddy`
- [ ] Verify: WS connects from `hermes` → `wss://api.auxois-wyrm.ts.net/ws/metrics`

---

## Phase 2 — SvelteKit Scaffold

### 2a — Project init
- [ ] `pnpm create svelte@latest web` (in repo root)
- [ ] Install: `motion`, `better-sqlite3`, `@types/better-sqlite3`
- [ ] Copy design tokens to `src/lib/styles/tokens.css`
- [ ] Set up Google Fonts import (DM Mono + Syne)
- [ ] `src/app.css` — global reset, dot-matrix body bg

### 2b — WS client store
- [ ] `src/lib/ws/metricsStore.ts` — Svelte writable store fed by WS
  - [ ] Auto-connect to `wss://api.auxois-wyrm.ts.net/ws/metrics`
  - [ ] Exponential backoff on disconnect (1s → max 30s)
  - [ ] Export: `metricsStore`, `wsStatus` (`'connecting'|'open'|'closed'`)

### 2c — Widget components (port from prototype)
- [ ] `ClockWidget.svelte` — live clock, date, status badge
- [ ] `GitHubGrid.svelte` — contribution heatmap (GitHub API or static)
- [ ] `SkillBars.svelte` — neomorphic bar tracks
- [ ] `HomelabStatus.svelte` — node status dots, subscribes to `metricsStore`
- [ ] `FeaturedProject.svelte` — NeoPOP card with rocket decoration
- [ ] `StackList.svelte` — dot-separated stack items
- [ ] `AboutWidget.svelte` — Liquid Glass surface
- [ ] `ContactWidget.svelte` — inverted white widget

### 2d — Layout + pages
- [ ] `src/routes/+layout.svelte` — Liquid Glass navbar (floating pill)
- [ ] `src/routes/+page.svelte` — widget grid (4-col → 2-col responsive)
- [ ] `src/routes/lab/+page.svelte` — homelab dashboard stub
- [ ] `src/routes/lab/+page.server.ts` — pre-load initial metrics snapshot

### 2e — Projects section
- [ ] SQLite DB setup: `src/lib/db/index.ts`
- [ ] Schema: `projects (id, title, desc, tags, url, github, featured)`
- [ ] Seed with current projects (VPS Blueprint, RustDesk, Cockpit Blueprint, etc.)
- [ ] `GET /api/projects` Fastify route
- [ ] `ProjectCard.svelte` — NeoPOP offset shadow, chip tags, ghost button

---

## Phase 3 — Homelab Dashboard (/lab route)

- [ ] Port `homelab-dashboard.html` tabs to Svelte components:
  - [ ] `InfraTab.svelte` — widget grid, subscribes to `metricsStore`
  - [ ] `ServicesTab.svelte` — service registry with status dots
  - [ ] `DocsTab.svelte` — Notion page cards + slide-in panel
- [ ] `CpuPie.svelte` — SVG circular meter, takes `{pct, label}`
- [ ] `RamBar.svelte` — horizontal bar, takes `{used, total}`
- [ ] `StorageVbars.svelte` — vertical bar columns per drive
- [ ] `NetworkSparkline.svelte` — canvas dual-line chart
- [ ] Notion docs: server-side fetch via Notion API, 5-min cache

---

## Phase 4 — Deploy

- [ ] `docker-compose.yml` — `portfolio-api` service, bind mount `/srv/dev-shared/homelab/dashboard/api`
- [ ] Verify: `sudo ss -lntp | grep 7200` shows `127.0.0.1` only
- [ ] Vercel project connected to `vkkatariya/vkkatariya.github.io`
- [ ] `VITE_WS_URL=wss://api.auxois-wyrm.ts.net` env var in Vercel
- [ ] Custom domain: `vishalkatariya.dev` → Vercel
- [ ] GitHub Pages optional mirror configured
- [ ] Smoke test: widget grid loads, WS connects, metrics update live

---

## Phase 5 — /me Integration (backlog)

- [ ] Add `/me` route shell to SvelteKit
- [ ] Sub-routes: `/me/finance`, `/me/notes`, `/me/bookmarks`
- [ ] Shared auth (same JWT as finance-buddy, shared login page)
- [ ] Shared nav shell and design tokens

---

## Backlog (unscheduled)

- [ ] GitHub API integration — real contribution grid (not simulated)
- [ ] Dark/light mode toggle with `localStorage` persistence
- [ ] Contact form with Fastify endpoint + email (Resend or Nodemailer)
- [ ] CV/resume PDF download link
- [ ] CS Fundamentals Roadmap page (11 topics, 10 career paths)
- [ ] `orlon.io` domain — register + switch Tailscale auth operator identity
- [ ] Public read-only homelab status page (non-sensitive metrics subset)
