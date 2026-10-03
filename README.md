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
- The React islands take `lang` as a prop (`<CrewTopology client:visible
  lang={lang} />`) so the fleet device names / status table follow the page
  language.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static output) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/styles/global.css`) |
| Interaction | React 19 islands, opt-in only (`client:load` / `client:visible`) |
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
you own; AXCrew is the control plane that connects them.**

```
Laptop / Server / GPU Server / Cloud VM   ← each runs its own AX (ax-01..ax-04)
        ↓
      AXCrew  (control plane · gateway)
        ↓
  one task flow: route → dispatch → execute → return → done
```

Homepage sections (all grounded in the real fleet scenario):

| # | Section | What it shows |
|---|---|---|
| Hero | — | "One agent system. Across every machine you own." + machine panel (`MachinePanel`) + install strip |
| 01 | The Fleet | `CrewTopology` as the core visual — a **live task flow**: 3 tasks leave the laptop, route through AXCrew, execute on server / GPU / cloud, results return. Not a static diagram. |
| 02 | Delegate | Static delegate scene (`DelegateFlow`: laptop → AXCrew → gpu-box, out + return edges) beside the **single terminal** (`DELEGATE` script) |
| 03 | Control | `CrewConsole` — AXCrew from desktop / mobile: node table + live CrewEvent stream |
| 04 | Boundaries | `BoundaryGrid` — workspace / sandbox / permissions per node; ed25519 pairing; state stays local |
| 05 | Install | `InstallCommand` (platform tabs) |

Rules:

- The only Terminal on the homepage is the delegate scene (02). No autoplay
  terminal, no second terminal.
- Capabilities (Skills / MCP / Memory / Providers / CLI) live on `/ax`; docs on
  `/docs`. They are deliberately absent from the homepage.
- `CrewTopology` is shared with `/crew`; its task-flow phases (route / dispatch /
  execute / return / done) animate via CSS transitions on `cx`/`cy` (positional
  state changes only, reduced-motion safe).

## Structure

```
src/
├─ layouts/Base.astro        # shell: fonts, SEO, lang, header/footer
├─ components/
│  ├─ Header.astro           # top nav + EN|中文 switch (mobile: horizontal scroll)
│  ├─ Footer.astro           # dark footer (bilingual)
│  ├─ Section.astro          # light / dark / paper2 section wrapper
│  ├─ PageHero.astro         # subpage hero
│  ├─ TerminalWindow.astro   # terminal chrome
│  ├─ CodeBlock.astro        # code block + copy
│  ├─ CopyButton.astro
│  ├─ Architecture.astro     # 7-layer architecture diagram (used on /ax)
│  ├─ MachinePanel.astro     # hero machine list (home)
│  ├─ DelegateFlow.astro     # laptop → AXCrew → gpu delegate scene, no JS (home)
│  ├─ CrewConsole.astro      # desktop / mobile control pane (home)
│  ├─ BoundaryGrid.astro     # per-node boundaries grid (home)
│  └─ pages/                 # one bilingual component per route body
│     ├─ Home.astro          # / and /zh
│     ├─ AxPage.astro        # /ax and /zh/ax
│     ├─ CrewPage.astro      # /crew and /zh/crew
│     ├─ DocsPage.astro      # /docs and /zh/docs
│     ├─ DownloadPage.astro  # /download and /zh/download
│     └─ ChangelogPage.astro # /changelog and /zh/changelog
├─ components/islands/       # React — only where state is needed
│  ├─ CrewTopology.tsx       # fleet task flow: devices → AXCrew → AX, live (home + /crew)
│  ├─ InstallCommand.tsx     # platform tabs + copy
│  └─ ProviderSwitcher.tsx   # dark provider panel (/ax)
├─ lib/                      # data layer (all copy lives here)
│  ├─ i18n.ts                # Lang / B / b() / path helpers
│  ├─ site.ts                # SITE / NAV / INSTALL / FOOTER_COLS
│  ├─ terminal.ts            # terminal scripts (grounded in real AX behavior)
│  ├─ graph.ts               # agent graph data
│  ├─ topology.ts            # fleet devices / tasks / ps table / console events
│  └─ content.ts             # capabilities, boundaries, CLI ref, docs, changelog
├─ pages/                    # EN: /  /ax  /crew  /docs  /download  /changelog
├─ pages/zh/                 # 中文: /zh …
└─ styles/global.css         # design system (Tailwind v4 @theme)
```

> `TerminalDemo.tsx` / `AgentGraph.tsx` were the earlier homepage demos; they are
> kept in the repo as a future technical-page demo but are not referenced by any
> route.

## Content Grounding

Website copy is compiled from the real repositories — `../ax/docs/` and
`../axcrew/docs/` plus their release notes. Rules:

- Version badges in `src/lib/site.ts` (`axVersion`, `crewVersion`) must match the
  current real releases (ax v0.3.3, axcrew v0.3.0).
- Terminal scripts, architecture layers, protocol tables and changelog entries
  describe actual behavior; when AX/AXCrew behavior changes, update the site
  accordingly.
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
| Install script host | `https://axium.dev/install.sh` / `install.ps1` | `src/lib/site.ts`, install pages |
| Package hosts | `@axium/cli`, Docker image name | install/download pages |
