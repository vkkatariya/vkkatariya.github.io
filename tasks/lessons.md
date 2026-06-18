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
- Current backend node: `athena` (Rock 5T) — not `sovikata`, not `rock-5t`
- Old VPS (`sovikata`, DigitalOcean) is **cancelled** — do not reference it

---

## L-005 — Context drift: project dev setup files described an old monolith architecture

**What failed:** `CONTEXT.md`, `README.md`, and `tasks/todo.md` described a monolith where the portfolio embeds a homelab dashboard (`/lab`), finance buddy (`/me/finance`), and a WebSocket backend. The actual v2 architecture is a standalone portfolio that links to separate subdomains and keeps private tools behind `/me` auth. This confused the project scope.

**Root cause:** The architecture changed during design sessions (multi-page, standalone apps, private `/me`) but the dev setup files were not updated to match. Prototype files moved forward; documentation lagged behind.

**Prevention rule:**
- When architecture decisions change, **update CONTEXT.md, README.md, and todo.md in the same session** — never let prototypes outrun docs
- Treat `CONTEXT.md` as a living contract: if a decision is made, the contract must be rewritten
- After any major design pivot, run a discrepancy check: compare dev setup files against the latest architecture reference and actual prototype files
- Keep the mental model simple and explicit: "this project is X, not Y"

---

## L-006 — Building new files from scratch wastes tokens; targeted edits are always faster

**What failed:** Asked to redesign the homepage, built `portfolio-combined.html` from scratch (1181 lines) instead of editing the existing `portfolio-v4.html`. The combined file differed from the individual pages, required re-work, and burned significant credits.

**Root cause:** Default response to "redesign X" was to write a new file. The correct default is to open the existing file and make surgical replacements.

**Prevention rule:**
- First instinct must always be `view` the existing file → `str_replace` or `python3` patch — never `create_file` on something that already exists
- If a new combined file is genuinely needed: build it by extracting sections from the originals, not by rewriting from memory
- Ask before creating any new file: "does this already exist in a form I can edit?"

---

## L-007 — Confirm which file to edit before starting — don't assume

**What failed:** User said "fix the homepage" but I edited `portfolio-combined.html` instead of `portfolio-v4.html`. User had to explicitly correct this.

**Root cause:** Ambiguous instruction ("the homepage") was interpreted as the combined file because that was the most recent output, when the user meant the standalone homepage prototype.

**Prevention rule:**
- When multiple files could be "the homepage", ask which one before touching anything: `portfolio-v4.html` vs `portfolio-combined.html` vs `index.html`
- Default to the most specific standalone file unless the user says "the combined file"
- Echo back the target file before every edit session: "Working on `portfolio-v4.html` — correct?"

---

## L-008 — Don't remove CSS classes when removing the HTML that uses them — check for other usages first

**What failed:** When removing the hero section (`<section class="hero">`), the `.hn-script` and `.hn-sans` CSS classes were nearly deleted too. Those classes are also used in the nav logo pill and the identity widget.

**Root cause:** Assumed CSS classes were only used in one place. The hero section defined `.hn-script`/`.hn-sans` but they're referenced elsewhere in the same file.

**Prevention rule:**
- Before removing any CSS class: `grep -n "hn-script\|hn-sans"` — count all usages
- Only delete a CSS class if its count drops to zero after removing the HTML
- Safe order: remove HTML → grep remaining usages → only then remove CSS if count = 0

---

## L-009 — Concatenating standalone HTML pages into one SPA breaks easily

**What failed:** The combined `portfolio-combined.html` SPA did not work in browser after stitching together `portfolio-v4.html`, `projects.html`, `about.html`, and `cs-roadmap.html`. Root causes: a stray `</nav>`, missing page-container closing `</div>`s, and an unfinished inline `<script>` that swallowed the rest of the document.

**Root cause:** Each standalone page has its own `<html>`, `<head>`, `<body>`, CSS `:root`, and scripts. Concatenating them without stripping wrappers and validating DOM boundaries produces invalid HTML. One unclosed script block breaks *all* JavaScript in the file.

**Prevention rule:**
- Strip `<html/>/<head/>/<body/>/<!DOCTYPE>` wrappers from each imported section before assembly.
- Validate DOM tree with a real HTML parser or at least count opening/closing tags for each page container.
- Run the file in a browser immediately after assembly; do not assume concatenation is safe.
- Move all inline scripts into one shared bottom `<script>` block with clean boundaries.

---

## L-010 — Imported page CSS contains global rules that conflict with shared UI

**What failed:** After combining pages, the shared 3-pill topbar styling broke on some pages because `projects.html` and `about.html` defined their own `nav`, `.nav-links`, `.nav-logo`, and `body` rules. The font stack also flipped depending on which page CSS loaded last.

**Root cause:** Standalone pages are designed to be standalone — they redefine global selectors. When merged into an SPA, those global rules fight with the shared shell.

**Prevention rule:**
- Before merging page CSS, strip or rename global `nav`, `.nav-logo`, `.nav-links`, `body`, `:root`, and `html` rules.
- Scope remaining page-specific typography/layout overrides under the page container ID, e.g. `#pg-projects`, `#pg-about`, `#pg-roadmap`.
- Keep exactly one `:root`, one `*`, one `html`, and one `body` rule in the combined file.

---

---

## L-011 — Roadmap internal nav inherits shared topbar `.nav-links` absolute positioning

**What failed:** After merging cs-roadmap into portfolio-combined.html, the roadmap internal nav stretched full-width or misaligned because global `.nav-links { position: absolute; left: 50%; transform: translateX(-50%) }` from the 3-pill shared topbar also applied to `#pg-roadmap .nav-links`.

**Root cause:** Standalone cs-roadmap.html uses `.nav-links` as a simple flex row inside a glass pill nav. The combined SPA reuses the same class names for both the shared topbar center pill and the roadmap internal nav. Page-scoped CSS added glass styling but did not reset position/transform/background from the shared rules.

**Prevention rule:**
- When merging pages into an SPA, grep for shared class names (`.nav-links`, `.nav-logo`) and explicitly reset all inherited properties under the page container ID.
- For internal page navs that must differ from the shell nav, prefer scoping: `#pg-roadmap .nav-links { position: static; transform: none; background: none; ... }`.
- IntersectionObserver for section highlighting must be scoped to the page's nav (`#pg-roadmap .nav-links a`), not global `.nav-links a`.

## L-012 — SPA page transitions hide content because entrance animations were observed while pages were `display:none`

**What failed:** In `portfolio-combined.html`, the roadmap "11 CORE TOPICS", "CAREER PATHS", and resources cards appeared empty after clicking the roadmap page. The cards existed in the DOM and the render functions ran, but all cards had `opacity:0` from `[data-anim]` CSS. The `IntersectionObserver` was set up once at initial page load when the roadmap page was hidden (`display:none`), so it never fired for those elements.

**Root cause:** Standalone pages rely on `IntersectionObserver` to trigger entrance animations. In the SPA, most pages start hidden. Observing animated elements before their parent page is visible means the observer calculates intersections against a hidden/zero-size container and never calls back.

**Prevention rule:**
- For SPA page containers, re-run `observeAnimElements()` (and any other intersection-based setup) inside the page-switch function *after* the target page becomes `display:block`.
- Before re-observing, `unobserve()` then `observe()` each element so the browser recalculates intersections against the now-visible layout.
- Never assume a one-time observer setup at `DOMContentLoaded` works for content inside initially-hidden SPA pages.

## L-013 — A "slide-over" topbar swap reads as two different sites; morph from the shared pill instead

**What failed:** The roadmap internal nav was implemented by sliding the entire shared 3-pill topbar off-screen left and sliding a separate roadmap pill in from the side. It felt like navigating to a different site, and the shared logo/controls disappeared.

**Root cause:** Hiding the whole shell nav (`#shared-nav.nav-hidden { transform: translateX(-100%) }`) destroys visual continuity. A page-local sub-nav should feel like it grows out of the existing shell, not replace it.

**Prevention rule:**
- For a page-local sub-nav inside a shared SPA shell, keep the shell's outer pills (logo, controls) fixed and visible at all times.
- Anchor the sub-nav to the exact slot of the element it replaces (same `top/left:50%/translateX(-50%)`), and morph with `opacity` + `transform: scale()` from a center origin so it reads as "popping out" of that pill.
- Scope the hide behavior to only the swapped child (`#shared-nav.nav-hidden .nav-links`), never the whole nav container.
- Match the sub-nav's glass fill/shadow to the shell pills so it looks like the same component expanding, not a foreign bar.

<!-- Add new lessons above this line using: -->
<!-- ## L-00N — Short title -->
<!-- **What failed:** ... -->
<!-- **Root cause:** ... -->
<!-- **Prevention rule:** ... -->
