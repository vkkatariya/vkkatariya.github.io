# tasks/lessons.md — portfolio-website
> Prevention rules learned from corrections during this project.
> Format: what failed · root cause · prevention rule.
> Agents: read this at session start. Add entries after any correction.

---

## L-001 — Duplicate `const` declarations crash the entire script

**What failed:** `Uncaught SyntaxError: Identifier 'SVC_ICON' has already been declared` in `homelab-dashboard.html`. Both `const SVC_ICON` and `const TYPE_ICON` were declared twice in the same `<script>` block. The dashboard became completely non-functional at browser parse time.

**Root cause:** Two separate editing passes each injected the same `const` blocks without checking for existing declarations. JavaScript's `const` disallows redeclaration in the same scope — no error during editing, only at browser parse time.

**Prevention rule:**
- Before injecting any `const`, `let`, or `function` into an existing file: `grep -n "const SVC_ICON\|function renderSvcFull"` — assert each appears zero times
- After any injection: `grep -c "const <identifier>"` must equal exactly 1
- General rule: **search before inject** — never assume a declaration doesn't exist yet
- When multiple passes are needed: explicitly delete stale blocks before re-injecting

---

## L-002 — External icon CDN unreachable in build environment

**What failed:** Planned to use Lordicon CDN (`cdn.lordicon.com`) for animated icons. All 25+ icon hash URLs returned HTTP `000` (connection timeout). The icon feature was blocked entirely.

**Root cause:** Build/sandbox environment has a strict CDN allowlist. `cdn.lordicon.com` is not on it. All requests silently fail with connection timeout.

**Prevention rule:**
- Test CDN reachability before building around it: `curl -s -o /dev/null -w "%{http_code}" --max-time 4 <url>`
- Allowed CDNs in this environment: `cdnjs.cloudflare.com`, `esm.sh`, `cdn.jsdelivr.net`, `unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`
- For icon systems: use **self-contained inline SVG** — zero CDN dependency, full colour control, offline-safe
- Never plan a feature around an external URL without verifying reachability first

---

## L-003 — NeoPOP npm package is React-only and unmaintained

**What failed:** Considered using `@cred/neopop-web` for NeoPOP button components. Package is React-specific and was last updated October 2023. Using it in SvelteKit would require a React adapter and introduce a heavy, stale dependency.

**Root cause:** Assumed a named design system library would be framework-agnostic.

**Prevention rule:**
- NeoPOP aesthetic must be implemented in **vanilla CSS only** — not the npm package
- The offset 3D shadow is ~10 lines of CSS: `box-shadow: 5px 5px 0 rgba(...)`, translate on `:hover`, flush on `:active`
- Never add a framework-specific package to a SvelteKit project without checking compatibility first
- Check npm package last-publish date before adding as a dependency

---

## L-004 — Stale tailnet name (`tail1a4796.ts.net`) carried forward from VPS era

**What failed:** `CONTEXT.md` was written with `tail1a4796.ts.net` — the old tailnet from the DigitalOcean VPS era. The current tailnet is `auxois-wyrm.ts.net`. Any Caddy config, WS URL, or service URL using the old name would silently fail.

**Root cause:** Early context files were written when the VPS was the primary node. The tailnet and node names changed when infrastructure was migrated on-premises, but the context file wasn't updated.

**Prevention rule:**
- Always read `CONTEXT.md` at session start — the correct tailnet and node names are documented there
- Current tailnet: `auxois-wyrm.ts.net` — use this everywhere
- Current backend node: `athena` (Rock 5T, 192.168.178.198) — not `sovikata`, not `rock-5t`
- Old VPS (`sovikata`, DigitalOcean) is **cancelled** — do not reference it

---

## L-005 — WebSocket backend cannot run on Vercel serverless functions

**What failed:** (Recorded proactively.) Considered deploying the Fastify + WS backend to Vercel alongside the SvelteKit frontend. Vercel serverless functions have a maximum execution time and do not support persistent WebSocket connections.

**Root cause:** Serverless functions are stateless and short-lived. WebSockets require a persistent, long-lived process.

**Prevention rule:**
- WS backend must run under **pm2 on `athena`** — a persistent process on a real server
- Never deploy a WebSocket server to Vercel, Netlify, or any serverless platform
- Split deploy is the correct pattern: SvelteKit → Vercel (CDN), Fastify+WS → `athena` (pm2)
- Client must implement reconnect with exponential backoff (start 1s, max 30s) — `athena` can restart

---

## L-006 — ARM64 binary incompatibility on `athena`

**What failed:** (Recorded proactively from known failure pattern.) Attempting to copy npm globals or Node.js binaries from an x86_64 machine to `athena` (aarch64) produces `Exec format error`.

**Root cause:** Native bindings are compiled per architecture. Binaries are not portable between x86_64 and aarch64.

**Prevention rule:**
- Never copy binaries to `athena` from x86 machines — always `npm install` natively on `athena`
- Verify architecture before any binary operation: `uname -m` must show `aarch64`
- apt sources must include `arch=arm64` explicitly when adding repos on `athena`

---

## L-007 — Docker containers bound to `0.0.0.0` bypass UFW via iptables

**What failed:** (Recorded proactively.) A Docker service started with `ports: "7200:7200"` (no IP binding) becomes publicly reachable even with UFW deny rules, because Docker writes its own iptables rules that bypass UFW's `INPUT` chain.

**Root cause:** Docker's iptables integration punches holes in the firewall directly, bypassing UFW.

**Prevention rule:**
- Always bind to `127.0.0.1` in Docker Compose: `ports: "127.0.0.1:7200:7200"`
- After bringing up any service: `sudo ss -lntp | grep <port>` — must show `127.0.0.1`, never `0.0.0.0`
- This is in the AGENTS.md completion checklist — run it as part of every Docker deployment

---

<!-- Add new lessons above this line using: -->
<!-- ## L-00N — Short title -->
<!-- **What failed:** ... -->
<!-- **Root cause:** ... -->
<!-- **Prevention rule:** ... -->
