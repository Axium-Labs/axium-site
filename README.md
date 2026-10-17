# AXIUM — Official Website

The unified website for **AX** (agent runtime) and **AXCrew** (agent orchestration).
Built with Astro + TypeScript + Tailwind CSS v4, React Islands only where state is
required, fully static output, deployable to Cloudflare Pages.

Design intent: a quiet, industrial, developer-tool aesthetic in the same league as
pi.dev — **not** a copy of it. Monochrome (paper/ink/void/fog), hairline borders,
faint grid backgrounds, strong typography, terminal-first visuals, almost no radius,
almost no shadow, no AI-SaaS gradients, no glassmorphism, no card stacks.

## Commands

The download page distinguishes source-level Linux/macOS build/install adapters
from actually published archives and installers. New platform packages require
native validation and publication; existing release badges/links are unchanged.
This follows AX and AXCrew `docs/platforms.md`.

Sandbox copy in the AX page and documentation overview distinguishes file/terminal
confinement, application/site access and action approval. Native OS sandbox support
currently requires Linux; Windows/macOS native backends remain unavailable. This
matches `ax/docs/host-permissions.md` and does not change published release badges.

```bash
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # static build → dist/
npm run preview    # preview the production build
npm run check      # astro check (types + diagnostics)
```

## i18n — English / 中文

The site is fully bilingual, route-level (static, no client state):

| Language | Routes |
|---|---|
| English (default) | `/` `/ax` `/crew` `/docs` `/download` `/changelog` |
| 中文 | `/zh` `/zh/ax` `/zh/crew` `/zh/docs` `/zh/download` `/zh/changelog` |

- The **header** carries a `EN | 中文` switch (a plain link pair) that jumps to
  the counterpart of the current page (`/ax` ↔ `/zh/ax`). No JS required.
- All UI copy lives in `src/lib/*.ts` as `B = { en, zh }` pairs; pages consume
  `field[lang]` (helpers in `src/lib/i18n.ts`: `b()`, `langOf()`, `altPath()`,
  `localized()`, `routeOf()`).
- Each page body is one shared component in `src/components/pages/`
  (`Home.astro`, `AxPage.astro`, …) taking a `lang` prop; the 12 thin route
  files (`src/pages/*` + `src/pages/zh/*`) are just wrappers.
- **Policy:** terminal output, CLI commands, code, hostnames and node ids stay
  English — exactly as they appear in the real tools. UI chrome (headings,
  lede, labels, tables, nav, footer) is translated.
- The React islands take `lang` as a prop (`<TerminalHero client:visible
  lang={lang} />`) so any language-dependent labels follow the page language.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static output) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/styles/global.css`) |
| Interaction | React 19 islands, opt-in only — `InstallCommand` (platform tabs) + `TerminalHero` (animated terminal) |
| Fonts | Geist Sans + Geist Mono (`@fontsource`) |
| Deploy | Cloudflare Pages (native static, output `dist/`) |

## Design System (current, 2026-10-14)

The site is **dark by default** — a deep navy palette with an editorial serif
display face, in the spirit of pi.dev.

Tokens live in `src/styles/global.css`:

- **Colors** — navy ramp `--color-navy-50…950`, wired into semantic tokens (`--color-bg` `#171a28`, `--color-bg-raised`, `--color-bg-sunken`, `--color-text`, `--color-text-2`, `--color-text-3`, `--color-border`, `--color-border-strong`) plus code/terminal surfaces (`--color-void`, `--color-void-raised`, `--color-void-border`, `--color-void-text`, `--color-void-text-2`). Accent is a teal-green (`--color-accent` `#4da87a`) that reads on dark. Legacy aliases (`bg-paper`, `text-ink`, `panel-dark`, `border-line`, …) still resolve, so older markup keeps working.
- **Typography** — `.label` (mono, all-caps, tracked), `.display-serif` (Newsreader variable, italic — section headings), `.display-serif-lg` (centred hero), `.display` / `.display-sm` (sans, kept for compatibility), `.h2`, `.h3`, `.prose-body` (long-form explanatory copy), `.chip` (inline code chip), `.datum`, `.mono-micro`. Sans is Geist, mono is Geist Mono, display is Newsreader Variable.
- **Spacing** — `container-x` (86rem max), `section-y` (clamp vertical rhythm), 8px base unit.
- **Borders** — 1px hairlines from `--color-border` / `--color-border-strong`; dark-surface variant `divider-dark-b`.
- **Texture** — `.grid-bg` paints a faint 34px engineering grid; `.grid-fade` masks it toward the edges. Used behind the homepage hero only.
- **Motion** — `Reveal.astro` scroll-entrance (progressive enhancement: content is visible by default, JS arms and fires the IntersectionObserver). `cursor-blink`, `pulse`. All motion respects `prefers-reduced-motion`.
- **Surfaces** — `.term-surface` (deeper navy panel for terminal output), `.surface`, `.surface-sunken`.

## Homepage Narrative

The homepage is **pi.dev-shaped**: one centred hero, then the argument, then a
run of paired sections where a concrete artefact sits next to the reasoning.

| # | Section | Left column | Right column |
|---|---|---|---|
| — | Hero | — | Centred: serif italic headline, one-line claim, install command, version links. Faint grid texture behind. |
| — | Why AX? | — | Four claims (state stays local / kernel owns mechanism / one binary one loop / agents everywhere, one place to run them) |
| 01 | Context | `ax · context` panel | Budget-derived selection, history never deleted, `[ax-progress]` |
| 02 | Tools & permissions | `ax · permission` panel | `ToolPermission`, deny > ask > allow, leases and concurrency |
| 03 | Durability | `ax · session` panel | Checkpoint before advancing, SQLite + JSONL, per-project store |
| 04 | Capabilities | `ax · capabilities` panel | Skills lexical routing, MCP transports, memory scopes |
| 05 | Models | `ax · /model` panel | Dynamic catalog, `/model`, `ModelProvider` trait |
| 06 | Control plane | `ax crew` panel | AXCrew pairing, outbound WSS, independent instances |
| — | Close | — | Centred re-install + links |

Sections alternate side on `lg` (`flip` on `ScrollSection`), so the page doesn't
read as a uniform list. There is no trailing "Boundaries" block.

Rules:
- Artefacts are **real**: every command, flag and behaviour shown comes from `ax/docs` or `axcrew/docs`. No invented output, no fake latency, no task ids.
- Section text is grounded in the kernel contract — budget-derived context, declared permissions, checkpointing, lazy loading, provider neutrality.
- React islands are `InstallCommand` and `TerminalHero` only. All the home-page panels are static Astro (`TermPanel`), so they render without hydration.
- No marketing filler.

## Structure

```
src/
├─ layouts/Base.astro        # shell: fonts, SEO, lang, header/footer (dark)
├─ components/
│  ├─ Header.astro           # sticky top nav + EN|中文 switch
│  ├─ Footer.astro           # footer (bilingual)
│  ├─ Section.astro          # light / raised / dark tone wrapper
│  ├─ PageHero.astro         # subpage hero (kicker + serif display + lede + meta)
│  ├─ ScrollSection.astro    # paired artefact + explanation section (home)
│  ├─ TermPanel.astro        # static terminal panel: title bar + body
│  ├─ CodeBlock.astro        # code block + copy
│  ├─ CopyButton.astro
│  ├─ Reveal.astro           # scroll-entrance animation (progressive enhancement)
│  ├─ CrewUI.astro           # AXCrew orchestration panel: AX instances + approvals + event stream
│  └─ pages/                 # one bilingual component per route body
│     ├─ Home.astro          # / — hero · why · 6 paired sections · close
│     ├─ AxPage.astro        # /ax — runtime loop / tools / scopes / state / sandbox
│     ├─ CrewPage.astro      # /crew — connect / identities / surface / work / durable / limits
│     ├─ DocsPage.astro      # /docs — sticky sidebar + section list
│     ├─ DownloadPage.astro  # /download — install command + platform table + AXCrew
│     └─ ChangelogPage.astro # /changelog — AX + AXCrew side by side
├─ components/islands/       # React — only where state is needed
│  ├─ InstallCommand.tsx     # platform tabs + copy
│  └─ TerminalHero.tsx       # animated terminal cycling real AX command sequences
├─ lib/                      # data layer (all copy lives here)
│  ├─ i18n.ts                # Lang / B / b() / pick() / path helpers
│  ├─ site.ts                # SITE (axVersion=0.3.11, crewVersion=0.3.7) / NAV / INSTALL / FOOTER_COLS
│  ├─ topology.ts            # demo data: TASK_JOURNEY, MACHINE_STATES, CREW_UI (legacy exports kept)
│  └─ content.ts             # DOCS_SECTIONS + CHANGELOG (AX through 0.3.11, AXCrew through 0.3.7)
├─ pages/                    # EN: /  /ax  /crew  /docs  /download  /changelog
├─ pages/zh/                 # 中文: /zh …
└─ styles/global.css         # dark design system (Tailwind v4 @theme + legacy aliases)
```

Notes:
- `astro.config.mjs` sets `devToolbar: { enabled: false }` — the Astro dev overlay
  is not shown in local development.
- `FleetNetwork.tsx`, `SendWork.astro` and `Boundaries.astro` are no longer
  imported by any page.

## Content Grounding

Website copy is compiled from the real repositories — `../ax/docs/` and
`../axcrew/docs/` plus their release notes. Rules:

- Version badges in `src/lib/site.ts` (`axVersion`, `crewVersion`) must match the
  current real releases (ax v0.3.11, axcrew v0.3.7).
- Demo task flows, product UI mocks, docs and changelog entries describe actual
  behavior; when AX/AXCrew behavior changes, update the site accordingly.
- Do not add marketing filler ("Revolutionize", "Supercharge", …). Voice is short,
  technical, direct.

## Design System (post-refactor, 2026-10-14)

The site was redesigned for a cleaner, more editorial aesthetic. Key changes:

- **CSS tokens** — neutral ramp stays OKLCH-inspired (paper/ink/void/fog), but
  chroma is reduced and contrast is higher. No warm-sepia tint. Token names unchanged.
- **Type scale** — added `display-sm` for page heroes; `display` is larger and
  tighter (-0.038em). Body measure stays 44rem.
- **Layout** — `container-x` widened to 88rem; `section-pad` slightly larger.
  Header is now `sticky` with `backdrop-blur`.
- **Grid backgrounds removed** from section backgrounds; kept only inside terminal
  panels (`panel-dark.grid-bg`).
- **Kicker usage reduced** — sections lead with a title, not always a kicker+title+lead
  triple. Repeated fleet panels removed across pages.
- **Component: CodeBlock** — `lang` prop kept for display, `copyable` defaults to true.
- **Data: content.ts** — Changelog updated to AX 0.3.11 / AXCrew 0.3.7, including
  all missing intermediate releases.
- **Data: site.ts** — `axVersion` / `crewVersion` bumped to 0.3.11 / 0.3.7.

## Deploy to Cloudflare Pages

1. Push this directory to a Git repository (or use Direct Upload).
2. In Cloudflare Pages: **Framework preset: Astro** (or manual):
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 20+ (Astro 7 requires Node 20.9+)
3. **Keep it native** — there is intentionally **no `wrangler.toml`** in this repo.
   When a `wrangler.toml` is present, Cloudflare Pages switches to
   "wrangler-driven" builds and force-fills a Deploy command (`npx wrangler
   deploy`), which fails for a plain static site. Without it, Pages runs the
   build and publishes `dist/` itself.
4. Leave the dashboard **Deploy command empty** (it should not appear at all
   once `wrangler.toml` is gone).

## Before Launch (placeholders)

These values are placeholders and are labeled as such in the UI; replace them
before going live:

| Item | Current | Where |
|---|---|---|
| Site domain | `https://axium.dev` | `astro.config.mjs` (`site`) |
| Install commands | real — `https://raw.githubusercontent.com/Axium-Labs/AX/main/scripts/install.sh` / `install.ps1`, verbatim from the AX repo README | `src/lib/site.ts` (`INSTALL`) |

## Release synchronization (2026-10-14)

Product versions: AX 0.3.11 and AXCrew 0.3.7. The download pages consume `src/lib/site.ts`. Website production build and Astro diagnostics are checked with the bundled Node 24 runtime.

## Distributed Collaboration content (2026-10-05)

The AXCrew page describes the optional distributed layer introduced in AX 0.3.7 / AXCrew 0.3.3: Host / AX Instance / Execution cardinality, capability plus Host-resource scheduling, durable Tasks/Events/Artifacts/Workflow State, asynchronous recovery without a permanent Coordinator Agent and the dedicated desktop page. AX/AXCrew data-boundary copy now distinguishes complete local Session/Memory from selected shared task summaries/checkpoints/artifacts. Topology diagrams show an example one-instance-per-Host deployment, not a restriction. Release badges and bilingual changelog now identify AX 0.3.7 / AXCrew 0.3.3. The website commit synchronizes these releases; production build passes.

The Subagents reference in `src/lib/content.ts` follows AX’s default depth 1 / concurrency 8 and AXCrew’s Plugins → Agents controls for scoped depth, shared parallelism and nested delegation.


The Crew distributed section describes the current collaboration/node/activity
workbench and makes Session isolation distinct from concurrency capacity. This
copy follows AX/AXCrew distributed feature documentation; no release badge,
changelog entry or deployment is changed by the workbench development task.

AXCrew 0.3.7 ships the Windows x64 patch installer and clarifies orchestration and recovery in the README.

AXCrew device-pairing copy distinguishes desktop-issued AX pairing codes from phone credentials approved on the computer.
