# Kickoff: feat/cv-pdf

## Context

Project: `~/dev-shared/projects/portfolio-website`
Target file: `prototypes/resume.html` (new), plus link in `prototypes/portfolio-combined.html`
Branch: `feat/cv-pdf` (from `dev`)

Generate a printable resume/CV PDF from the About + Projects page content. The site is hosted on Vercel (`vishalkatariya.dev`) as part of the hybrid architecture.

## Source content to include

From About page (`#pg-about`):
- Name: VISHAL KATARIYA
- Tagline/role: AI · ML · SWE / CS student at h_da
- Location: Dieburg · Germany
- Education: Hochschule Darmstadt · B.Sc. Computer Science · Oct 2024 – Expected 2028
- Skills: Core technical (Python, Docker/Linux, TypeScript, ML/AI, SvelteKit, Proxmox/ARM, C++), Backend & Infra, AI/ML, Frontend, Soft skills
- Languages: German, English, Hindi, Gujarati
- Interests: Programming, AI, Cricket, Entrepreneurship
- Contact: vishalkatariya404@gmail.com, github.com/vkkatariya, linkedin.com/in/vkkatariya, vishalkatariya.dev

From Projects page (`#pg-projects`):
- Finance Buddy — personal finance tracker, private, SvelteKit/Fastify/PostgreSQL/Drizzle/Chart.js
- Homelab Dashboard — realtime ops dashboard for 2-node cluster, Fastify/WebSocket/Docker/Tailscale
- TypeShift — cross-platform AI writing assistant, Kotlin/Swift/C#
- orlon-bot — Telegram bot with QLoRA fine-tuned model, Python/Unsloth/Telegram

## Deliverables

1. Create `prototypes/resume.html` — a clean, printable A4 resume page using the existing design tokens (dark background, NDOT/Space Grotesk/Outfit/DM Mono fonts, NothingOS style). Keep it minimal and readable.
2. Generate `prototypes/assets/cv.pdf` from `resume.html` using Playwright + Chromium (`/usr/bin/chromium`).
3. Add a "Download CV" link/button in the About page of `portfolio-combined.html` pointing to `assets/cv.pdf`.
4. Also add the download link to the homepage contact widget if there's a natural place.

## Rules / Constraints

- Do NOT change the topbar or overall site layout.
- Use existing CSS variables from `portfolio-combined.html` where possible.
- The PDF should be ~1 page, A4 size, no bleed/cutoff issues.
- If fonts look wrong in headless Chromium, include Google Fonts link in `resume.html`.
- Keep the resume HTML self-contained (no external JS, just CSS + content).
- Do not commit generated PDF source intermediates; only the final `cv.pdf`.

## Definition of Done

- [ ] `feat/cv-pdf` branch based on latest `dev`
- [ ] `prototypes/resume.html` created with all relevant content
- [ ] `prototypes/assets/cv.pdf` generated and looks correct
- [ ] Download link added to About page (and optionally homepage contact)
- [ ] Local verification: open `resume.html` in browser, confirm PDF opens
- [ ] `git status` clean, committed with `agent(opencode):` prefix
- [ ] Branch pushed to origin
- [ ] DEVLOG entry written
- [ ] Return summary

## Agent mode / CLI

Mode: Execution
CLI: `opencode`
Model: `kimi-k2.7-code`
Toolsets: terminal, file

## End-of-task contract

```bash
current=$(git rev-parse --abbrev-ref HEAD)
[ "$current" = "feat/cv-pdf" ] || exit 1
git status
git add prototypes/resume.html prototypes/assets/cv.pdf prototypes/portfolio-combined.html tasks/DEVLOG.md
git commit -m "agent(opencode): feat(cv-pdf): add printable resume + generated PDF + download links"
git push origin feat/cv-pdf
```
