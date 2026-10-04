# AXIUM — Official Website

The unified website for **AX** (agent runtime) and **AXCrew** (agent orchestration).
Built with Astro + TypeScript + Tailwind CSS v4, React Islands only where state is
required, fully static output, deployable to Cloudflare Pages.

Design intent: a quiet, industrial, developer-tool aesthetic in the same league as
pi.dev — **not** a copy of it. Monochrome (paper/ink/void/fog), hairline borders,
faint grid backgrounds, strong typography, terminal-first visuals, almost no radius,
almost no shadow, no AI-SaaS gradients, no glassmorphism, no card stacks.

## Commands

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
- The React islands take `lang` as a prop (`<FleetNetwork client:visible
  lang={lang} />`) so the fleet node names / flow labels follow the page
  language.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static output) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/styles/global.css`) |
| Interaction | React 19 islands, opt-in only — `FleetNetwork` (live topology) + `InstallCommand` (platform tabs) |
| Fonts | Geist Sans + Geist Mono (`@fontsource`) |
| Deploy | Cloudflare Pages (native static, output `dist/`) |

## Design System

All tokens live in `src/styles/global.css`:

- **Colors** — paper / paper-2 / ink / ink-2 / ink-3 / void / void-2 / fog / fog-2 /
  line / line-dark / line-dark-2 / ok / warn / err / diff. Warm white base, black
  sections, no hues.
- **Typography** — `.kicker`, `.display`, `.h2`, `.h3`, `.lede`, `.datum`,
  `.mono-micro`. Sans/mono pairing; large display sizes; tight tracking on display,
  wide tracking on labels.
- **Spacing** — 8px rhythm, `container-x` (fluid padding), `section-pad`
  (`clamp(4.5rem, 10vw, 8rem)`), generous whitespace.
- **Borders** — 1px hairlines (`hairline-b`, `hairline-t`, `hairline-dark-b`),
  light and dark variants.
- **Backgrounds** — `.grid-bg` / `.grid-bg-light` faint 32px grid (engineering feel).
- **Motion** — 150–400ms transitions only (reveal, pulse, edge-flow, packet-out,
  packet-back, blink); `prefers-reduced-motion: reduce` globally downgrades to none.
- **Radius / shadow** — intentionally almost none.
- **Terminal style** — `.term`, `.term-cmd/-ok/-warn/-err/-dim/-focus/-diff`,
  `panel-dark`, `panel-light`, `CursorBlink`, `@keyframes blink`.

## Homepage Narrative

The homepage is one story, not a feature list: **AX runs agents on the machines
you own; AXCrew is the control plane that connects them.** The visitor should
get it in five seconds — nothing else.

Homepage sections (single source of demo data: `src/lib/topology.ts`):

| # | Section | What it shows |
|---|---|---|
| Hero | — | "One agent system. Across every machine you own." — headline + lede + **the install command right under the lede** (real URLs from the AX repo), then the **signature visual**: `FleetNetwork`, a large live topology (machines you own around the AXCrew control plane) with ONE task cycling task → route → execute → result. No telemetry. |
| 01 | Send work where it belongs | The one complete real scenario (`SendWork`): `ax run "optimize the sort benchmark"` — laptop writes the fix, AXCrew routes the build to the server, routes the bench to the GPU box, the result returns. Merges the old Fleet + Delegate sections into a single journey. |
| 02 | Control every machine | `CrewUI` — the real AXCrew product surfaces: the desktop app (crews / agents / tasks / approvals) and the Android control client (fleet / tasks / approvals). No terminal-table substitute. |
| 03 | Connected. Not merged. | `Boundaries` — four concepts, one line each: workspace / sandbox / permissions / device identity. No fleet repetition. |

Rules:

- The fleet (Laptop / Server / GPU / Cloud) appears in the Hero topology and in
  the Send-work scenario — nowhere else. No repeated node lists, no task ids,
  no fake latency, no timestamps.
- The only React islands are `FleetNetwork` (the live task flow) and
  `InstallCommand` (tabs + copy). Everything else is static Astro.
- Capabilities (Skills / MCP / Memory / Providers / CLI) live in the docs
  (`/docs`); `/ax` and `/crew` keep only their four/five product themes.

## Structure

```
src/
├─ layouts/Base.astro        # shell: fonts, SEO, lang, header/footer
├─ components/
│  ├─ Header.astro           # top nav + EN|中文 switch (mobile: horizontal scroll)
│  ├─ Footer.astro           # dark footer (bilingual)
│  ├─ Section.astro          # light / dark / paper2 wrapper — unified spacing & reading width
│  ├─ PageHero.astro         # subpage hero
│  ├─ CodeBlock.astro        # code block + copy
│  ├─ CopyButton.astro
│  ├─ SendWork.astro         # the one complete task journey (home + /crew)
│  ├─ CrewUI.astro           # AXCrew desktop + mobile product UI mock (home + /crew)
│  ├─ Boundaries.astro       # workspace / sandbox / permissions / identity (home + /crew)
│  └─ pages/                 # one bilingual component per route body
│     ├─ Home.astro          # / and /zh — 5 movements (hero / send work / control / boundaries / install)
│     ├─ AxPage.astro        # /ax and /zh/ax — run anywhere · connect · execute locally · keep state local
│     ├─ CrewPage.astro      # /crew and /zh/crew — connect · delegate · control · observe · security
│     ├─ DocsPage.astro      # /docs and /zh/docs
│     ├─ DownloadPage.astro  # /download and /zh/download
│     └─ ChangelogPage.astro # /changelog and /zh/changelog
├─ components/islands/       # React — only where state is needed
│  ├─ FleetNetwork.tsx       # live fleet topology: machines → AXCrew → AX, one task cycling (home hero + /crew)
│  └─ InstallCommand.tsx     # platform tabs + copy
├─ lib/                      # data layer (all copy lives here)
│  ├─ i18n.ts                # Lang / B / b() / pick() / path helpers
│  ├─ site.ts                # SITE / NAV / INSTALL / FOOTER_COLS
│  ├─ topology.ts            # single demo data model: machines · flow steps · send-work scenario · crew UI · boundaries
│  └─ content.ts             # docs sections + changelog
├─ pages/                    # EN: /  /ax  /crew  /docs  /download  /changelog
├─ pages/zh/                 # 中文: /zh …
└─ styles/global.css         # design system (Tailwind v4 @theme)
```

Layout system (in `src/styles/global.css`): one page width (`container-x`, 76rem),
one reading width (`container-reading`, 42rem), one section spacing
(`section-pad`), plus `container-reading-wide` for wide visuals. Sections no
longer carry their own ad-hoc widths.

## Content Grounding

Website copy is compiled from the real repositories — `../ax/docs/` and
`../axcrew/docs/` plus their release notes. Rules:

- Version badges in `src/lib/site.ts` (`axVersion`, `crewVersion`) must match the
  current real releases (ax v0.3.3, axcrew v0.3.0).
- Demo task flows, product UI mocks, docs and changelog entries describe actual
  behavior; when AX/AXCrew behavior changes, update the site accordingly.
- Do not add marketing filler ("Revolutionize", "Supercharge", …). Voice is short,
  technical, direct.

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

## Release synchronization (2026-10-05)

Product versions: AX 0.3.6 and AXCrew 0.3.2. The download pages consume `src/lib/site.ts`. Website production build and Astro diagnostics are checked with the bundled Node 24 runtime.
