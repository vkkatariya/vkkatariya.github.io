# vkkatariya.github.io — portfolio-website

![CI](https://github.com/vkkatariya/vkkatariya.github.io/actions/workflows/ci.yml/badge.svg)

Personal portfolio of **Vishal Katariya**, a computer science student at Hochschule Darmstadt (h_da). Live at **[vishal-katariya.com](https://vishal-katariya.com)**, with a GitHub Pages mirror at `vkkatariya.github.io`.

The site is a hand-built **single-file HTML app**: no framework, no bundler, no build step. The file you edit is the file that ships. Real projects (homelab dashboard, finance tracker) run on their own private hosts and are described, not embedded, here.

---

## What's on the site

One SPA, five pages, switched in place with `showPage(slug)`:

| Page | What it is |
|---|---|
| **Home** | Widget dashboard: live clock, identity, GitHub activity, skills, now, homelab, stack, featured project, career timeline, all projects |
| **Projects** | Eight case studies, each with an architecture diagram, key stats and skill bars |
| **Roadmap** | CS learning roadmap: 11 core topics with a mind map, timeline, resources and a modal per topic. Progress is saved in `localStorage` |
| **About** | Bio, education, skills, languages, interests, contact, CV download |
| **Me** | Static placeholder for a private section. The real content is served only from a home server over Tailscale (see below) |

Also:

- **Site search**: `Ctrl/⌘ + K` or `/` opens a ranked, typo-tolerant search over every page, project, topic and timeline entry. On phones it is a floating button. The private `/me` page is never indexed (a test enforces this).
- **Dark and light themes**, remembered across visits (`vk-theme`).
- **EN / DE toggle** for the main UI strings (German coverage is partial).
- **Intro splash** (`index.html`): a short animation on the same design tokens, then a redirect to the portfolio. `/#stay` shows it without redirecting, and section hashes like `/#projects` are forwarded.
- **Resume** (`prototypes/resume/resume.html`, served at `/prototypes/resume`): a one-page A4 resume in the same design system, with a print stylesheet. Earlier iterations (`resume-v1` to `resume-v3`, plus dark variants) sit beside it for reference. The PDF is `prototypes/assets/cv.pdf`.
- **Responsive and accessible**: checked from 320px to 1920px in both themes, with visible focus rings, `prefers-reduced-motion` support, and a WCAG AA contrast audit.
- **Self-contained icons**: inline SVG, no icon CDN.

---

## Design system

The look combines four layers, each used where it fits:

| Layer | Used for | CSS approach |
|---|---|---|
| Liquid Glass | Topbar and floating controls | `backdrop-filter: blur(40px) saturate(180%)` |
| Neomorphism | Widget surfaces | Dual `box-shadow` |
| NeoPOP | CTAs and project cards | Offset 3D shadow in vanilla CSS |
| NothingOS | Labels and data widgets | Mono labels, dot markers, uppercase tracking |

**Typography** (Google Fonts):

| Role | Font |
|---|---|
| Display titles | Syne |
| UI, nav, headings | Space Grotesk |
| Body text | Outfit |
| Labels | JetBrains Mono |
| Numbers and data | DM Mono |
| `V` / `K` initials only | Cormorant Garamond italic |

**Colour**: a neutral graphite base (`#1B1C1D` dark) with a teal accent (`#2FD9BE`). Nine hues (blue, teal, cyan, indigo, purple, pink, orange, lime, sand) colour nav icons, widgets and project cards through a per-element `--h` token. Each hue has a darker variant in the light theme so text and icons keep AA contrast.

---

## Hosting and deploys

| Where | What | How it deploys |
|---|---|---|
| **Vercel** (`vishal-katariya.com`) | The public site (`cleanUrls` on, no framework) | Automatically on push to `main` |
| **GitHub Pages** (`vkkatariya.github.io`) | Mirror of the same files | `pages.yml` on push to `main`: lint, deploy, then a post-deploy smoke test |
| **Home server** (Tailscale only) | The private `/me` section | Not part of this repo's public deploy |

### Keeping `/me` private

`/me/*` content is never published on Vercel or GitHub Pages. Access control happens at the network layer, not in the page:

- **Recommended:** a Caddy `remote_ip` matcher that returns `403` to any client outside the Tailscale range `100.64.0.0/10`. See `homelab-configs/me-tailscale-caddy.conf`.
- **Alternative:** bind the static server to the Tailscale IP only, so it has no public listening socket.
- **Not allowed:** page-level passwords, client-side auth checks, or any `/me` content on a public host.

The `#pg-me` page in the SPA is only an information card pointing at that gate.

---

## Develop

CI uses Node 20.

```bash
npm ci                              # install dev tooling (Playwright, htmlhint, http-server)
npx http-server . -p 8080 -c-1      # serve the repo, then open http://localhost:8080/prototypes/portfolio-combined
npm run lint:html                   # htmlhint over prototypes/*.html and index.html
npx playwright install chromium     # one-time, for the e2e tests
npm test                            # Playwright e2e suite (starts its own server on 127.0.0.1:3000)
```

There is no build step. Use `http-server` rather than opening the file directly or using `python3 -m http.server`: the intro splash redirects to the extensionless URL `/prototypes/portfolio-combined`, which `http-server` resolves and Python's server does not (it needs the `.html`).

**CI** (`.github/workflows/ci.yml`) runs the HTML lint and the Playwright suite on pushes to `main` and `dev`, and on pull requests to `main`.

**Branches:** work happens on `feat/*`, `fix/*` or `docs/*` branches, opened as pull requests into `dev`. `dev` is released to `main` through a pull request, and `main` is what deploys. Commits follow `<type>(<scope>): <description>`.

---

## Repo layout

```
.
├── index.html                  intro splash, redirects to the portfolio
├── prototypes/
│   ├── portfolio-combined.html the SPA: all five pages, CSS and JS in one file
│   ├── resume/                 current A4 resume (resume.html) plus v1..v3 and dark variants
│   └── assets/                 logos, favicons, og-image, cv.pdf
├── tests/e2e/                  Playwright specs (spa, index, phone-and-legacy)
├── homelab-configs/            Caddy config for the Tailscale-gated /me
├── .github/workflows/          ci.yml, pages.yml
├── vercel.json                 static output, clean URLs
├── playwright.config.js
├── AGENTS.md, CLAUDE.md        working agreements for coding agents
├── CONTEXT.md                  stack, infra and decisions
└── tasks/                      todo.md, DEVLOG.md, lessons.md
```

---

## Status

The single-file SPA is the live site. A SvelteKit rewrite (shared design tokens, typed content, serverless contact form) is planned but not started. Open work, including a root-load performance plan, is tracked in `tasks/todo.md`; session history is in `tasks/DEVLOG.md`.

---

## Working with coding agents

Agents should read `AGENTS.md`, `CONTEXT.md`, the latest entries of `tasks/DEVLOG.md` and `tasks/todo.md` before starting, work on a branch off `dev`, and write a `tasks/DEVLOG.md` entry at the end of each session. Do not add external dependencies without asking first.
