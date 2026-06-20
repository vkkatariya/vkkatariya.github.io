# tasks/lessons.md — portfolio-website
> Prevention rules learned from corrections during this project.
> Format: what failed · root cause · prevention rule.
> Agents: read this at session start. Add entries after any correction.

---

## L-021 — Wrapper selectors shouldn't get pop-out hover, only inner widgets

**What failed:** The projects-page pop-out hover rollout added `:hover` to wrapper selectors `.proj-index`, `.pipeline`, `.platform-grid`, `.cs-section`. Result: hovering anywhere on a project's detail section (which spans the full content area) made the whole section lift as one giant block, instead of just the individual interactive widget. User feedback: "only following widget on projects should pop up and not whole block."

**Root cause:** Treated the user's confirmed selector list (which included wrapper names) as a literal "add hover to all of these" instruction, without checking which are wrappers vs interactive widgets. The memory list was a "needs to be considered" list, not a "give them all hover" list. Wrapper-level hover makes the page feel like one big block per project, defeating the purpose of pop-out (which is to give the *current interactive element* a tactile response).

**Prevention rule:**
- Before adding hover to any selector, classify it: **interactive widget** (card, tile, stage, button) vs **wrapper** (container that holds multiple interactive widgets). Only interactive widgets get pop-out.
- On the projects page, the wrappers are: `.proj-index` (the top 4-card row), `.pipeline` (the ML pipeline strip), `.platform-grid` (the 3 platform tiles container), `.cs-section` (each project's case-study section), `.node-diagram` (athena+atlas diagram), `.vis-wrap` (chart/visualization wrapper). Their INNER widgets are what gets hover: `.pi`, `.pcard`, `.pcard-*`, `.phase-card`, `.pipe-stage`, `.plat`, `.nd-node` + `.nd-name` + `.nd-hw`, `.bar-row`.
- General rule: when in doubt, hover the smallest interactive element inside the wrapper, not the wrapper itself.
- **Audit pass is required.** When adding hover to a page, do a full visual review at the actual rendered page (not just grep'd selector lists) — JS-generated widgets and project-specific custom widgets are easy to miss. Two widgets were missed on the first projects pass and only surfaced after the user reviewed the live page: `.nd-node` (infrastructure cards) and `.bar-row` (spending breakdown rows).

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

## L-020 — Browser automation on athena: don't use system chromium

**What failed:** `browser_navigate` failed with `Invalid ozone platform: headless`. System `/usr/bin/chromium` is broken on Rock 5T ARM64 due to a wrapper script hardcoding broken Vaapi flags.

**Root cause:** Hermes browser tool defaults to `/usr/bin/chromium` on Linux, and that binary is incompatible with this ARM64 Mali GPU setup.

**Fix:** Point Hermes to Playwright's bundled chromium via `~/.hermes/.env`:
```
AGENT_BROWSER_EXECUTABLE_PATH=/home/radxa/.cache/ms-playwright/chromium-1223/chrome-linux/chrome
AGENT_BROWSER_ARGS=--no-sandbox
```

**Prevention rule:** On athena, always set `AGENT_BROWSER_EXECUTABLE_PATH` to the Playwright chromium path after running `playwright install chromium`. Remove any old `/usr/bin/chromium` executablePath entry. The change requires a new Hermes session to take effect.

<!-- Add new lessons above this line using: -->
<!-- ## L-00N — Short title -->
<!-- **What failed:** ... -->
<!-- **Root cause:** ... -->
<!-- **Prevention rule:** ... -->

## L-016 — Synchronous DOM access for elements defined later in HTML silently kills the rest of the script

**What failed:** `#pg-roadmap`'s modal/progress-widget markup was placed after the closing `</script>` tag, but the script called `document.getElementById('modal-overlay').addEventListener(...)` synchronously at parse time — before that node existed. The uncaught TypeError halted every statement after it in that script block (function declarations stayed hoisted, masking the crash), silently breaking renderTopics/renderCareers/all observers/routing with no visible symptom unless the console was open.

**Root cause:** Non-deferred `<script>` blocks execute top-to-bottom as parsed; any `getElementById`/`querySelector` target must already exist above the `<script>` tag, or the call must be deferred to `DOMContentLoaded`.

**Prevention rule:**
- Markup referenced via `getElementById`/`querySelector` in a top-level (non-deferred) script must live ABOVE that script tag.
- After any HTML reorg near a `<script>`, headlessly load the page and check `pageerror` events — don't trust visual screenshots alone, hoisted functions can make a dead script body look fine.
- If a page "loads fine" but specific dynamic content is empty, suspect a silent JS crash before assuming CSS/animation is the cause.

---

## L-017 — Bare element-type CSS selectors inside @media blocks leak onto every element sharing that tag

**What failed:** Mobile-breakpoint rules (`nav {}`, `.nav-links {}`, `.nav-logo {}`) written for standalone `cs-roadmap.html`'s single `<nav>` were never rescoped after merging into the 3-pill topbar. At ≤860px/≤560px they matched BOTH `#shared-nav` and `#roadmap-internal-nav`, stretching both fixed-position elements between `top`+`bottom` simultaneously — a near-full-viewport dark rectangle on every page, not just roadmap.

**Root cause:** Copy-pasting CSS from a standalone single-page file into a combined multi-page file without auditing for selectors that assume "there is only one of this tag on the page."

**Prevention rule:**
- After merging standalone HTML/CSS into a combined file, grep for bare element-type selectors (`nav {`, `header {`, `button {`) inside `@media` blocks and rescope every one to an ID/class.
- Test responsive bugs at real mobile/tablet widths (390px, 820px) headlessly — desktop-only screenshots will not catch these.
- An unexplained full-screen overlay report is itself a strong signal to check `getBoundingClientRect()` on fixed-position elements before assuming z-index/animation is the cause.

---

## L-018 — Equal-specificity CSS: later source order wins even when the earlier rule is inside a matching @media block
**What failed:** After rescoping the leak to `#roadmap-internal-nav { top: auto; }` inside `@media(max-width:860px)`, the fix silently didn't apply — the base, always-active `#roadmap-internal-nav { top: 14px; }` rule (same ID specificity, but positioned LATER in the stylesheet) kept winning. A matching `@media` condition grants zero extra cascade priority over a same-specificity rule outside any media query.

**Root cause:** Assumed "more specific media condition" implies "wins the cascade" — cascade ties are resolved purely by source position, not by how conditional the rule is.

**Prevention rule:**
- When an `@media` override doesn't visibly apply, check matched rules (`element.matches(selector)` + cssText, in source order) for a same-specificity rule appearing later before reaching for `!important`.
- Prefer moving the base/unconditional rule earlier in the stylesheet over `!important` when safe; use `!important` only as a surgical, commented exception when reordering risks a larger blast radius.

---

## L-019 — Flag pre-existing, out-of-scope structural bugs explicitly instead of silently fixing or silently ignoring them

**What failed:** N/A — not a mistake, a pattern worth recording. Discovered `#pg-about` is missing a closing `</div>`, trapping `#pg-me` inside it (collapses to zero size, page unreachable) while debugging an unrelated `#pg-roadmap` modal positioning bug. Did not fix it — outside the stated scope (#pg-roadmap only).

**Prevention rule:**
- When a debugging trail surfaces a real bug outside the current task's scope, name it explicitly (element/symptom/why it's out of scope) rather than fixing it unprompted or letting it pass unmentioned.
- Before relying on any new insertion point in a large HTML file, verify it isn't accidentally nested inside an unrelated broken element — check the actual `parentElement` chain via DOM inspection, not just source-line proximity.


## L-015 — `position:fixed` inside a CSS-transformed SPA page container doesn't stick to the viewport

**What failed:** `#progress-bar { position:fixed; top:0 }` placed inside `#pg-roadmap` scrolled with page content instead of staying fixed at the top of the viewport.

**Root cause:** CSS spec: any ancestor with `transform`, `filter`, `perspective`, or `will-change: transform` becomes the containing block for `position:fixed` descendants — even if it's not `position:relative`. SPA page containers use `transform: translateX(...)` for transitions, so `fixed` children are positioned relative to the page div, not the viewport.

**Prevention rule:**
- Never place `position:fixed` elements inside any div that uses CSS `transform` (including SPA page containers).
- Move fixed UI (scroll progress bars, toasts, overlays) to be direct children of `<body>`, outside all page containers.
- In a `.page { transform: ... }` SPA: only `position:absolute/relative` is safe inside page divs.

## L-014 — Long-running coding agents must be delegated, not run in foreground terminal

**What failed:** Dispatched Claude Code for a large roadmap integration task by calling `terminal()` with `timeout=600`. The process was killed at 10 minutes mid-work, then relaunched via background `terminal()` and later killed again. Result: ~50% of Claude Code credits burned, only 20 lines changed, no deliverable, and an empty `tee` log.

**Root cause:** Coding-agent CLIs are long-lived autonomous workers, not short shell commands. The `coding-agent-clis` skill explicitly says to use `delegate_task` for these agents. Using `terminal()` killed the session on timeout. Piping through `tee` inside a shell made the log unbuffered and lost all output when SIGTERM arrived.

**Prevention rule:**
- For `claude`, `codex`, `opencode`, `agy`, `abacusai`, `agent`, `copilot`: always use `delegate_task` (toolsets `["terminal", "file"]`) unless the task is literally one shell command.
- If `delegate_task` is unavailable and a background `terminal()` is needed: redirect directly to a file (`> /tmp/agent.log 2>&1`) — no pipes, no `tee`, and always set `notify_on_complete=true`.
- Never impose a short foreground timeout on a multi-step coding task.
- Liveness check = `git diff --stat` over time + `ps -p <pid>`, not log file contents.
- When the user says "I got this" or wants to take over, ask explicitly whether to **pause** or **kill** the agent — do not assume and terminate a running credit-consuming session.
