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
- On the projects page, the wrappers are: `.proj-index` (the top 4-card row), `.pipeline` (the ML pipeline strip), `.platform-grid` (the 3 platform tiles container), `.cs-section` (each project's case-study section), `.node-diagram` (athena+atlas diagram). Their INNER widgets are what gets hover: `.pi`, `.pcard`, `.pcard-*`, `.phase-card`, `.pipe-stage`, `.plat`, `.nd-node` + `.nd-name` + `.nd-hw`.
- General rule: when in doubt, hover the smallest interactive element inside the wrapper, not the wrapper itself.
- **Audit pass is required.** When adding hover to a page, do a full visual review at the actual rendered page (not just grep'd selector lists) — JS-generated widgets and project-specific custom widgets are easy to miss. Two widgets were missed on the first projects pass and only surfaced after the user reviewed the live page: `.nd-node` (infrastructure cards) and `.vis-wrap:has(> .bar-chart)` (spending breakdown chart card).
- **Refinement — sometimes the wrapper IS the widget.** L-021's first version said "wrappers don't get hover" but this was too rigid. Distinguish two cases:
  - **Wrapper with multiple distinct interactive widgets** (e.g. `.pipeline` containing 6 `.pipe-stage` cells, `.platform-grid` containing 3 `.plat` tiles) → hover the INNER widgets, NOT the wrapper. Hovering the wrapper lifts the whole group, which feels like a single mega-block.
  - **Wrapper containing one cohesive visual element** (e.g. `.vis-wrap` containing a single `.bar-chart` of related rows) → hover the WHOLE wrapper, NOT the inner data rows. Hovering individual rows (e.g. `.bar-row`) makes the chart feel fragmented — you want the whole chart card to lift as one unit.
  - The rule of thumb: ask "is this element ONE widget (a card, a chart, a node) or MANY widgets (a row of cells, a grid of tiles)?" One = hover the wrapper. Many = hover the inner widgets.
  - When using `:has()` to disambiguate, name the specific child that determines the type (e.g. `.vis-wrap:has(> .bar-chart)` targets only the chart wrapper, not the other 3 vis-wraps on the page that contain different content).

---

## L-022 — Invisible flex wrappers vs visible cards: a different wrapper-vs-widget failure mode

**What failed:** The about-page pop-out hover rollout added `:hover` to `.photo-block` (the outer wrapper). Result: hovering the photo widget showed **two stacked shadows** — the invisible `.photo-block` wrapper lifted AND the visible `.photo-frame` card inside it ALSO lifted from the global rule. User feedback: "it has two layers of pop out."

**Root cause — different from L-021:**
- L-021 was about **visible wrappers** containing many inner widgets (e.g. `.pipeline` with 6 cells) — fix was "hover inner, not wrapper."
- L-022 was about an **invisible flex wrapper** that had no visual styling of its own (`display:flex; gap:14px; align-items:center`) but contained a separate visually-styled inner element. The wrapper itself was NOT a widget — it was just a layout container. The actual widget was the inner `.photo-frame`. Adding hover to the wrapper made the empty layout space lift, which visually manifested as a "second shadow" because the inner card was also lifting.

**Prevention rule:**
- **Inspect the actual CSS of a candidate wrapper before adding hover.** Open the file, find the selector, read its full rule block. If the rule only contains layout properties (`display`, `flex-direction`, `gap`, `align-items`, `justify-content`) and no visual properties (`background`, `border`, `border-radius`, `box-shadow`), it is NOT a widget — it is a layout wrapper. Don't add hover to it.
- **In the markup, look for nesting patterns like `outer (layout) > inner (visual)`.** The visual inner element is the widget. The layout outer is invisible space.
- **When in doubt, use the browser devtools to hover the element and observe the visual change.** If the element doesn't visibly change (no border, no background, no shadow of its own), it shouldn't be in the hover list — even if its child elements do change.
- **Distinguish from L-021:** L-021's wrappers DID have visual styling (background, border, padding) but contained multiple distinct widgets. L-022's wrapper had NO visual styling of its own — it was layout-only. The decision tree:
  - Wrapper has visual styling AND contains one cohesive visual element → hover wrapper (L-021 second case)
  - Wrapper has visual styling AND contains multiple distinct widgets → hover inner widgets (L-021 first case)
  - Wrapper has NO visual styling (layout-only) → NEVER hover it, regardless of contents (L-022)

**Specific to portfolio-website:** `.photo-block` is layout-only (`display:flex; flex-direction:column; align-items:center; gap:14px`). The actual widget is `.photo-frame` (has `width:170px; height:200px; border-radius:20px; background:var(--bg2); border:1px solid var(--w06)`). Always hover `.photo-frame`, never `.photo-block`.

---

## L-023 — CSS specificity tie + cascade order can silently kill a transition declaration

**What failed:** The roadmap-page pop-out hover rollout added a `#pg-roadmap .tl-header { transition: transform .18s ease, ... }` rule (specificity 0,1,1,0). The page ALREADY had an existing `#pg-roadmap .tl-header { transition: border-color .2s, background .2s; ... }` rule at a later line in the stylesheet with the SAME specificity. The existing transition won via cascade order. Result: `.tl-header` lifted on hover (because the `:hover` rule was a combined selector and won on specificity), but the `transform` property had NO transition → instant snap on hover, visually jarring.

**Root cause:** CSS specificity tie. When two rules have identical specificity and both declare `transition`, the LATER rule wins (cascade order). This is independent of which rule is "newer" in git terms — only source file position matters.

**Why the agent missed it:**
- `#pg-roadmap .tl-header` (new) specificity = `#pg-roadmap .tl-header` (existing) specificity → tie
- Same specificity tie also existed for `.resource-item`, but only the `.resource-item` was scoped (`#pg-roadmap .resource-item` vs `.resource-item`) — different specificity → no tie → new rule wins. This asymmetry masked the bug from a single-sample visual check.
- The new `:hover` rule used a combined selector `#pg-roadmap .tl-header:hover, #pg-roadmap .resource-item:hover`. The `:hover` part has same specificity on both, so the lift worked. But the `transition` declaration (no `:hover`) was independent and lost on `.tl-header`.

**Detection method:** Open DevTools, inspect the hovered element, check the **computed** `transition` value. If it doesn't include `transform` for a widget that has `transform: translateY(...)` on hover, the transition declaration is being overridden.

**Prevention rule:**
- **Before adding a `transition` declaration for an existing selector, grep for the same selector in the stylesheet.** If multiple definitions exist at the same specificity, the new one will likely be overridden.
- **Use `getComputedStyle(el).transitionProperty`** in browser DevTools to confirm `transform` is included AFTER your edit. If only `border-color` shows up, your rule is being silently overridden.
- **Better than adding a separate rule: MERGE the new transition properties into the existing declaration.** For `.tl-header`, the right fix is to edit the existing line 2119 declaration to `transition: transform .18s ease, box-shadow .18s ease, border-color .2s, background .2s;` — appending the new properties to the existing rule instead of declaring a parallel rule.
- **Alternative: bump specificity with a more specific selector** (e.g., `#pg-roadmap .tl-item .tl-header`). But this fragments the stylesheet — the merge approach is cleaner.

**Specific to portfolio-website:** The `#pg-roadmap .tl-header` rule at line 2115 has its own `transition` declaration. Any future pop-out/transition addition for `.tl-header` must either (a) merge into that existing declaration, or (b) use a more specific selector. Same applies to any other page-scope selector that has both a base rule and a custom transition.

**General lesson:** When adding ANY new CSS property to an existing selector, check whether the selector is already declared elsewhere in the stylesheet. If yes, decide: merge into existing declaration, or use a more specific selector.

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

## L-024 — Duplicate CSS selectors with the same specificity: cascade order wins, later rule overrides the new one

**What failed:** In `feat/ndot-topbar-rollout`, applied NDOT to `.nav-lang` at line 236 (topbar). Browser `getComputedStyle` still returned `JetBrains Mono`. Reason: a second `.nav-lang` rule existed at line 295 with the same specificity (0,1,0). Cascade order picked the later rule, which was the old JetBrains Mono one.

**Root cause:** CSS cascade tie-breaker: when two rules have identical specificity, source-order wins (later rule overrides earlier). This is independent of which one is "newer" in git — only file position matters. The agent's `patch` call only updated the first `.nav-lang` occurrence; the duplicate definition at a later line silently won the cascade.

**Detection method:** After any font-family/font change, run `getComputedStyle` on a real element and check the resolved value, not just grep for the change. If `fontFamily` doesn't match the expected value, there's a duplicate or higher-specificity rule overriding it.

**Prevention rule:**
- Before adding or modifying a font-family/font-size/transition on any selector, grep the file for **all** definitions of that selector and check the line numbers.
- If duplicates exist, either: (a) merge them into one canonical rule, (b) update both, or (c) delete the dead one (if no markup uses it).
- After applying the change, **always verify with `getComputedStyle`** in the browser, not just with grep.
- Same rule applies to any CSS property change, not just fonts — color, transition, transform, anything that can be silently overridden by a later rule with equal specificity.

## L-025 — Parallel-dispatch branch contamination via failed `git checkout`

**Symptom:** Two coding agents dispatched in parallel via `delegate_task(tasks=[...])`. Agent A was told to work on `feat/X` and Agent B on `feat/Y`. Both completed, both reported success, both committed. But Agent B's commits landed on `feat/X` instead of `feat/Y`, and `feat/Y` stayed empty.

**Root cause:** Agent B's first shell command was `git checkout feat/Y` per the kickoff contract. That checkout failed silently — likely because the parent Hermes session (after dispatching both agents in parallel) was still on `feat/X` and the agent's session inherited that working directory state. When `git checkout` failed, the agent fell through to the current branch and committed there without noticing.

**Prevention rule:**
- The kickoff's first step must include a branch **assertion**, not just a checkout. Pattern:
  ```bash
  git checkout <branch> || exit 1
  current=$(git rev-parse --abbrev-ref HEAD)
  [ "$current" = "<branch>" ] || { echo "BRANCH MISMATCH: expected <branch>, got $current"; exit 1; }
  ```
  This makes branch mismatch fatal rather than silent.
- After every parallel-dispatch batch, always run `git branch --contains <sha>` on the agent's reported commit SHA — not just `git log --oneline`. The latter shows the commit exists, the former shows which branch it's actually on.
- If contamination is detected: rename the receiving branch to reflect actual content (e.g. `feat/X` → `feat/X-and-Y`), delete the empty source branch, then merge. Don't discard correctly-completed work just because it landed on the wrong branch.

**Related rule:** "Committed and pushed" is NOT "work is visible". After merging, the user's local dev server (`python3 -m http.server`) serves from the working tree, which is typically on `dev`. If the agents only push to a feature branch but you don't merge to `dev`, the rendered page still shows the pre-change state. The user reads this as "your changes are gone". **Always `git checkout dev && git merge --no-ff feat/X && git push origin dev` after a successful dispatch, then verify live.**

## L-026 — Exhaustive selector audit before declaring a font-stack (or any pattern) rollout complete

**Symptom:** A CSS/font rollout branch swapped `font-family` on a partial list of selectors (e.g. `.pcard-title`, `.topic-name`, `.career-title`, `.cs-title`, `.filter-btn`). Branch merged to dev, agent reported success, file diff was clean. But after merge, the user pointed at a widget that visually still used the old font — the featured project widget on the homepage.

**Root cause:** The kickoff's selector list was incomplete. The featured project widget uses `.proj-title`, not `.pcard-title` (different class name, same intent). The kickoff author did a partial audit and missed it. The agent faithfully executed the partial list, branch merged clean, but the rollout was visually incomplete across the page.

**Prevention rule:**
- **Always run a full selector audit before AND after any pattern rollout** (font-family, color tokens, hover effects, etc.). Pattern:
  ```bash
  # Find every selector whose name suggests the same semantic role
  grep -oE '\.[a-z][-a-z0-9_]*title[a-z0-9_-]*\s*\{' file.html | sort -u
  # For each, check current state vs target state
  for sel in $(grep -oE '\.[a-z][-a-z0-9_]*title[a-z0-9_-]*' file.html | sort -u); do
    # get computed font-family on a sample element
  done
  ```
- **If the user points at a widget using the OLD style after a rollout, that widget IS in scope** — expand the branch (or follow up with another commit) before declaring done. Don't dismiss the user's report as a one-off.
- **Use `getComputedStyle` on the rendered page**, not grep alone, to verify visual state. The agent's diff is one signal; the rendered output is the source of truth.
- This rule is the same pattern as L-021 (widget vs wrapper audit before adding hover) and L-024 (duplicate selector audit before font changes) — same shape, different selector dimension. Bundle these as "pre-rollout audit checklist": (1) widget vs wrapper, (2) duplicate definitions, (3) sibling selectors with same intent.


## L-027 — When dispatching an agent for a small CSS/HTML fix, inspect the existing CSS rule that the fix will interact with BEFORE writing the kickoff

**Symptom:** Tonight's about+contact widgets refactor took 4 agent dispatch cycles (v1→v2→v3→v4) because the kickoff author (me) didn't inspect the actual CSS rules that constrained the widget. The agents faithfully followed my kickoff specs but the visual result was wrong each time because the kickoff didn't account for:
- `.w { overflow: hidden }` clipping content in constrained grid cells
- `.grid { grid-auto-rows: 168px }` forcing fixed-height rows
- `.about-contact { padding: 20px; gap: 14px }` providing too much breathing room for the new widget context

**Root cause:** I trusted the kickoff spec to be sufficient. The kickoff said "make ABOUT wide + CONTACT narrow" but didn't specify which CSS rules to override or how the existing `.about-contact` would behave in a 336px constrained cell.

**Prevention rule:**
- Before dispatching an agent for any CSS/HTML fix, **read the CSS rules** that govern the affected element. Use this checklist:
  ```bash
  # 1. Find the element's base class
  grep -nE '\.widget-class\s*\{' file.html
  # 2. Find the parent's grid/positioning constraints
  grep -nE '\.parent-grid\s*\{' file.html
  # 3. Check for overflow:hidden, fixed heights, padding that might constrain
  grep -nE 'overflow|grid-auto-rows|max-height' file.html
  ```
- If the kickoff says "make X look like the original bottom-section card", the agent needs to know:
  - The original was inside which CSS context (e.g. `1fr 260px` grid)
  - The original's padding/gap/font-size
  - Any parent constraints (e.g. `overflow: hidden`)
- **If the fix is <5 line edits and the constraint is clear after inspection, do it directly.** Don't dispatch an agent for "tweak these 4 inline styles".
- An agent dispatch for a small fix should be a LAST RESORT when: (a) the work spans multiple files, (b) verification requires browser automation, (c) the change is too complex for inline editing.

**Counter-example from tonight:** The widget surface fix (v3) was the right call to dispatch — it required browser verification + careful class manipulation. But the widget size fix (v5) should have been a direct edit once I saw the actual `.w { overflow: hidden }` and `.grid { grid-auto-rows: 168px }` constraints.

**Related rules:** L-024 (selector audit before rollout), L-026 (exhaustive audit before declaring done), L-021 (widget vs wrapper audit).


## L-028 — Before dispatching an agent for a "fix X" task, audit your own kickoff prompt against the actual source files for completeness

**Symptom:** Wrote `tasks/kickoff-add-4-projects.md` (16 KB, 266 lines) to add 4 projects to the /projects page. Felt confident — it had source-of-truth content for all 4 projects pulled from project READMEs and CONTEXT.md files. But when I self-audited the kickoff against the actual files, I found 6 gaps that would have made the agent guess or invent:

1. **Missing GitHub URLs** for the 4 new projects — agent would have to invent or skip
2. **Missing cs-section status badges** — agent would have to invent status text
3. **No URL verification protocol** — agent could paste a 404 link
4. **No guidance on proj-nav style** — agent would have to decide between existing (back-to-top only) vs new (prev/next)
5. **Speculative content from prior knowledge** — I had described OpenClaw as hosting "Claude Code, Codex, Gemini CLI, agy, abacus, opencode, and gh-copilot" from my own memory of athena, NOT from CLAUDE.md. Agent might have preserved my hallucination OR used the strict source-of-truth text, with no way to know which I meant.
6. **Step 4 ambiguous** — said "(optional but recommended)" which is dispatch-bait; agents skip optional steps.

**Root cause:** I trusted that "I read the source files and wrote the kickoff" was enough. But "reading source files" is not the same as "checking the kickoff prompt against them." Writing a kickoff is an act of distillation — content gets compressed, formatted, and structurally rearranged in ways that introduce gaps.

**Prevention rule:**
- **Always self-audit a kickoff before declaring it "ready to dispatch."** Checklist:
  1. For each fact/claim in the kickoff, can you point to the line in the source file? If not, mark it as "editorial" or remove it.
  2. Are there fields that the agent will need but aren't specified? (URLs, status text, badge colors, navigation style, anchor IDs, tag counts)
  3. Does the kickoff say anything "optional"? If yes, either make it required or remove it.
  4. Run through the agent's likely questions: "What github URL do I use?", "What status text?", "What color is the badge?", "Should I add prev/next links?" — does the kickoff answer each one?
- **Audit duration scales with kickoff size.** A 5 KB kickoff needs 5 min audit. A 17 KB kickoff (like tonight's) needs 15 min audit.
- **Don't dispatch after a single read-through.** Read it once to write it, read it once to audit it. Different mental modes.

**Counter-example from tonight:** First version of `tasks/kickoff-add-4-projects.md` had:
- OpenClaw description with "hosts Claude Code, Codex, Gemini CLI, agy, abacus, opencode, and gh-copilot" (my prior knowledge, not CLAUDE.md)
- No GitHub URLs anywhere
- No cs-section status badge text (agent would have to invent)
- Step 4 said "Add IDs to existing cs-section proj-nav buttons (optional but recommended)" — vague, optional, and might have been ignored

After the audit pass, all 6 gaps were fixed. The kickoff is now 17.8 KB and dispatch-ready.

**Related rules:** L-027 (inspect CSS rules before kickoff for CSS/HTML fixes), L-022 (layout-only wrappers never get hover), L-026 (exhaustive audit before declaring done).

## L-029 — When resolving merge conflicts in HTML, classify CSS vs HTML blocks separately — agent-added structure inside CSS blocks (like .wlbl-row inside .cs-skills) can be silently lost if you take the "older" side for the whole block.

**Date:** 2026-06-25
**Incident:** During merge of feat/polish-task3 → dev, took feat/polish-task3's HTML for cs-skills conflicts because it had "newer" content (renamed titles, removed per-section proj-navs). But claude-code had ALSO added a `<div class="wlbl-row">` header INSIDE every .cs-skills block on feat/stack-bars-widget-size, and feat/polish-task3 (the older branch at the time) didn't have it. Result: all 8 cs-skills lost their wlbl-row header.

**Lesson:** When merging HTML conflicts:
1. Classify each conflict block (CSS vs HTML) and resolve separately
2. Within HTML blocks, look at the ACTUAL conflict scope — was the change global (rename, remove) or local (add header inside)?
3. For "add header inside X" type changes, the agent's branch (whichever one added it) is correct, even if the OTHER branch is "newer" by commit date
4. Always run a post-merge diff against the original branch to verify no agent work was silently dropped

**Fix applied:** Restored 8 wlbl-row headers via Python script that inserts the SVG+label markup INSIDE every .cs-skills block. Verified post-merge with grep that wlbl-row count = 19 (8 cs-skills + 11 elsewhere = matches original).

---

## L-041 — When user gives scoped in-place edits in chat, edit directly. Don't write a kickoff unless scope spans multiple files / requires research.

**Date:** 2026-06-25
**Incident:** User asked for 6 small homepage edits (add DevOps to chip, change Dieburg → Darmstadt x6, move STACK widget, etc.). The existing `feat/content-cleanup` branch was already in flight with a kickoff for 3 different fixes. The natural instinct was to either (a) wait and write a new kickoff, or (b) reuse the existing kickoff. Both are wrong — these are scoped in-place edits that need ~10 minutes of `patch` calls, not a multi-fix kickoff.

**Lesson:**
- If user gives a clear scoped change in chat ("change this text", "move this widget", "remove this block"), edit directly with `patch` calls on the active branch.
- Don't write a kickoff unless: (a) scope spans multiple files, (b) requires research/audit to scope, (c) user explicitly asks for a kickoff, or (d) agent is already in flight and you need to interrupt with new instructions.
- The kickoff from earlier sessions can stay on disk as documentation; just don't dispatch it for new scoped edits.
- Time spent on kickoff for 5-line edits = wasted user time. The 4-dispatch cycle for "1-line fix" is a known trust-destroying pattern (L-031).

**Fix applied:** Did all 6 edits with 6 `patch` calls on `feat/content-cleanup`. Verified with browser + grep. Committed as `609beb4`. Total time: ~8 minutes including browser verification.

**Related rules:** L-031 (inspect CSS before kickoff for visual fixes), L-032 (write kickoff, don't auto-dispatch), L-035 (never kill agents user dispatched).

---

## L-042 — Always re-read the actual branch state before committing — Hermes once committed to the wrong branch (where an agent was actively working), causing a recovery dance.

**Date:** 2026-06-25
**Incident:** While doing the homepage content cleanup v2 (6 edits), the parent shell was sitting on `feat/widget-svg-icons-all-pages` (where agy was still dispatching SVG icons). Without re-checking `git branch --show-current`, Hermes committed `609beb4` to the SVG branch instead of `feat/content-cleanup`. The branch was then force-pushed incorrectly (creating a remote `feat/content-cleanup` from the SVG branch tip). User saw the wrong commit and asked what happened; recovery took ~6 git operations.

**Lesson:**
- Before every `git commit`, run `git branch --show-current` and confirm it matches the target branch.
- If wrong branch: (1) reset wrong branch to its previous tip (`git reset --hard <previous-sha>`), (2) checkout target branch, (3) cherry-pick or replay the commit there, (4) force-push target branch with `--force-with-lease`, (5) confirm remote state with `git ls-remote`.
- `--force-with-lease` not `--force` — the former checks that the remote hasn't moved since you last fetched, so you don't accidentally clobber someone else's push.
- Memory pattern: L-037 (run `git branch --show-current` before every commit) was already documented but wasn't being applied because the parent shell's branch was set by the previous `git checkout` (set to `feat/widget-svg-icons-all-pages` from earlier branch creation). The session's expected branch was `feat/content-cleanup` (per kickoff title) but the parent shell state didn't match.

**Fix applied:** Used `git reset --hard caff7bc` to undo the wrong commit on the SVG branch (agy was finished by then, confirmed by `ps -ef`). Cherry-picked `609beb4` onto `feat/content-cleanup`. Force-pushed with `--force-with-lease`. Verified remote state with `git ls-remote origin feat/content-cleanup`. Confirmed three branches in correct state (dev=cfd098a, feat/content-cleanup=609beb4, feat/widget-svg-icons-all-pages=caff7bc).

**Related rules:** L-037 (run `git branch --show-current` before every commit), L-028 (never `git reset --hard` without checking `git log origin/<branch>` first).

