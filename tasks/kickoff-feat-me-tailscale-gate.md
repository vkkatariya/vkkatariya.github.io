# Kickoff: feat/me-tailscale-gate

## Context

Project: `~/dev-shared/projects/portfolio-website`
Target file: `prototypes/portfolio-combined.html`, `CONTEXT.md`, `README.md`, `tasks/todo.md`
Branch: `feat/me-tailscale-gate` (from `dev`)

Hybrid hosting architecture (2026-06-20):
- Public routes (`/`, `/projects`, `/roadmap`, `/about`) on Vercel at `vishalkatariya.dev`
- Private `/me/*` served from athena via Tailscale (`auxois-wyrm.ts.net`)

This task implements the access-control layer for `/me` at the homelab edge, not in the page itself.

## What to do

1. In `portfolio-combined.html`:
   - Keep `/me` page content minimal (already exists as `#pg-me`)
   - Add a visible note: "Private section — available on Tailnet only."
   - Remove the old "Decision pending: GitHub OAuth..." placeholder text.
   - Optionally add a link/button to the Tailscale-only URL (e.g., `https://me.auxois-wyrm.ts.net` or similar — leave as placeholder if exact hostname not decided).

2. In `CONTEXT.md`, `README.md`, and `tasks/todo.md`:
   - Document how `/me` is gated: Tailscale IP allowlist or Caddy `remote_ip` matcher.
   - Update `/me` task to reflect this implementation.

3. Create a reference Caddyfile or nginx snippet (save as `homelab-configs/me-tailscale-caddy.conf` or inside `prototypes/assets/`):
   - Example Caddy rule:
     ```
     me.auxois-wyrm.ts.net {
         @not_tailscale {
             not remote_ip 100.64.0.0/10
         }
         respond @not_tailscale "Access denied — Tailscale required" 403
         reverse_proxy localhost:8900
     }
     ```
   - Or bind the static server to the Tailscale IP only: `python3 -m http.server 8900 --bind $(tailscale ip -4)`
   - Pick the approach you think is cleanest and document it.

## Rules / Constraints

- Do NOT add page-level passwords or client-side auth logic. Access control is at the reverse proxy / network layer.
- Do NOT make `/me` content available on the public Vercel deployment.
- Keep the implementation simple and aligned with the user's existing homelab stack (Docker, Caddy, Tailscale).
- The static HTML prototype is still served from `portfolio-combined.html`; the gate is enforced by the server/reverse proxy when served from athena.

## Definition of Done

- [ ] `feat/me-tailscale-gate` branch based on latest `dev`
- [ ] `/me` page content updated in `portfolio-combined.html`
- [ ] Tailscale access-control pattern documented in `CONTEXT.md`, `README.md`, and `tasks/todo.md`
- [ ] Caddy or server config reference created
- [ ] Local verification: serve the file, confirm `/me` section renders the new message
- [ ] `git status` clean, committed with `agent(agy):` prefix
- [ ] Branch pushed to origin
- [ ] DEVLOG entry written
- [ ] Return summary

## Agent mode / CLI

Mode: Execution
CLI: `agy`
Model: `kimi-k2.7-code`
Toolsets: terminal, file

## End-of-task contract

```bash
current=$(git rev-parse --abbrev-ref HEAD)
[ "$current" = "feat/me-tailscale-gate" ] || exit 1
git status
git add prototypes/portfolio-combined.html CONTEXT.md README.md tasks/todo.md tasks/DEVLOG.md homelab-configs/me-tailscale-caddy.conf 2>/dev/null || true
git commit -m "agent(agy): feat(me-tailscale-gate): document and wire /me behind Tailscale"
git push origin feat/me-tailscale-gate
```
