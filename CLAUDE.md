# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Session startup

Before any meaningful work, read these files in order:

1. `CONTEXT.md` — stack, architecture, constraints, design system
2. `tasks/DEVLOG.md` (last 5 entries) — current world state
3. `tasks/todo.md` — sprint items and phase status
4. `tasks/lessons.md` — active prevention rules (L-001 through L-061+)

**This project runs in the dual-session model** (see `workflow/SESSION-WORKFLOW.md` v2):

- **Local session** (this is normally the one you are): `[portfolio-website]-local`
  - Host: athena tmux (`tmux attach -t claude-portfolio-local`)
  - Branch convention: do your work on `claude/local` (or sub-branches off it, e.g. `feat/<task>`)
  - Use for: design iteration, file edits, debugging, `vercel deploy`, dev server
- **Cloud session** (sibling, long-lived): `[portfolio-website]-cloud`
  - Host: Anthropic container (accessed via claude.ai/code or Claude Desktop)
  - Branch convention: do cloud-session work on `claude/cloud` (or sub-branches off it)
  - Use for: `npm install`, Playwright runs (29 tests), full e2e audit, builds

**Branch discipline:** `claude/local` and `claude/cloud` are the **lineage markers** for each session's work. Both merge into `dev`. Don't write directly to `dev` from either session. One session works at a time, or use sub-branches if parallel work is needed:

```bash
# Local session
git checkout claude/local
git checkout -b feat/<task>   # work branch off claude/local
# ... do work, commit, push ...
# When done: merge feat/<task> → claude/local → dev

# Cloud session
git checkout claude/cloud
git checkout -b feat/<task>-cloud   # work branch off claude/cloud
# ... do work, commit, push ...
# When done: merge feat/<task>-cloud → claude/cloud → dev
```

**Cross-session handoff:** read top 3 of `tasks/DEVLOG.md` on every resume — the cloud and local sessions log to the same DEVLOG with `cloud-session-start` / `cloud-session-end` / `local-session-handoff` markers so the other side knows what happened.

## Workflow references (symlinked, homelab-only)

The `./workflow/` directory is a symlink to `~/dev-shared/workflow/` — same path on every machine via mutagen sync. **Do not commit it** (already in `.gitignore`). Read workflow files on demand, not at every session start:

- `./workflow/SESSION-WORKFLOW.md` — Claude Code session lifecycle, dual-session (local + cloud), lineage branches, /remote-control, compaction
- `./workflow/CLAUDE-CODE-WORKFLOW-REPORT.md` — full architecture history behind the v2 model
- `./workflow/AI-ROUTING.md` — L1/L2/L3 layer model, tool vs agent routing
- `./workflow/GIT-GITHUB-BLUEPRINT.md` — branch/commit/PR conventions
- `./workflow/agents_workflow/AI-AGENTS-ORCHESTRATION.md` — sub-agent dispatch patterns
- `./workflow/TODAY.md` — daily task list
- `./workflow/PROJECTS.md` — cross-project statuses

If the symlink is broken on a fresh clone, recreate it:
```bash
ln -sf ~/dev-shared/workflow ./workflow
```

## Compaction + /remote-control (project-specific)

- **/remote-control** is the real command (not `/rc` — that's hallucinated)
- **PreCompact hook** is installed in `.claude/settings.json` — auto-writes a marker to `tasks/DEVLOG.md` before context collapses
- **Before manual /compact:** commit, push, append your work-in-progress to `tasks/DEVLOG.md` (the hook handles auto-compact, but manual is your responsibility)
- **After /compact** or /clear: re-read top 3 of `tasks/DEVLOG.md`, re-read this CLAUDE.md, check `git status` to reconstruct in-flight work
- **Pro plan 5hr rolling limit:** dual session uses 2 surfaces in parallel. Heavy days may hit limits. Run heavy CPU work (Playwright, builds) in cloud, not local, to spread load

---

## Commands

### Running locally (Phase 0 — HTML prototypes)
```bash
# No build step. Open files directly in browser:
open prototypes/portfolio-combined.html   # main SPA (all pages)
open prototypes/portfolio-v4.html         # homepage standalone
open prototypes/projects.html
open prototypes/about.html
open prototypes/cs-roadmap.html
```

### Local HTTP server (for CI-parity testing)
```bash
python3 -m http.server 8080
# Then open http://localhost:8080/prototypes/portfolio-combined.html
```

### Vercel deploy
```bash
vercel deploy --prod --yes   # production deploy
vercel deploy                # preview deploy
```

### Phase 1 SvelteKit (not started yet — scaffold lives in `web/`)
```bash
pnpm install          # from web/
pnpm run check        # Svelte typecheck
pnpm run lint         # ESLint + Prettier
pnpm run build        # static adapter build
```

### CI smoke test (GitHub Actions)
The `pages.yml` workflow runs automatically on `main` push. Manual trigger:
```bash
gh workflow run pages.yml
gh run watch   # tail the run
```

---

## Agent routing — which tool for what

**The one rule:** Can you describe this task in one sentence with a clear done state?
- **Yes → agent.** Still figuring it out → use Claude as a tool first.

### Portfolio-specific routing

| Task | Agent | Where |
|---|---|---|
| Architecture / design decision / spec writing | `claude` (Claude Code) | Mac interactive |
| Complex multi-file refactor | `claude` (Claude Code) | Mac interactive |
| Fast CSS/HTML fix, tight edit loop | `opencode` | Mac interactive |
| Scaffold new SvelteKit route / boilerplate | `codex` | Mac interactive |
| Deploy update (`vercel deploy`) | `copilot` + Vercel CLI | Mac |
| Write PR description, git ops | `copilot` (Copilot CLI) | Mac |
| Research library / approach before building | `gemini` | Mac interactive |
| Long autonomous task while away | Hermes (via Telegram or `agent.auxois-wyrm.ts.net`) | athena |

### Agent roster (all run on athena + hermes)

| CLI | Agent | Model | Best for |
|---|---|---|---|
| `claude` | Claude Code | Claude Sonnet 4.6 | Multi-file refactors, spec writing, deep reasoning |
| `opencode` | Opencode | DeepSeek v4 flash | Hotfixes, tight edit-run-fix loops |
| `codex` | Codex | GPT-series | Boilerplate, scaffold, code generation |
| `agy` | Antigravity | Claude Opus 4.6 | Complex analysis, long-context review |
| `abacus` | Abacus CLI | Claude Opus 4.8 | Hardest design problems, critical refactors |
| `copilot` | GitHub Copilot CLI | Gemini 3.1 Pro | Git ops, PR creation, GitHub Actions |
| `gemini` | Gemini CLI | Gemini | Web research, library evaluation (hermes/Mac only) |

---

## Git workflow

### Commit convention

Format: `<type>(<scope>): <description>`

| Type | When |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `style` | CSS/design changes only |
| `docs` | Documentation only |
| `chore` | Config, deps, maintenance |
| `refactor` | Restructure without behaviour change |
| `ci` | GitHub Actions changes |
| `agent` | Committed by an AI agent |

Scope for this repo: `(portfolio)`, `(homepage)`, `(projects)`, `(roadmap)`, `(about)`, `(nav)`, `(github)`.

Examples:
```
feat(homepage): add Hermes OAuth spotlight widget
fix(nav): collapse center pill to hamburger at ≤560px
style(projects): apply liquid-glass to cs-section cards
agent(claude-code): scaffold SvelteKit Phase 1 init
ci: add content sanity check to pages.yml smoke test
```

### Branch lifecycle

```bash
# Start feature
git checkout dev
git pull
git checkout -b feat/<name>

# Commit during work (prefer -p to review each hunk)
git add -p
git commit -m "feat(scope): description"

# Pre-merge audit (L-046 — check what the branch is actually carrying)
git log dev..HEAD --stat

# Merge to dev
git checkout dev
git merge --no-ff feat/<name>
git push origin dev
git branch -d feat/<name>
git push origin --delete feat/<name>
```

### Pre-commit checklist (run every time)

```bash
git branch --show-current    # confirm branch (L-042, L-055)
git diff --staged            # review exactly what's staged
git status                   # no accidental extras
```

---

## Agent kickoff template

Use this to start any coding agent on a task for this project:

```
Project: portfolio-website
Path: ~/dev-shared/projects/portfolio-website/
Branch: feat/<task-name>   ← create it before starting; assert with:
        git checkout feat/<task-name> || exit 1
        [ "$(git rev-parse --abbrev-ref HEAD)" = "feat/<task-name>" ] || exit 1

Read: AGENTS.md, CONTEXT.md, last 5 entries of tasks/DEVLOG.md, tasks/todo.md, tasks/lessons.md
Tell me what you understand before starting.

Goal: <one clear sentence — desired outcome>
Done when: <testable, observable completion state>
Constraints: <scope / don't-touch rules / no new deps without asking>

Mode: <Builder | Execution | Analytical | Mixed>
Complexity: <Simple micro-loop (≤5 line edits) | Non-trivial full workflow>

After completing:
- Write DEVLOG entry at top of tasks/DEVLOG.md
- git add -p && git commit -m "agent(<cli>): <description>"
- git push origin feat/<task-name>
```

---

## Useful Claude Code commands

```
/plan          — force a written plan to tasks/todo.md before any code (use for 3+ step tasks)
/compact       — summarize context window when it's getting long
/fork          — spawn a background subagent to handle a side task while you keep going
/code-review   — review the current diff for bugs and cleanups before committing
/code-review --fix  — apply the findings automatically
/simplify      — cleanup-only pass (no bug hunting) — good after a big edit session
/security-review    — security-focused review before any public-facing deploy
/background    — detach current session as a background agent (frees the terminal)
/diff          — interactive per-turn diff viewer
```

---

## Architecture

### Current phase: Phase 0 (HTML prototypes)

The entire live portfolio is a **single 6000+ line self-contained HTML file**: `prototypes/portfolio-combined.html`. It is a hand-rolled SPA — multiple "pages" (homepage, projects, about, roadmap, me) live as `<div class="page" id="pg-*">` siblings. Navigation between them calls `showPage(slug)` which toggles the `.active` class with a CSS fade/lift transition.

There is **no build step** for Phase 0. The source file is the deployed artifact.

### File roles

| File | Role |
|---|---|
| `prototypes/portfolio-combined.html` | **Primary source of truth** — the live SPA (all 5 pages) |
| `prototypes/portfolio-v4.html` | Homepage standalone prototype |
| `prototypes/projects.html` | Projects page standalone |
| `prototypes/about.html` | About page standalone |
| `prototypes/cs-roadmap.html` | CS roadmap standalone |
| `index.html` | Root redirect to `/prototypes/portfolio-combined.html` |
| `vercel.json` | `{"framework": null, "outputDirectory": "."}` — minimal |
| `homelab-configs/me-tailscale-caddy.conf` | Caddy config for `/me` private gate |

### Deployment split

- **Vercel (`vishal-katariya.com`)** — serves public portfolio (auto-deploys on `main` push)
- **GitHub Pages (`vkkatariya.github.io`)** — mirror (auto-deploys via `pages.yml` on `main` push)
- **athena homelab** — serves `/me/*` private section behind Tailscale; never on Vercel

### Branch strategy

- `main` — production (both Vercel + GitHub Pages deploy from here)
- `dev` — integration branch; PRs target `dev`, then dev merges to main
- `feat/*` — feature branches off `dev`

Always check `git branch --show-current` before committing (see L-042, L-055).

### SPA page switching

```javascript
showPage(slug)   // toggles .active on #pg-{slug} divs
// Active page: opacity:1, transform:translateY(0) scale(1)
// Inactive:    opacity:0, transform:translateY(10px) scale(.99)
// Transition:  cubic-bezier(.22,.61,.36,1), 450ms
```

---

## Design system

### Design layers (zoned by purpose)

| Context | Style | CSS technique |
|---|---|---|
| Navbar, widget frames | Liquid Glass | `backdrop-filter: blur(40px) saturate(180%)` |
| Widget card surfaces | Neomorphism | dual `box-shadow` |
| CTAs, project cards | NeoPOP | offset 3D shadow, vanilla CSS |
| Labels, data widgets | NothingOS | DM Mono, dot labels, uppercase letter-spacing |

### Color tokens (defined in `<style>` at top of `portfolio-combined.html`)

```css
--bg:   #080808;      --bg2: #0f0f0f;     --bg3: #141414;
--w:    #f0f0f0;      --w60: rgba(240,240,240,.6);
--w30:  rgba(240,240,240,.3);  --w12: rgba(240,240,240,.12);
--green:#3ddc84;      --acc: #00D4AA;     --amber:#ffbb33;
--blue: #5b9cf6;      --red:  #ff453a;
```

### Font stack

- **Cormorant Garamond italic** — `V`/`K` initials only
- **Space Grotesk** — display, nav, headings
- **Outfit** — body/readable text
- **DM Mono** — stat numbers, monospace data
- **JetBrains Mono** — widget labels (`.wlbl-row`), sub-labels

### Widget grid sizing classes

```
s11 = 1 col × 1 row (168px)    s12 = 1 col × 2 rows
s21 = 2 cols × 1 row           s22 = 2 cols × 2 rows
s32 = 3 cols × 2 rows          etc.
```

### Icons

All icons are **self-contained inline SVG** with class `.ico`. No external CDN. Light-mode compatibility requires both `html.light .ico svg [stroke*="..."]` and `html.light svg.ico [...]` selectors (see L-061 in `tasks/lessons.md` and `feat/svg-icons-light-mode` history).

---

## Critical rules (distilled from `tasks/lessons.md`)

**Before editing the HTML file:**
- When modifying any CSS property, grep for duplicate selectors at the same specificity — the later source-order rule wins (L-023, L-024).
- Before touching the widget grid layout, run a Playwright `getBoundingClientRect()` sweep to map actual row/col positions (L-049).
- Prefer HTML auto-placement over explicit `grid-column`/`grid-row` (L-050).
- Never add hover to layout-only wrappers (no visual properties) — only to visual widget elements (L-021, L-022).

**Before committing:**
- `git branch --show-current` — confirm you're on the right branch (L-042, L-055).
- `git log main-branch-ancestor..branch --stat` before any merge — check what the branch is actually carrying (L-046).
- For any DOM element you're fixing, grep the entire file for all JS that writes to that element ID. The last-executing JS wins (L-047, L-048).

**Before asking an agent to do anything:**
- If it's ≤5 line edits with a clear target, do it directly. Don't dispatch (L-041).
- If dispatching: audit the kickoff against source files before sending (L-028).
- Use a branch assertion (`git checkout branch || exit 1; [ "$(git rev-parse --abbrev-ref HEAD)" = "branch" ]`) at the start of every agent kickoff (L-025).

**Never do:**
- Add `position:fixed` elements inside any div that uses CSS `transform` (L-015).
- Use `display:none`-state `IntersectionObserver` setup — re-observe after `showPage()` makes a page visible (L-012).
- Add external dependencies without asking Vishal first.
- Expose `/me` content on Vercel or any public host.

---

## Infrastructure context

- **athena** — Rock 5T ARM64, Docker host; all containers bind `127.0.0.1`, never `0.0.0.0`
- **Tailnet** — `auxois-wyrm.ts.net`
- **Browser automation** — use Playwright's bundled Chromium (`~/.cache/ms-playwright/chromium-*/chrome-linux/chrome`) with `--no-sandbox`; system `/usr/bin/chromium` is broken on ARM64 (L-020)

---

## Task management

Agents write to `tasks/DEVLOG.md` (newest entry at top) at the end of every session. Format and required fields are in `AGENTS.md`. This is mandatory — a missing DEVLOG entry breaks the next session's handoff.

Lessons from corrections go in `tasks/lessons.md` (newest at top, numbered L-0NN).

<!-- 2026-06-30 · local-session smoke test · branch feat/claude-local-smoke -->
