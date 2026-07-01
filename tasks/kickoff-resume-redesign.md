# Task: Rebuild `prototypes/resume.html` from scratch (aesthetic version, site-grade)

**Branch:** `feat/resume-redesign` (off `dev`)
**Mode:** Builder
**Complexity:** Non-trivial full design + implementation (single HTML file, 15 sub-tasks, ~500-700 lines, A4 print + screen + dark/light themes)

---

## Setup

- **Project:** `portfolio-website`
- **Path on athena:** `~/dev-shared/projects/portfolio-website/`
- **Working directory:** this repo
- **Active branch:** `feat/resume-redesign` (off `dev`)
- **Session name:** `[portfolio-website]-local` (you're the local session, persistent tmux)
- **No cloud session needed** — this is screen + print design work, no `npm install` / Playwright-heavy operations

## What this is

An **aesthetic version of the resume** for the portfolio site — NOT the job-application CV. It lives at `prototypes/resume.html` and is currently a dark A4 print resume (19350 bytes, 577 lines). You're rebuilding it from scratch to match the portfolio's design system: light grey background, widget-block glass effect, SVG icons, 4-font stack, dark/light themes via `prefers-color-scheme`, A4 print stylesheet.

The current version stays working as a print backup until the new one is visually approved. Do NOT break the existing resume until the new one is confirmed good.

## Decisions confirmed with user (2026-06-30)

- **Font stack:** Outfit (body) + Space Grotesk (display headers, name) + Syne (accent) + JetBrains Mono (contact details, monospaced) + DM Mono (small labels). **Drop Cormorant Garamond.** Name "VISHAL KATARIYA" stays in Space Grotesk 800, no calligraphic initials.
- **Hero layout:** photo top-left, "VISHAL KATARIYA" name centered, 4 status pills below the name (AI/ML · Full Stack · DevOps/Infra · Open to work with green dot)
- **Contacts location:** 4 pills (email · github · website · location) in **left column at top** (NOT in hero)
- **Photo size:** agent picks, balanced with the hero layout (proportional to A4, not literal 170px)
- **Themes:** single file, `prefers-color-scheme: dark/light` media queries, NO separate HTML files
- **Print:** A4 stylesheet, white background regardless of theme (saves toner)
- **Projects:** 5 total — Finance Buddy, Homelab Dashboard, orlon-bot, **Portfolio Website**, **Hermes One OAuth Fork**
- **Work experience:** 1 entry — Amazon DNW4, Duisburg (Jul 2024 – Dec 2024, 6 months)
- **Content source:** `~/dev-shared/projects/resume-references/vishal_resume_library.md` (17KB, 387 lines, master source)

## Read these on session start (in order)

1. `~/dev-shared/projects/portfolio-website/CLAUDE.md` — project context, design system, CSS variables
2. `~/dev-shared/projects/portfolio-website/CONTEXT.md` — stack, infra, design tokens
3. `~/dev-shared/projects/portfolio-website/tasks/DEVLOG.md` (top 3 entries) — current world state
4. `~/dev-shared/projects/portfolio-website/tasks/todo.md` line 134-179 — the resume redesign task with 15 sub-tasks
5. `~/dev-shared/projects/resume-references/vishal_resume_library.md` — **all content for projects, work exp, skills, education, interests, languages** (read FIRST before writing any content)
6. `~/dev-shared/projects/portfolio-website/prototypes/resume.html` — current resume (19350 bytes, what you're replacing)
7. `~/dev-shard/projects/portfolio-website/prototypes/portfolio-combined.html:5745-6020` — about page (photo block, education card, interests cards — same patterns to reuse)

## Read also when designing

- The about page's `.photo-frame` (170px × 200px, border-radius 20px, neomorphism shadow) — same dimensions proportionally scaled up for A4
- The about page's `.edu-card` (line 5790) — education widget pattern to copy
- The about page's `.int-grid` + `.int-card` (line 5990) — interest card pattern
- The OG banner (3 contact pills) — reference for the contact pill style (icon + label, glass treatment)
- The portfolio's CSS variables in `:root` (line 130+): `--bg`, `--bg2`, `--bg3`, `--w`, `--w80`, `--w60`, `--w30`, `--w12`, `--w06`, `--green`, `--amber`, `--blue`, `--acc`

## Tools

- `playwright` for visual QA (render at A4, screen, light, dark)
- `read_file`, `search_files`, `patch` for HTML/CSS edits
- `terminal` for `git` operations
- The local HTTP server (`python3 -m http.server 8765`) on athena for browser preview

## Source files to reference (do NOT create from scratch)

- `prototypes/assets/image.png` (659KB, 680×761) — your photo, reuse for the hero
- `prototypes/portfolio-combined.html` — 146 inline SVGs, extract the right ones
- `~/dev-shard/projects/resume-references/vishal_resume_library.md` — all content

## Your role

You are building a single HTML file with embedded CSS. The file is `prototypes/resume.html`. Don't create a new file (rename later if needed). Don't split into multiple files. The 1-file constraint is part of the design.

---

## 15 sub-tasks (in order)

### Sub-task 1: Font stack (5 min)

Update the Google Fonts `<link>` to include all 5 fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Update the CSS `:root` font-family declarations:
- `body`: `'Outfit', sans-serif`
- `.name`, `.section-title`: `'Space Grotesk', sans-serif` weight 800
- `.accent`: `'Syne', sans-serif` weight 600 (use sparingly — section kicker labels, the "Open to work" pill)
- `.contact-pill-text`, `.module-tag`, `.tech-label`: `'JetBrains Mono', monospace`
- `.small-label`, `.meta-pill`, `.kicker`: `'DM Mono', monospace`

### Sub-task 2: Hero restructure (10 min)

The hero is the top section. Layout:

```
┌─────────────────────────────────────────────────────────────┐
│  [PHOTO]    VISHAL KATARIYA                                 │
│  [170x200]  (Space Grotesk 800, 32-36px)                    │
│             AI/ML · Full Stack · DevOps/Infra · 🟢 Open     │
└─────────────────────────────────────────────────────────────┘
```

- Photo: `assets/image.png`, size proportional to A4 (try ~30-35mm wide × ~38-42mm tall — agent picks, balanced with the name height)
- Name: centered, Space Grotesk 800, large
- 4 status pills below the name, centered or aligned to the right of the name (whichever looks better)

### Sub-task 3: Remove old role text (1 min)

Delete the line "AI · ML · SWE / CS Student at h_da" (current resume line 382, the `.hdr-role` element). The 4 status pills replace it.

### Sub-task 4: Photo on top-left (5 min)

```html
<div class="hero-photo">
  <img src="assets/image.png" alt="Vishal Katariya">
</div>
```

CSS:
```css
.hero-photo {
  width: 32mm; height: 38mm;
  border-radius: 5mm; /* 20px proportional to A4 */
  overflow: hidden;
  background: var(--bg2);
  border: 1px solid var(--w12);
  box-shadow: 4px 4px 16px var(--sd), -1px -1px 5px var(--sl);
}
.hero-photo img { width: 100%; height: 100%; object-fit: cover; }
```

For the light theme, change `box-shadow` to use `rgba(0,0,0,.08)` instead of `var(--sd)` (which is dark shadow).

### Sub-task 5: 4 status pills (5 min)

Below the name, 4 pills in a row:

```html
<div class="status-pills">
  <span class="status-pill">AI/ML</span>
  <span class="status-pill">Full Stack</span>
  <span class="status-pill">DevOps/Infra</span>
  <span class="status-pill avail"><span class="dot"></span> Open to work</span>
</div>
```

CSS:
```css
.status-pills { display: flex; gap: 4mm; flex-wrap: wrap; justify-content: center; }
.status-pill {
  font-family: 'DM Mono', monospace;
  font-size: 8pt;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--w60);
  border: 1px solid var(--w12);
  border-radius: 100px;
  padding: 2mm 5mm;
  background: rgba(255,255,255,.02);
  backdrop-filter: blur(8px);
}
.status-pill.avail {
  color: var(--green);
  border-color: rgba(52,199,123,.28);
  background: rgba(52,199,123,.04);
}
.status-pill .dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--green);
  display: inline-block;
  margin-right: 4px;
  box-shadow: 0 0 6px var(--green);
}
```

### Sub-task 6: 4 contact pills in left column (15 min)

```html
<div class="contact-pills">
  <a class="contact-pill" href="mailto:vishalkatariya404@gmail.com">
    <svg>...envelope SVG from portfolio-combined.html...</svg>
    <span>vishalkatariya404@gmail.com</span>
  </a>
  <a class="contact-pill" href="https://github.com/vkkatariya" target="_blank">
    <svg>...github octocat SVG...</svg>
    <span>github.com/vkkatariya</span>
  </a>
  <a class="contact-pill" href="https://vishal-katariya.com" target="_blank">
    <svg>...globe SVG...</svg>
    <span>vishal-katariya.com</span>
  </a>
  <div class="contact-pill">
    <svg>...pin SVG...</svg>
    <span>Darmstadt, DE</span>
  </div>
</div>
```

CSS: vertical stack in left column, each pill is a row with SVG icon + text. Glass treatment (`backdrop-filter`, semi-transparent bg, subtle border, rounded corners).

Extract the SVGs from `prototypes/portfolio-combined.html`:
- Email: search for `mailto:vishalkatariya` in the file, copy the envelope SVG
- GitHub: search for `github.com/vkkatariya" target` — the file has 1 contact widget that uses octocat SVG, copy it
- Globe: search for the globe icon (used in languages/interests sections)
- Pin: search for the location pin icon (used in photo-status widget)

### Sub-task 7: Education in right column (about-page layout) (20 min)

The about page's `.edu-card` pattern is what you want. Look at `portfolio-combined.html:5790` for the exact markup. Copy the pattern, adapt for the resume:

```html
<div class="section">
  <div class="section-kicker"><svg>🎓</svg>EDUCATION</div>
  <div class="edu-card">
    <div class="edu-inst">Hochschule Darmstadt · Darmstadt, Germany</div>
    <div class="edu-degree">B.Sc. Computer Science</div>
    <div class="edu-period">Oct 2024 – Expected 2028</div>
    <div class="edu-badge">currently enrolled</div>
    <div class="edu-modules-label">MODULES COMPLETED</div>  <!-- note: drop "/ IN PROGRESS" -->
    <div class="edu-mod-chips">
      <span class="edu-mod">Algorithms & Data Structures</span>
      <span class="edu-mod">Object-Oriented Programming</span>
      <span class="edu-mod">Mathematics for CS</span>
      <span class="edu-mod">Computer Architecture</span>
      <span class="edu-mod">Database Systems</span>
      <span class="edu-mod">Operating Systems</span>
      <span class="edu-mod">Software Engineering</span>
      <span class="edu-mod">Computer Networks</span>
    </div>
  </div>
</div>
```

The 8 modules come from the library lines 41-48.

### Sub-task 8: Skills split (Technical + Soft) (15 min)

Technical skills — keep the 7-bar layout + add Git as 8th bar:

```html
<div class="skill-bars">
  <div class="skb-row"><span class="skb-n">Python</span><div class="skb-track"><div class="skb-fill g" style="width:86%"></div></div><span class="skb-v">86</span></div>
  <div class="skb-row"><span class="skb-n">Docker · Linux</span><div class="skb-track"><div class="skb-fill g" style="width:82%"></div></div><span class="skb-v">82</span></div>
  <div class="skb-row"><span class="skb-n">ML / AI</span><div class="skb-track"><div class="skb-fill g" style="width:72%"></div></div><span class="skb-v">72</span></div>
  <div class="skb-row"><span class="skb-n">TypeScript</span><div class="skb-track"><div class="skb-fill b" style="width:68%"></div></div><span class="skb-v">68</span></div>
  <div class="skb-row"><span class="skb-n">Proxmox · ARM</span><div class="skb-track"><div class="skb-fill b" style="width:64%"></div></div><span class="skb-v">64</span></div>
  <div class="skb-row"><span class="skb-n">SvelteKit</span><div class="skb-track"><div class="skb-fill b" style="width:60%"></div></div><span class="skb-v">60</span></div>
  <div class="skb-row"><span class="skb-n">Git</span><div class="skb-track"><div class="skb-fill b" style="width:58%"></div></div><span class="skb-v">58</span></div>
  <div class="skb-row"><span class="skb-n">C++</span><div class="skb-track"><div class="skb-fill b" style="width:52%"></div></div><span class="skb-v">52</span></div>
</div>
```

Then 4 skill categories (keep current 4):
- Backend & Infra: Fastify, WebSocket, REST API, PostgreSQL, Drizzle ORM, Docker, Caddy, Tailscale, Proxmox VE, KVM, ARM64
- AI & ML: QLoRA, Unsloth, Ollama, LLM inference, Hugging Face, rkllama, PyTorch, GGUF
- Frontend: SvelteKit, TypeScript, Chart.js, Vanilla CSS, Motion One
- Hosting & Deployment: Vercel, Tailscale, Hybrid patterns

Then **Soft skills** as 5 chips:

```html
<div class="soft-skills">
  <div class="sk-cat-label">SOFT SKILLS</div>
  <div class="sk-chips">
    <span class="sk">Problem-solving</span>
    <span class="sk">Technical writing</span>
    <span class="sk">Systems thinking</span>
    <span class="sk">Research & analysis</span>
    <span class="sk">Teamwork · open-source</span>
  </div>
</div>
```

### Sub-task 9: Interests (4 cards from about page) (10 min)

Copy the about page's int-card pattern (line 5990-6022). For each interest, an icon + title + 1-2 sentence description. Use emoji icons (not SVG — simpler):

```html
<div class="int-grid">
  <div class="int-card">
    <span class="int-icon">💻</span>
    <div>
      <div class="int-title">Programming</div>
      <div class="int-desc">Started coding in 10th grade — before I knew it was a career path. Now building production systems, self-hosted infrastructure, and ML pipelines across whatever stack fits the problem.</div>
    </div>
  </div>
  <div class="int-card">
    <span class="int-icon">🤖</span>
    <div>
      <div class="int-title">Artificial Intelligence</div>
      <div class="int-desc">Not just using AI tools — understanding how they work under the hood. Fine-tuning LLMs with QLoRA, running inference on edge NPUs, building multi-agent systems on self-hosted hardware.</div>
    </div>
  </div>
  <div class="int-card">
    <span class="int-icon">🏏</span>
    <div>
      <div class="int-title">Cricket</div>
      <div class="int-desc">Played since childhood — always been a big part of life. The strategy, the patience, the team dynamics. Grew up watching and playing in India and still follow it closely.</div>
    </div>
  </div>
  <div class="int-card">
    <span class="int-icon">📚</span>
    <div>
      <div class="int-title">Entrepreneurship</div>
      <div class="int-desc">Reading business books and studying how companies are built — not just the tech, but the strategy, the product thinking, and what makes a system scale. Building toward something called orlon.</div>
    </div>
  </div>
</div>
```

### Sub-task 10: Languages (no change) (1 min)

Keep the 4-language list with dots + levels exactly as it is. The `.lang-row`, `.lang-name`, `.lang-lvl`, `.lang-dots`, `.ld` classes are already in the existing CSS — reuse them.

### Sub-task 11: Projects (5 total) (25 min)

Layout per project (one row):

```html
<div class="project-card">
  <div class="project-icon"><svg>...</svg></div>
  <div class="project-body">
    <div class="project-title">Finance Buddy</div>
    <div class="project-desc">Self-hosted 7-tab finance tracker built from 993 real transactions across 44 months. Waste audit identified €3,656 in avoidable spend; savings plan runs 3 projection scenarios.</div>
    <div class="project-stack">
      <span class="sk">SvelteKit</span>
      <span class="sk">Fastify</span>
      <span class="sk">PostgreSQL</span>
      <span class="sk">Drizzle</span>
      <span class="sk">Chart.js</span>
    </div>
  </div>
  <div class="project-status done">● live</div>
</div>
```

5 projects from `vishal_resume_library.md` lines 149-303:

| # | Title | Status | Stack (top 5) | Source line |
|---|---|---|---|---|
| 1 | Finance Buddy | done | SvelteKit · Fastify · PostgreSQL · Drizzle · Chart.js | 149-168 |
| 2 | Homelab Dashboard | done | Fastify · WebSocket · Docker · Tailscale · Proxmox | 175-194 |
| 3 | orlon-bot | wip | Python · QLoRA · Unsloth · Telegram · rkllama | 201-225 |
| 4 | **Portfolio Website** | done | SvelteKit · Vercel · Tailscale · Caddy · Playwright | 231-247 |
| 5 | **Hermes One OAuth Fork** | wip | Electron · TypeScript · React · Vitest · better-sqlite3 | 256-279 |

For each project:
- **2-line description** — pull the most compelling 2 lines from the library's "Core description" or "Discovered bullet"
- **5 stack chips** — first 5 from the library's stack list
- **Status** — `done` (green dot) for Live/Complete, `wip` (amber dot) for In progress
- **SVG icon** — choose from the portfolio's icon set: 💰 for Finance Buddy, 📊 for Homelab, 🤖 for orlon-bot, 🌐 for portfolio, 🔐 for hermes

### Sub-task 12: Work Experience (1 entry) (10 min)

```html
<div class="section">
  <div class="section-kicker"><svg>💼</svg>WORK EXPERIENCE</div>
  <div class="work-card">
    <div class="work-header">
      <div class="work-role">Fulfillment Associate</div>
      <div class="work-timeline">Jul 2024 – Dec 2024 · 6 months</div>
    </div>
    <div class="work-meta">Amazon DNW4 · Duisburg, Germany</div>
    <ul class="work-bullets">
      <li>High-throughput logistics operations in a fully German-language environment.</li>
      <li>Package tracking and inventory management using warehouse systems.</li>
      <li>Cross-shift coordination; independent fault identification and resolution.</li>
    </ul>
  </div>
</div>
```

Content from `vishal_resume_library.md` lines 60-66.

### Sub-task 13: SVG icons across all sections (10 min)

Each section needs an inline SVG icon next to its label. Extract from `portfolio-combined.html` (146 inline SVGs total). Use these (search for the relevant SVG patterns):

| Section | Icon | Find pattern |
|---|---|---|
| Contacts (4 pills) | envelope, github octocat, globe, pin | `mailto:`, `github.com/vkkatariya`, location pin pattern |
| Status pills (4) | none for first 3, CSS dot for "Open to work" | — |
| Education | graduation cap (about page) | `path d="M1 6.5L6.5 4L12 6.5L6.5 9L1 6.5Z"` |
| Projects (5) | per project — choose from existing icons | finance, dashboard, bot, portfolio, oauth |
| Skills (Technical) | code/cog icon | `path d="M4.5 3L1.5 6.5L4.5 10"` (about page programming) |
| Skills (Soft) | users/handshake icon | search for handshake SVG |
| Languages | globe icon | search for circle-with-meridians |
| Interests (4) | code/AI/cricket/book | from about page's int-title SVGs |
| Work exp | briefcase icon | search for `M0 4h10v6H0z` patterns |

**Do NOT create new SVGs from scratch.** Copy from portfolio-combined.html.

### Sub-task 14: Light grey background + widget-block + dark/light themes (30 min)

The default theme is **light** (matches vishal-katariya.com default for the new design). Light grey background `#ececec` or `#f0f0f0` (use the same value as the site's `html.light` background). All sections use the widget-block glass treatment:

```css
.section {
  background: rgba(255,255,255,.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 6mm;  /* ~24px proportional to A4 */
  padding: 6mm;
  box-shadow: 0 4px 20px rgba(0,0,0,.04);
}
```

Dark theme via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  body { background: #1B1C1D; color: #F1F0F6; }
  .section {
    background: rgba(255,255,255,.02);
    border-color: rgba(255,255,255,.06);
  }
  .status-pill, .contact-pill { ... }  /* dark variants */
}
```

Print stylesheet (A4, white background regardless of theme):

```css
@media print {
  @page { size: A4; margin: 0; }
  body {
    background: #fff !important;
    color: #000 !important;
  }
  .section {
    background: #fff !important;
    border-color: rgba(0,0,0,.15) !important;
    backdrop-filter: none !important;
    box-shadow: none !important;
  }
  /* print colors */
  .name, .section-title { color: #000 !important; }
  /* etc */
}
```

### Sub-task 15: Content source (read-only — do this FIRST)

Open `~/dev-shared/projects/resume-references/vishal_resume_library.md` and read it before writing any content. Use these specific sections:

- **Personal info** (lines 7-18) — name, address, phone, email, GitHub, portfolio
- **Taglines** (lines 22-32) — for the optional tagline
- **Education** (lines 37-54) — institution, degree, period, modules (EN + DE bullets)
- **Work experience** (lines 60-73) — Amazon DNW4 EN bullets
- **Technical skills** (lines 77-122) — 7 categories, full lists
- **Soft skills** (lines 124-129) — 5 items
- **Skill bars** (lines 133-145) — for the 7-8 visual bars
- **Projects** (lines 147-317) — 5 projects, full descriptions + stack + status
- **Languages** (lines 321-329) — 4 languages
- **Interests** (lines 332-338) — 4 items

Use the **EN versions** throughout (the user said "just aesthetic resume I wanna add in my site").

### Visual QA (CRITICAL — L-068)

After the design is implemented, you MUST render it at multiple sizes and send screenshots to Vishal before committing. Vision tool returns empty on local paths, so you need Playwright screenshots.

1. **A4 print preview** (210mm × 297mm) — `page.pdf()` or screenshot at A4 size
2. **Screen 1280px** — viewport 1280×1024
3. **Screen 1920px** — viewport 1920×1080
4. **Mobile 380px** — viewport 380×800
5. **Light mode** — `prefers-color-scheme: light` (default)
6. **Dark mode** — `prefers-color-scheme: dark` (use Playwright's `emulateMedia`)

Save screenshots to `/tmp/resume-redesign-{name}.png`. Send each one in chat to Vishal with a "1) [Light] [A4] — 2) [Light] [Screen 1280] — 3) [Dark] [Screen 1920] — 4) [Mobile 380]" labeling scheme. **Do NOT auto-commit until Vishal says go.**

### Mandatory: keep the old resume working

The old `resume.html` is the fallback print version. Don't break it. If you need to rename or move it, do it in a way that the URL `/prototypes/resume.html` still serves SOMETHING (preferably the new design once approved, the old design as fallback until then).

If you need to keep the old one safe, save it to `prototypes/resume-OLD.html` and have the new one at `prototypes/resume.html`. Or commit the new one to a separate path and merge later. The user's call.

---

## Visual design constraints (must follow)

1. **Widget-block style for every section** — `.section` class with glass treatment, rounded corners, subtle border, soft shadow. NO naked sections without the glass card treatment.
2. **A4 print is the primary use case** — design first for A4, then adapt for screen. A4 = 210mm × 297mm.
3. **The hero is the most important visual moment** — the photo + name + 4 status pills should feel like a unified composition, not 3 separate elements.
4. **Density is OK for A4** — the resume is a print document, you can pack info tighter than a website. Don't add padding for the sake of it.
5. **Light is the default theme** (per user confirmation, not yet explicit — but matches the site's evolving light-first direction).
6. **Print must look professional** — A4 print, white bg, no shadows, no glass effect, all content readable in B&W. The print version is what recruiters might save as PDF.

## Hard constraints (L-068 compliance)

- **No "while I'm at it" fixes** — scope is exactly the 15 sub-tasks above
- **Visual QA before commit** — render at A4 + 3 screen sizes + 2 themes, send screenshots, wait for Vishal sign-off
- **No breaking the existing resume** — old version stays as fallback
- **No inventing content** — all from `vishal_resume_library.md`
- **No inventing SVG icons** — extract from portfolio-combined.html

## Pre-flight checklist

Before starting:
- [ ] Read `CLAUDE.md` for portfolio context
- [ ] Read `vishal_resume_library.md` for ALL content
- [ ] Skim `portfolio-combined.html:5745-6020` for the patterns you're copying
- [ ] Verify `git status` is clean on dev
- [ ] Create branch `feat/resume-redesign` off dev
- [ ] Push branch to origin

During:
- [ ] Read the file BEFORE editing (L-069)
- [ ] Don't commit to main (you're on the feature branch)
- [ ] Don't merge to dev (Vishal will do that after visual QA)
- [ ] Send screenshots in chat after each major revision

End:
- [ ] Visual QA: render at A4 + 3 screen + 2 themes, send to Vishal
- [ ] Wait for Vishal's go-ahead
- [ ] Commit to `feat/resume-redesign`
- [ ] Push to origin
- [ ] Update DEVLOG with session entry

## First action

Read the 5 files listed in "Read these on session start" in order, then describe back:
1. What you understand about the project (1 sentence)
2. What you understand about the 15 sub-tasks (1 sentence)
3. Any concerns or questions you have BEFORE starting
4. Your plan for the first 5 sub-tasks (font stack + hero + photo + status pills + contact pills)

Wait for Vishal to confirm your understanding. Then start implementing.
