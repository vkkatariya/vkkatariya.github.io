# tasks/lessons.md — portfolio-website
> Prevention rules learned from corrections during this project.
> Format: what failed · root cause · prevention rule.
> **Order: NEWEST at top, oldest at bottom** (L-060 first, L-001 last).
> Agents: read this at session start. Add new entries at the TOP with the next number.

---

## L-063 — CSS Grid items have `min-width: auto` by default; always set `min-width: 0` on mobile grid children

**What failed:** On the homepage mobile grid (`repeat(2, 1fr)`), the right-column widgets (orlon-bot, homelab) were clipping beyond the right edge of the screen. `body { overflow-x: hidden }` was clipping the overflow rather than preventing it.

**Root cause:** CSS Grid items default to `min-width: auto`, which allows them to expand to their content's intrinsic minimum width. On a `1fr` column, if a child has content wider than `1fr`, the item stays wide and forces horizontal scroll (clipped by body overflow).

**Prevention rule:**
- On every mobile grid layout, add `min-width: 0` to all direct grid children: `.grid > * { min-width: 0 }`
- This is required for `1fr` to behave as a true upper bound, not a suggestion
- Applies equally to flexbox children that may overflow: `flex: 1; min-width: 0`
- Also add `overflow-x: hidden` on the grid container itself as a second line of defense
- `body { overflow-x: hidden }` alone is insufficient — it clips content but doesn't fix the layout

**Related rules:** L-049 (DOM coordinate audit before grid changes), L-050 (prefer auto-placement over explicit grid lines).

---

## L-062 — Base (non-media-query) CSS silently overrides mobile media query rules for the same property

**What failed:** Added `width: calc(100% - 32px)` to `#roadmap-internal-nav` inside `@media (max-width: 560px)`. The RESOURCES tab still clipped on mobile. The base CSS `#roadmap-internal-nav { max-width: calc(100% - 40px) }` (outside any media query) was never inside the media query, so it applied at all viewport sizes including mobile, constraining the bar width regardless of the fix.

**Root cause:** When adding a mobile override for a property, `max-width`, `min-width`, and `width` interact — a mobile `width: X` fix is silently capped by a base `max-width: Y` if Y < X. The base rule applies at all sizes and can override the mobile-specific rule even though both are technically "valid".

**Prevention rule:**
- When adding a mobile override for a width/size property, **grep the file for all selectors that also set `max-width`, `min-width`, or `width` on the same element** — any of those rules at higher or equal specificity outside the media query will constrain your fix
- The fix is to add `max-width: none` (or `min-width: 0`) alongside your mobile override to explicitly cancel the base constraint
- Before writing a mobile override, check: does the base CSS set any related dimension that could cap the override?

**Related rules:** L-023 (check duplicate selectors before editing CSS), L-024 (later source-order rule wins).

---

## L-061 — Font + design feedback is more reliable after public deploy than during dev preview

**What failed:** Spent 4 NDOT rollout branches (feat/vendor-ndot-font → feat/ndot-display-accent → feat/ndot-topbar-rollout → feat/ndot-widget-titles → feat/ndot-proj-title + redo) perfecting the NothingOS dot-matrix aesthetic. Multiple agents, multiple kicks, selector audit passes, font-size tuning, redo loops. User accepted each branch during dev. **Then on 2026-06-27, after the site went live on `vishal-katariya.com`, user said the dot-matrix font doesn't suit — remove it.**

**Root cause:** Dev preview ≠ deployed reality. The dot-matrix font is a distinctive design choice that reads differently when you can compare it side-by-side with the rest of the design system on a real domain vs seeing it incrementally as you build. During dev, each small change feels intentional and on-brand. After deploy, the cumulative effect becomes obvious — too busy, too noisy, fights the body text.

**Prevention rule:**
- For distinctive/aesthetic font choices (anything other than system sans/serif defaults), flag in the kickoff: *"this needs user review after deploy — expect potential swap"*
- Don't burn more than 2-3 branches perfecting an aesthetic font choice. After 3 branches, it's probably wrong for the project even if user hasn't said so yet
- The Phase 1 SvelteKit cutover is also a good moment to revisit font choices — clean slate, easy to swap
- Default to safe fonts (Space Grotesk / Inter / system-ui) for accent roles when the design language is otherwise distinctive — accent typography should amplify, not introduce noise
- When removing a font like NDOT, the `--font-ndot` variable trick works perfectly: keep the variable name, repoint its value, all 29 cascading selectors pick up the new font with zero additional edits

**Related rules:** L-026 (selector audit), L-049 (DOM coordinate audit), L-052 (audit existing patterns before building).

---

## L-060 — Vercel `framework: null` doesn't apply rewrites; `framework: "static"` requires build output

**What failed:** Tried to add a catch-all rewrite (`/(.*) → /prototypes/portfolio-combined.html`) so `/projects`, `/about`, `/roadmap` would serve the SPA. Tested two configurations:

1. `framework: null` + `rewrites`: deploy succeeds, but **rewrites don't apply** — `/projects` returns 404
2. `framework: "static"` + `rewrites`: **build fails** with "No Output Directory named 'public' found" even with `outputDirectory: "."` set

**Root cause:** `framework: null` skips Vercel's routing config entirely (treats project as bare static files only). `framework: "static"` triggers Vercel's static-site preset which expects a build step producing files in `public/` — incompatible with our `outputDirectory: "."` setup.

**Prevention rule:**
- **For pure static HTML projects on Hobby plan**: use `framework: null` + `outputDirectory: "."`. Accept that `/projects` etc. won't work; visitors must use `/prototypes/portfolio-combined` (with cleanUrls) or be redirected from `/` via `index.html`.
- **For projects that need rewrites**: upgrade to Pro plan OR move HTML files to repo root (rename `prototypes/portfolio-combined.html` → `index.html`) OR use a different framework preset like Next.js static export.
- **Don't waste time debugging Vercel routing** for static sites on Hobby plan — the limitation is by design.

**Related rules:** L-057 (Vercel custom domain rewrites), L-059 (package.json build script).

---

## L-059 — package.json MUST have a `build` script even for static HTML sites with no build step

**What failed:** Vercel agent created PR #4 (Speed Insights) with a `package.json` containing only a `test` script. When I tried to deploy via `vercel deploy --prod --yes`, the CLI ran `npm run build` (default Vercel behavior) which failed with "Missing script: build". Production deployment broken because of a missing one-line script.

**Root cause:** Vercel's deploy infrastructure assumes every project with a `package.json` has a build step. The CLI runs `npm run build` (or equivalent) by default. For static HTML sites, you still need a no-op build script that Vercel can run successfully.

**Prevention rule:**
- **ALWAYS include a `build` script** in `package.json`, even if it's just an echo:
  ```json
  "scripts": {
    "build": "echo 'No build step required for HTML prototype'"
  }
  ```
- **When reviewing agent PRs**, check `package.json` for a `build` script. If it's missing or only has `test`/`start`, that's a deploy blocker.
- **Also include `outputDirectory`** in `vercel.json` when using `framework: null` — Vercel defaults to looking for `public/` which doesn't exist.

**Related rules:** L-057 (Vercel rewrites), L-040 (browser-verify), L-060 (framework null vs static).

---

## L-058 — CNAME on `vkkatariya.github.io` adds a hidden redirect layer that bypasses all other deploy targets

**What failed:** After deploying to GitHub Pages, `https://vkkatariya.github.io/` was returning 404 (or serving stale content). I assumed it was a Pages issue. Spent time debugging Pages build artifacts.

**Root cause:** The repo had a `CNAME` file at the root containing `vishal-katariya.com`. GitHub Pages honors CNAME by issuing a 301 redirect from `vkkatariya.github.io` → `<CNAME>`. That domain was on Vercel (which had a broken routing config), so the chain was: `vkkatariya.github.io` → 301 → `vishal-katariya.com` (Vercel, with broken rewrites) → 404. Pages itself was working perfectly — I was chasing the wrong layer.

**Prevention rule:**
- **When debugging "site not loading" on `username.github.io`, check for a CNAME file FIRST.** It silently overrides everything else.
- `git ls-files | grep -i cname` (or check the repo root via GitHub UI) before investigating Pages build logs.
- If the CNAME target is dead/broken, **delete the CNAME file** to fall back to direct `username.github.io` serving. Don't try to fix the dead target — the CNAME is a problem in itself if you don't actively want the custom domain.
- When using both GitHub Pages AND another deploy target (Vercel/Netlify), the `username.github.io` URL is a useful "fallback" — but only if no CNAME redirects it away. Treat CNAME as "I own a custom domain" intent, not "set up Pages".

**Related rules:** L-055 (check branch before commit), L-040 (browser-verify, not just file inspection).

---

## L-057 — Vercel custom domain rewrites may serve 404 on subpaths even when the deployment URL works

**What failed:** After deploying to Vercel with `vercel.json` rewrites, `https://portfolio-website-bbwmnd8pz.vercel.app/projects` returned 200 (rewrite applied correctly), but `https://vishal-katariya.com/projects` returned 404 (rewrite NOT applied). Same edge region, same deployment, different result.

**Root cause:** Unknown — possibly Vercel edge cache from a prior deployment, possibly domain-level config (separate from deployment-level rewrites), possibly the auto-deploy trigger that fired right after I removed the alias. Tried: re-adding alias, force-redeploy, removing alias then re-adding. None fixed it consistently.

**Prevention rule:**
- **When you set up a Vercel custom domain, verify ALL subpaths immediately, not just the root.** `curl https://yourdomain.com/somepath` should return 200, not 404.
- If only the Vercel URL works but the custom domain doesn't, the custom domain may be serving a stale deployment. Time-box this debugging — don't burn hours fighting Vercel's edge.
- **For static HTML sites, GitHub Pages is often simpler than Vercel.** No edge routing mystery, no custom domain DNS dance, no deploy hook maintenance. Consider Pages-first unless you need SSR or Vercel-specific features.
- If you do need Vercel + custom domain, test the custom domain subpaths in CI before declaring deploy success. Add a smoke test to your GitHub Actions that hits `/`, `/projects`, `/about` and fails the workflow if any returns non-200.

**Related rules:** L-058 (CNAME issues), L-040 (browser-verify), L-031 (visual verification).

---

## L-056 — Inline styles can break responsive CSS Grid media queries

**What failed:** The `≤560px` (2-col) and `≤380px` (1-col) media queries were supposed to apply `grid-template-columns: repeat(2, 1fr)` and `1fr` to the homepage grid container. However, the browser stubbornly rendered 3 columns on mobile devices, ignoring the container's media query constraints.

**Root cause:** The "About" widget had an inline style `grid-column: span 3;` which explicitly demanded 3 columns. Because inline styles supersede CSS classes and media queries, the CSS Grid algorithm was forced to expand the entire grid container to 3 columns to accommodate the single widget, breaking the responsive layout for all other widgets in the row.

**Prevention rule:**
- **Never use inline styles for structural grid placement (`grid-column`, `grid-row`) in a responsive layout.** Inline styles cannot be overridden by media queries (without `!important`, which is a bad practice).
- If a widget needs a specific size, create a semantic size class (e.g., `.s32` for `span 3` wide, `span 2` tall) and apply responsive overrides to that class inside your media queries.
- When diagnosing a grid that refuses to collapse to fewer columns, always check the children elements. The grid will always expand to fit its widest child span requirement, overriding `grid-template-columns`.

**Related rules:** L-049 (DOM coordinate audit before grid edit), L-050 (CSS grid auto-placement > explicit).

---

## L-055 — Always check `git branch --show-current` before committing; agent dispatch may have moved you

**What failed:** On 2026-06-27, I committed `docs(todo): expand Phase 1 ...` while sitting on `feat/topbar-mobile-first` (an agent's working branch for the topbar task), not `dev` where the change belonged. I noticed only after the commit when checking the branch log. The fix was `git reset --hard <commit>`, then `git checkout dev`, then re-apply the change. No data was lost because the commit was local-only (push returned "Everything up-to-date" warning that I missed).

**Root cause:** I had created the kickoff on `dev`, then dispatched the agent. The agent created `feat/topbar-mobile-first` for their work, and when I switched contexts back to todo work, I didn't re-check which branch I was on. The session-continuation pattern from compaction carried me forward without a branch-state check.

**Prevention rule:**
- **BEFORE every commit**, run `git branch --show-current` and confirm it matches the intended target. Print the branch name in your reasoning, not just trust it.
- **Especially after async events** (agent dispatch, file edits in another branch, push from another shell): the working branch may have changed under you.
- **Watch for "Everything up-to-date" on push** — that's a hint the local branch isn't connected to where you thought it was. If you expected your commit to land on `dev` but it didn't, the branch is wrong.
- **Quick recovery pattern if this happens:**
  1. `git log --oneline -3` to confirm the wrong-branch commit exists
  2. `git reset --hard <commit-before-mistake>` to undo locally
  3. `git checkout <intended-branch>`
  4. Re-apply the change
  5. `git push origin <intended-branch>`
- **Related to L-042 (re-read branch state before committing)** but different: L-042 is about committing while a different agent is actively on a branch (cross-contamination). L-055 is about committing while YOU are on the wrong branch (your own context drift). Both are check-the-branch-first patterns but for different reasons.

**Related rules:** L-042 (re-read branch state), L-046 (branch lineage contamination, audit before merge).


---

## L-054 — Inline border-color is enough to color-code node-diagram nodes; don't add new CSS classes

**What failed:** N/A — prevented by checking first. Considered adding `.nd-node-blue`, `.nd-node-purple` etc. for the Unilox and Portfolio node variants but realized this would add 6+ CSS rules for single-use cosmetic differences.

**Root cause / context:** Multi-node diagrams (P5, P8) needed visual differentiation between nodes beyond the default `var(--w06)` border.

**Prevention rule:**
- For node color differentiation in `node-diagram`, use inline `style="border-color:rgba(R,G,B,.2)"` directly on the `nd-node` div — this is precisely the kind of one-off cosmetic variation that inline styles are appropriate for
- Reserve new CSS classes for patterns that appear 3+ times or need hover states
- The status label at the bottom of each node (e.g. `● PUBLIC · OPEN` in green, `● PRIVATE · TAILSCALE ONLY` in blue) paired with the tinted border provides sufficient differentiation without needing colored dot overrides on `nd-svc-item::before`

---

---

## L-053 — flex:1 is required on pipeline stages whenever description text length varies across stages

**What failed:** The Hermes OAuth Fork pipeline rendered with only 2 visible stages at 1400px viewport. Each stage sized to its description text width (~450px) rather than sharing available space, causing the 4-stage pipeline to overflow horizontally and require scrolling.

**Root cause:** `.pipe-stage { flex-shrink:0; min-width:130px }` prevents shrinking below 130px but doesn't constrain growth — the stage expands to fit its content. The orlon-bot pipeline worked fine because its descriptions happened to be short enough. Hermes descriptions were longer, exposing the underlying issue.

**Prevention rule:**
- Any pipeline with more than 3 stages, or with descriptions longer than ~40 characters, needs `flex:1;min-width:130px` on each `.pipe-stage` to distribute width equally
- When reusing `.pipeline` with new content, do a quick char-count on the longest `pipe-detail` string — if it's >40 chars, add `flex:1` to the stages

---

---

## L-052 — Audit existing CSS patterns before designing new artifacts; never invent what already exists

**What failed:** Gemini's artifact implementations for projects 5–8 each invented new SVG-based visualizations from scratch (plain SVG text boxes, colored rect nodes) instead of using the `.nd-node`, `.pipe-stage`, `.plat` patterns that already existed for projects 1–4. The result was visual inconsistency across the projects page.

**Root cause:** The agent didn't read far enough into the file to discover the reusable CSS artifact classes before writing its own approach.

**Prevention rule:**
- Before building any new visualization on this page, search for `.vis-wrap`, `.node-diagram`, `.pipeline`, `.platform-grid`, `.bar-chart` in the file and read their CSS + one usage example first
- Map the visualization concept to an existing pattern before reaching for SVG: "nodes connected by protocol" → `node-diagram`, "linear ordered stages" → `pipeline`, "equal-weight alternatives" → `platform-grid`, "quantitative comparison" → `bar-chart`
- Only use raw SVG when no existing HTML pattern fits the concept

---

---

## L-051 — Check what fonts are already loaded before designing new widget text

**What failed:** N/A — prevented by checking first. But previous agents on this task likely used DM Mono or generic monospace for the Hermes title, missing the Ndot dot-matrix font that was already loaded via `@font-face` and used throughout the NothingOS widget system.

**Root cause:** Not reading the font loading section of the file before designing text content.

**Prevention rule:**
- For any new widget in this portfolio, check `@font-face` declarations and `font-family` usage in existing `.w` elements before choosing a font
- Available custom fonts: `Ndot` (dot-matrix/NothingOS), `JetBrains Mono` (labels/metadata), `DM Mono` (numbers/monospace data), `Space Grotesk` (roadmap page), `Syne` (about/projects pages)
- Ndot = any pixel-art or dot-matrix title. DM Mono = stat numbers. JetBrains Mono = `wlbl-row` labels and sub-labels

---

---

## L-050 — CSS grid auto-placement is the right tool; explicit placement is the fallback

**What failed:** N/A — this is a positive pattern worth recording after it worked cleanly.

**Root cause / context:** The Hermes widget needed to land at col4 row5. Rather than using `grid-column: 4; grid-row: 5;` (explicit placement), inserting the widget between PROJECTS STAT and ABOUT in HTML order let auto-placement put it in the only empty cell in row5 — col4 — exactly right, with zero extra CSS.

**Prevention rule:**
- Before reaching for explicit `grid-column`/`grid-row` placement, check if correct HTML ordering achieves the target auto-placement — it's less fragile and doesn't break when other widgets are added/removed
- Explicit placement is the right choice only when auto-flow cannot produce the target layout (e.g. intentional gaps, reverse order, items that span across non-contiguous cells)

---

---

## L-049 — Always do a DOM coordinate audit before any grid layout edit

**What failed:** Previous agents got the Hermes widget placement wrong repeatedly. The root cause in each case was editing the grid without knowing the actual rendered positions — guessing at row/col placement from source order alone.

**Root cause:** CSS grid auto-placement is non-obvious when items have mixed span sizes (s11, s12, s21, s22). You cannot reliably predict where a new widget lands just by reading HTML order; you need to know which cells are actually empty.

**Prevention rule:**
- Before any homepage grid edit, run a Playwright `getBoundingClientRect()` sweep on all `.grid > .w` elements and map row/col from actual y-coordinates: `row = Math.round((y - gridTop) / (rowHeight + gap)) + 1`
- Identify the target empty cell from real coordinates, not visual assumption
- Verify placement AFTER the edit with the same sweep before delivering

---

---

## L-048 — "Verified working" requires checking ALL writers, not just the new code

**What failed:** Same as L-047. After committing my fix, I ran `grep -c "loadGitHub"` and other grep checks against my new IIFE, all passed. I declared "31/31 verification checks pass" in the end-of-task report. But the widget was still broken in browser because the OLD code was running.

**Root cause:** My verification scripts were scoped to the new code only. They checked file structure (does the IIFE exist? does it have the right keys?) but not runtime behavior (does the IIFE win, or does some older code overwrite its output?).

**Prevention rule:**
- **Static checks prove the code is PRESENT, not that it RUNS.** Runtime browser-verify is the only way to confirm DOM mutations actually take effect.
- **When verifying a UI fix, the test should check the final rendered state, not just the source code.** Examples:
  - Wrong: `grep -c "id='gh-cc'" portfolio-combined.html` (just checks the file)
  - Right: open browser, wait for JS to run, check `document.getElementById('gh-cc').textContent` (checks what's actually displayed)
- **Before declaring a fix verified, list ALL the JS that could possibly touch the element.** For each one, ask "is this still running? what does it write?" If any of them writes to the element after your fix, your fix may not be visible.
- **Diff your static check vs your runtime check.** If they say different things, the runtime check is correct.

**Related rules:** L-047 (scan all writers), L-040 (browser-verify for UI), L-031 (verify visually).

---

## L-047 — When adding new behavior, scan ALL existing code that touches the same DOM elements

**What failed:** On 2026-06-27, I committed `<span id="cc">51</span>` as the new "fixed" contribution count, but the widget still showed random numbers on each load. I had verified my own IIFE didn't override `#cc` — but I missed an EXISTING simulated-grid JS at line ~5828 that did:
```javascript
setInterval(() => {
  document.getElementById('cc').textContent = cur.toLocaleString();
  if (cur >= target) clearInterval(counter);
}, 30);
```
This was running AFTER my static markup rendered, overwriting `51` with a random animated value.

**Root cause:** I was focused on the new code I'd written (the IIFE) and didn't grep the file for OTHER code that touches the same element. The static `51` was correct, but the existing JS silently overrode it.

**Prevention rule:**
- **Before declaring any DOM mutation "stable," grep the entire file for the element ID.** Example: `grep -nE "getElementById\(.cc.\)|cc\.textContent|#cc" prototypes/portfolio-combined.html`. If multiple places write to the same element, you have a race condition.
- **Order matters:** the last-executed JS wins. Even if your static markup is in the HTML, a JS that runs later will overwrite it.
- **For dynamic widgets, also check `querySelector` and template literals** — not just `getElementById`. Use a broad grep like `grep -nE "id=\"cc\"|id='cc'|\"#cc\"|'#cc'"` to catch all forms.
- **The fix isn't always to remove the conflicting code.** In this case the user wanted the visual grid to stay but only the static count to be `51`. The right fix was to remove ONLY the `setInterval` block that wrote to `#cc`, keeping the random cell generation. When "fixing" a conflict, ask what each piece was supposed to do before deleting anything.

**Related rules:** L-048 (verify the full chain of DOM mutations), L-029 (classify CSS vs HTML during conflict resolution), L-040 (use playwright/browser-verify for UI changes), L-031 (verify visually not just with assertions).

---

## L-046 — Branch lineage contamination: don't merge a branch just because it's "downstream" — audit the diff first

**What failed:** On 2026-06-26, two branches (`feat/svg-icons-light-mode` and `feat/homepage-oauth-spotlight-widget`) were merged to dev in sequence. Both contained the Hermes OAuth widget because the svg-icons-light-mode branch had been forked AFTER the widget was added on the spotlight branch. The end result: a broken widget + conflicting layout attempts + character-overlap font rendering issues all ended up on dev, and required **two separate `git revert -m 1` operations** to undo. The first revert alone didn't remove the widget (it came in via the earlier svg-icons-light-mode merge), so the widget only disappeared after reverting the svg-icons-light-mode merge too.

**Root cause:** Merged branches without checking what other changes the branch was carrying besides the headline feature. The svg-icons-light-mode merge brought ~250 lines of new SVG light-mode CSS (good) but ALSO the entire Hermes widget + multiple layout fix commits (bad). I treated the merge as "atomic to the SVG fix" when it was actually a bundled delivery.

**Prevention rule:**
- **Before merging any branch, run `git log main-branch-ancestor..branch --stat` to see ALL commits and ALL files changed.** Don't trust the branch name — branches carry forward everything from their base.
- **If a branch's base is older than the last clean dev commit, the branch will pull in extra changes.** Either:
  - (a) Rebase the branch onto a recent dev commit before merging (if safe)
  - (b) Cherry-pick only the commits you want (if the bad commits are identifiable)
  - (c) Use `git revert -m 1` for each merge commit (works but pollutes history with revert commits)
- **For our 3-branch chain (spotlight → svg-icons-light-mode → dev), the safer move would have been:** rebase svg-icons-light-mode onto spotlight's tip (after spotlight was merged), then merge. That keeps the SVG fix cleanly separated from the messy widget work.
- **Detect this BEFORE merging:** if a branch's tip is more than N commits ahead of where it forked from, audit. The `git merge --no-ff` will show the changed files but doesn't tell you "this branch also re-introduces the spotlight widget from earlier."
- **Mental model:** every merge is a contract. Read what's in the contract (the diff) before signing.

**Specific to portfolio-website on 2026-06-26:**
- `feat/homepage-oauth-spotlight-widget` branch tip: `82465fe` (the Hermes fix by claude-code)
- `feat/svg-icons-light-mode` branch tip: `d3258c1` (the SVG fix by claude-code)
- The svg-icons-light-mode branch was forked from `b01a030` (a doc-only commit), which itself was downstream of `c2eeb7d` (an earlier spotlight branch commit). So svg-icons-light-mode INHERITED all the messy Hermes work.
- When I merged svg-icons-light-mode to dev (`41f1cc2`), the diff appeared small (~32 lines) because the SVG fix itself was small, but the merge ALSO brought all of the spotlight branch's commits into dev. The widget appeared on dev at that point.
- The cleanup required: `git revert -m 1 6d88cbd` (which only removed the spotlight merge) + `git revert -m 1 41f1cc2` (which finally removed the widget since it came in via this earlier merge).
- The SVG light-mode fix itself was valid — it'll be re-applied in a future session via a clean cherry-pick of just the `2e5f83f` and `6057b15` commits onto a current dev base.

**Related rules:** L-042 (verify branch before committing), L-028 (audit kickoff before dispatch), L-029 (classify CSS vs HTML during conflict resolution).

**User-facing impact of this rule being broken on 2026-06-26:**
- User had originally approved the SVG light-mode fix as "done"
- I reverted both merges (`ac616a2` and `3118dd1`) thinking I was only reverting the bad widget work
- This silently undid the SVG fix the user had confirmed as done
- User discovered the fix was reverted and asked "why did you revert it, it was already done"
- Recovery required re-applying the fix at `6b83cb9` (~10 min)

**Refinement — always ask before doing a wide revert.** L-046's first version said "use `git revert -m 1` for each merge commit (works but pollutes history with revert commits)". This is true mechanically, but ignores the user-facing contract: when user says "X is messed up, revert it", they usually mean the X-specific work, not the chain of merges that contained X. The safer default is to **ask** before doing a wide revert if the merge is bundled with other (good) work.

---

## L-045 — CSS `object-position` only changes what's visible, not the image content.

**Date:** 2026-06-25
**Incident:** When the cropped photo had whitespace above the head, I changed `object-position: center` to `object-position: top center` thinking it would "push the head to the top". It did change what was visible inside the frame, but it didn't fix the underlying issue — the image itself still had whitespace baked into the cropped region.

**Lesson:**
- `object-fit: cover` + `object-position` are display-layer tools. They control cropping/positioning inside the frame, but they can't change the actual pixel content of the image.
- If the image has whitespace in the source pixels, no CSS will remove it — you need to recrop with a different y_start (or have the user provide a better-cropped source image).
- The diagnosis order should be: (1) analyze the cropped image's actual pixel content (PIL/numpy), (2) determine if the issue is in the source image or in the CSS, (3) fix whichever is the actual cause.

**Fix applied:** User provided a properly-cropped image (no whitespace above the head). Applied directly via `<img src="assets/image.png">`. CSS `object-position: top center` still useful to anchor the head to the top of the frame for safety against future cropping adjustments.

**Related rules:** L-043 (don't re-crop what user already cropped), L-031 (verify visually, not just with assertions).

---

## L-044 — Distinguish user-visible widgets from backing text. Both may need updating.

**Date:** 2026-06-25
**Incident:** When the user asked "inside contact widget, replace open for internships with open for werkstudent jobs", I changed `<div class="photo-status">open to internships</div>` — the small text near the photo. The user then showed me a screenshot saying "the contact widget still says available for internships" — turns out the homepage contact widget has TWO status indicators: `.photo-status` (which I changed) and `.avail-badge` (the green prominent badge). The `.avail-badge` is the one users actually see in the widget.

**Lesson:**
- When the user names a widget by its visual position ("inside contact widget"), look at the rendered DOM and identify ALL the text indicators in that widget — not just the one matching the user's words.
- For the contact widget specifically, there are two parallel status lines: `.photo-status` (text above the CV download pill) and `.avail-badge` (green text in the right column). Both need updating for consistency.
- Verify by reading the rendered widget in the browser, not by grep — the same words can appear in multiple places.

**Fix applied:** Changed `<div class="avail-badge">available for internships</div>` → `open to werkstudent jobs`. Both status indicators now consistent.

**Related rules:** L-026 (verify in browser, not just grep), L-040 (show what's currently there before applying changes).

---

---

## L-043 — When user provides a pre-cropped image, apply it directly. Don't re-crop.

**Date:** 2026-06-25
**Incident:** User asked me to add a photo to the about-page photo widget and crop `assets/image.png`. I cropped it 3 times (square 768×768, then portrait 720×864 with two different y_offsets) trying to position the head at the top of the frame. All 3 crops looked bad — too much whitespace above the head, or head positioned wrong. After 3 wasted commits, user said "im gonna delete both pics now and added new cropped pic, just apply it" — they had pre-cropped the image themselves.

**Lesson:**
- If the user explicitly says "apply it" or "just apply", they mean apply directly, no preprocessing.
- Vision_analyze has a known athena quirk where it returns empty text for some images — don't rely on it as the sole verification step. Use PIL + numpy + ASCII rendering for actual pixel-level analysis.
- When the cropping math is off, the user can do it faster than you. Don't burn commits re-trying.

**Fix applied:** Used `<img src="assets/image.png">` directly in HTML (no crop step). Removed `image-cropped.jpg` from git tracking. CSS unchanged (`object-position: top center` still anchors the head to the top of the frame).

**Related rules:** L-026 (verify all changes before committing), L-031 (don't trust vision_analyze in athena).

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

## L-024 — Duplicate CSS selectors with the same specificity: cascade order wins, later rule overrides the new one

**What failed:** In `feat/ndot-topbar-rollout`, applied NDOT to `.nav-lang` at line 236 (topbar). Browser `getComputedStyle` still returned `JetBrains Mono`. Reason: a second `.nav-lang` rule existed at line 295 with the same specificity (0,1,0). Cascade order picked the later rule, which was the old JetBrains Mono one.

**Root cause:** CSS cascade tie-breaker: when two rules have identical specificity, source-order wins (later rule overrides earlier). This is independent of which one is "newer" in git — only file position matters. The agent's `patch` call only updated the first `.nav-lang` occurrence; the duplicate definition at a later line silently won the cascade.

**Detection method:** After any font-family/font change, run `getComputedStyle` on a real element and check the resolved value, not just grep for the change. If `fontFamily` doesn't match the expected value, there's a duplicate or higher-specificity rule overriding it.

**Prevention rule:**
- Before adding or modifying a font-family/font-size/transition on any selector, grep the file for **all** definitions of that selector and check the line numbers.
- If duplicates exist, either: (a) merge them into one canonical rule, (b) update both, or (c) delete the dead one (if no markup uses it).
- After applying the change, **always verify with `getComputedStyle`** in the browser, not just with grep.
- Same rule applies to any CSS property change, not just fonts — color, transition, transform, anything that can be silently overridden by a later rule with equal specificity.

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

---

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

---

## L-019 — Flag pre-existing, out-of-scope structural bugs explicitly instead of silently fixing or silently ignoring them

**What failed:** N/A — not a mistake, a pattern worth recording. Discovered `#pg-about` is missing a closing `</div>`, trapping `#pg-me` inside it (collapses to zero size, page unreachable) while debugging an unrelated `#pg-roadmap` modal positioning bug. Did not fix it — outside the stated scope (#pg-roadmap only).

**Prevention rule:**
- When a debugging trail surfaces a real bug outside the current task's scope, name it explicitly (element/symptom/why it's out of scope) rather than fixing it unprompted or letting it pass unmentioned.
- Before relying on any new insertion point in a large HTML file, verify it isn't accidentally nested inside an unrelated broken element — check the actual `parentElement` chain via DOM inspection, not just source-line proximity.

---

## L-018 — Equal-specificity CSS: later source order wins even when the earlier rule is inside a matching @media block

**What failed:** After rescoping the leak to `#roadmap-internal-nav { top: auto; }` inside `@media(max-width:860px)`, the fix silently didn't apply — the base, always-active `#roadmap-internal-nav { top: 14px; }` rule (same ID specificity, but positioned LATER in the stylesheet) kept winning. A matching `@media` condition grants zero extra cascade priority over a same-specificity rule outside any media query.

**Root cause:** Assumed "more specific media condition" implies "wins the cascade" — cascade ties are resolved purely by source position, not by how conditional the rule is.

**Prevention rule:**
- When an `@media` override doesn't visibly apply, check matched rules (`element.matches(selector)` + cssText, in source order) for a same-specificity rule appearing later before reaching for `!important`.
- Prefer moving the base/unconditional rule earlier in the stylesheet over `!important` when safe; use `!important` only as a surgical, commented exception when reordering risks a larger blast radius.

---

---

## L-017 — Bare element-type CSS selectors inside @media blocks leak onto every element sharing that tag

**What failed:** Mobile-breakpoint rules (`nav {}`, `.nav-links {}`, `.nav-logo {}`) written for standalone `cs-roadmap.html`'s single `<nav>` were never rescoped after merging into the 3-pill topbar. At ≤860px/≤560px they matched BOTH `#shared-nav` and `#roadmap-internal-nav`, stretching both fixed-position elements between `top`+`bottom` simultaneously — a near-full-viewport dark rectangle on every page, not just roadmap.

**Root cause:** Copy-pasting CSS from a standalone single-page file into a combined multi-page file without auditing for selectors that assume "there is only one of this tag on the page."

**Prevention rule:**
- After merging standalone HTML/CSS into a combined file, grep for bare element-type selectors (`nav {`, `header {`, `button {`) inside `@media` blocks and rescope every one to an ID/class.
- Test responsive bugs at real mobile/tablet widths (390px, 820px) headlessly — desktop-only screenshots will not catch these.
- An unexplained full-screen overlay report is itself a strong signal to check `getBoundingClientRect()` on fixed-position elements before assuming z-index/animation is the cause.

---

---

## L-016 — Synchronous DOM access for elements defined later in HTML silently kills the rest of the script

**What failed:** `#pg-roadmap`'s modal/progress-widget markup was placed after the closing `</script>` tag, but the script called `document.getElementById('modal-overlay').addEventListener(...)` synchronously at parse time — before that node existed. The uncaught TypeError halted every statement after it in that script block (function declarations stayed hoisted, masking the crash), silently breaking renderTopics/renderCareers/all observers/routing with no visible symptom unless the console was open.

**Root cause:** Non-deferred `<script>` blocks execute top-to-bottom as parsed; any `getElementById`/`querySelector` target must already exist above the `<script>` tag, or the call must be deferred to `DOMContentLoaded`.

**Prevention rule:**
- Markup referenced via `getElementById`/`querySelector` in a top-level (non-deferred) script must live ABOVE that script tag.
- After any HTML reorg near a `<script>`, headlessly load the page and check `pageerror` events — don't trust visual screenshots alone, hoisted functions can make a dead script body look fine.
- If a page "loads fine" but specific dynamic content is empty, suspect a silent JS crash before assuming CSS/animation is the cause.

---

---

## L-015 — `position:fixed` inside a CSS-transformed SPA page container doesn't stick to the viewport

**What failed:** `#progress-bar { position:fixed; top:0 }` placed inside `#pg-roadmap` scrolled with page content instead of staying fixed at the top of the viewport.

**Root cause:** CSS spec: any ancestor with `transform`, `filter`, `perspective`, or `will-change: transform` becomes the containing block for `position:fixed` descendants — even if it's not `position:relative`. SPA page containers use `transform: translateX(...)` for transitions, so `fixed` children are positioned relative to the page div, not the viewport.

**Prevention rule:**
- Never place `position:fixed` elements inside any div that uses CSS `transform` (including SPA page containers).
- Move fixed UI (scroll progress bars, toasts, overlays) to be direct children of `<body>`, outside all page containers.
- In a `.page { transform: ... }` SPA: only `position:absolute/relative` is safe inside page divs.

---

## L-014 — Long-running coding agents must be delegated, not run in foreground terminal

**What failed:** Dispatched Claude Code for a large roadmap integration task by calling `terminal()` with `timeout=600`. The process was killed at 10 minutes mid-work, then relaunched via background `terminal()` and later killed again. Result: ~50% of Claude Code credits burned, only 20 lines changed, no deliverable, and an empty `tee` log.

**Root cause:** Coding-agent CLIs are long-lived autonomous workers, not short shell commands. The `coding-agent-clis` skill explicitly says to use `delegate_task` for these agents. Using `terminal()` killed the session on timeout. Piping through `tee` inside a shell made the log unbuffered and lost all output when SIGTERM arrived.

**Prevention rule:**
- For `claude`, `codex`, `opencode`, `agy`, `abacusai`, `agent`, `copilot`: always use `delegate_task` (toolsets `["terminal", "file"]`) unless the task is literally one shell command.
- If `delegate_task` is unavailable and a background `terminal()` is needed: redirect directly to a file (`> /tmp/agent.log 2>&1`) — no pipes, no `tee`, and always set `notify_on_complete=true`.
- Never impose a short foreground timeout on a multi-step coding task.
- Liveness check = `git diff --stat` over time + `ps -p <pid>`, not log file contents.
- When the user says "I got this" or wants to take over, ask explicitly whether to **pause** or **kill** the agent — do not assume and terminate a running credit-consuming session.

---

## L-013 — A "slide-over" topbar swap reads as two different sites; morph from the shared pill instead

**What failed:** The roadmap internal nav was implemented by sliding the entire shared 3-pill topbar off-screen left and sliding a separate roadmap pill in from the side. It felt like navigating to a different site, and the shared logo/controls disappeared.

**Root cause:** Hiding the whole shell nav (`#shared-nav.nav-hidden { transform: translateX(-100%) }`) destroys visual continuity. A page-local sub-nav should feel like it grows out of the existing shell, not replace it.

**Prevention rule:**
- For a page-local sub-nav inside a shared SPA shell, keep the shell's outer pills (logo, controls) fixed and visible at all times.
- Anchor the sub-nav to the exact slot of the element it replaces (same `top/left:50%/translateX(-50%)`), and morph with `opacity` + `transform: scale()` from a center origin so it reads as "popping out" of that pill.
- Scope the hide behavior to only the swapped child (`#shared-nav.nav-hidden .nav-links`), never the whole nav container.
- Match the sub-nav's glass fill/shadow to the shell pills so it looks like the same component expanding, not a foreign bar.

---

## L-012 — SPA page transitions hide content because entrance animations were observed while pages were `display:none`

**What failed:** In `portfolio-combined.html`, the roadmap "11 CORE TOPICS", "CAREER PATHS", and resources cards appeared empty after clicking the roadmap page. The cards existed in the DOM and the render functions ran, but all cards had `opacity:0` from `[data-anim]` CSS. The `IntersectionObserver` was set up once at initial page load when the roadmap page was hidden (`display:none`), so it never fired for those elements.

**Root cause:** Standalone pages rely on `IntersectionObserver` to trigger entrance animations. In the SPA, most pages start hidden. Observing animated elements before their parent page is visible means the observer calculates intersections against a hidden/zero-size container and never calls back.

**Prevention rule:**
- For SPA page containers, re-run `observeAnimElements()` (and any other intersection-based setup) inside the page-switch function *after* the target page becomes `display:block`.
- Before re-observing, `unobserve()` then `observe()` each element so the browser recalculates intersections against the now-visible layout.
- Never assume a one-time observer setup at `DOMContentLoaded` works for content inside initially-hidden SPA pages.

---

## L-011 — Roadmap internal nav inherits shared topbar `.nav-links` absolute positioning

**What failed:** After merging cs-roadmap into portfolio-combined.html, the roadmap internal nav stretched full-width or misaligned because global `.nav-links { position: absolute; left: 50%; transform: translateX(-50%) }` from the 3-pill shared topbar also applied to `#pg-roadmap .nav-links`.

**Root cause:** Standalone cs-roadmap.html uses `.nav-links` as a simple flex row inside a glass pill nav. The combined SPA reuses the same class names for both the shared topbar center pill and the roadmap internal nav. Page-scoped CSS added glass styling but did not reset position/transform/background from the shared rules.

**Prevention rule:**
- When merging pages into an SPA, grep for shared class names (`.nav-links`, `.nav-logo`) and explicitly reset all inherited properties under the page container ID.
- For internal page navs that must differ from the shell nav, prefer scoping: `#pg-roadmap .nav-links { position: static; transform: none; background: none; ... }`.
- IntersectionObserver for section highlighting must be scoped to the page's nav (`#pg-roadmap .nav-links a`), not global `.nav-links a`.

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

---

## L-008 — Don't remove CSS classes when removing the HTML that uses them — check for other usages first

**What failed:** When removing the hero section (`<section class="hero">`), the `.hn-script` and `.hn-sans` CSS classes were nearly deleted too. Those classes are also used in the nav logo pill and the identity widget.

**Root cause:** Assumed CSS classes were only used in one place. The hero section defined `.hn-script`/`.hn-sans` but they're referenced elsewhere in the same file.

**Prevention rule:**
- Before removing any CSS class: `grep -n "hn-script\|hn-sans"` — count all usages
- Only delete a CSS class if its count drops to zero after removing the HTML
- Safe order: remove HTML → grep remaining usages → only then remove CSS if count = 0

---

---

## L-007 — Confirm which file to edit before starting — don't assume

**What failed:** User said "fix the homepage" but I edited `portfolio-combined.html` instead of `portfolio-v4.html`. User had to explicitly correct this.

**Root cause:** Ambiguous instruction ("the homepage") was interpreted as the combined file because that was the most recent output, when the user meant the standalone homepage prototype.

**Prevention rule:**
- When multiple files could be "the homepage", ask which one before touching anything: `portfolio-v4.html` vs `portfolio-combined.html` vs `index.html`
- Default to the most specific standalone file unless the user says "the combined file"
- Echo back the target file before every edit session: "Working on `portfolio-v4.html` — correct?"

---

---

## L-006 — Building new files from scratch wastes tokens; targeted edits are always faster

**What failed:** Asked to redesign the homepage, built `portfolio-combined.html` from scratch (1181 lines) instead of editing the existing `portfolio-v4.html`. The combined file differed from the individual pages, required re-work, and burned significant credits.

**Root cause:** Default response to "redesign X" was to write a new file. The correct default is to open the existing file and make surgical replacements.

**Prevention rule:**
- First instinct must always be `view` the existing file → `str_replace` or `python3` patch — never `create_file` on something that already exists
- If a new combined file is genuinely needed: build it by extracting sections from the originals, not by rewriting from memory
- Ask before creating any new file: "does this already exist in a form I can edit?"

---

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

## L-001 — Duplicate `const` declarations crash the entire script

**What failed:** `Uncaught SyntaxError: Identifier 'SVC_ICON' has already been declared` in `homelab-dashboard.html`. Both `const SVC_ICON` and `const TYPE_ICON` were declared twice in the same `<script>` block. The dashboard became completely non-functional at browser parse time.

**Root cause:** Two separate editing passes each injected the same `const` blocks without checking for existing declarations. JavaScript's `const` disallows redeclaration in the same scope — no error during editing, only at browser parse time.

**Prevention rule:**
- Before injecting any `const`, `let`, or `function` into an existing file: `grep -n "const SVC_ICON\|function renderSvcFull"` — assert each appears zero times
- After any injection: `grep -c "const <identifier>"` must equal exactly 1
- General rule: **search before inject** — never assume a declaration doesn't exist yet
- When multiple passes are needed: explicitly delete stale blocks before re-injecting
