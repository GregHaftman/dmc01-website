# DMC01 Website

Webflow embed code and shared design tokens for [dmc01.com](https://dmc01.com).

DMC01 is a founder-led financial data monetisation consultancy. This repo contains the custom HTML/CSS/JS sections that are embedded into the Webflow site as Custom Code blocks, plus the shared design system that keeps them visually coherent.

---

## Repo structure

```
dmc01-website/
├── sections/                      # One file per Webflow embed
│   ├── tailored-to-your-context.html
│   └── orbital.html               (TODO: import from other chat)
├── shared/
│   └── brand-tokens.css           # Local fallback / dev preview tokens
├── webflow/
│   └── head-alias-block.css       # Paste this into Webflow Project Settings → Custom Code → <head>
├── README.md
└── .gitignore
```

---

## Architecture

The design system lives in **two places** that mirror each other:

1. **Webflow's variable system** (canonical, runtime source of truth) — colours, typography, spacing are all defined as Webflow variables. Native Webflow components (navbar, CTAs, headings) consume them automatically.

2. **`shared/brand-tokens.css`** (local fallback) — used when previewing embeds outside Webflow (e.g. opening an HTML file directly in the browser via Live Server). Mirrors the Webflow values so embeds look right in dev.

The bridge between them is **`webflow/head-alias-block.css`**, which renames Webflow's auto-generated AI-gen variable names (`--ai-gen-82921b10-…---accent-primary`) to friendly names (`--accent-primary`) site-wide. Once that block is in Webflow's `<head>` Custom Code, embeds use clean variable names and they resolve correctly on the live site.

**This means: change a colour or font size in Webflow → every native component AND every embed updates automatically.** Single source of truth.

---

## Brand tokens

These are the canonical values. They live in Webflow as variables; the alias block exposes them as the names below.

### Colours

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#070708` | Deepest background (currently unused on live site) |
| `--bg-secondary` | `#161617` | **Recommended site-wide background** — smoother than primary, less risk of looking like flat black on cheap displays |
| `--accent-primary` | `#0047FF` | **Brand Blue** — CTAs, accents, highlights. NOTE: Webflow currently has `#194bcd` here. Update to `#0047FF`. |
| `--accent-primary-hover` | TBD | Hover state for brand blue. Currently `#3c6ce7` in Webflow — review whether that pairs well with `#0047FF` |
| `--text-primary` | `#FFFFFF` | Body / heading text on dark backgrounds |
| `--text-on-accent-primary` | `#FFFFFF` | Text on blue surfaces (CTAs) |
| `--neutral-inverse` | `#FFFFFF` | White, used as inverse of dark surfaces |
| `--border-secondary` | `rgba(255,255,255,0.2)` | Subtle dividers and panel borders |

### Brand-blue iteration history (so you don't relitigate)

- Original Figma report template: `#0047FF`
- Original Webflow: `#3149FF` (off-brand drift)
- Current (Apr 2026): unified on **`#0047FF`** for both web and report

### Typography

All typography is **Rajdhani** (300 / 400 / 500 / 600 / 700). Loaded site-wide via Webflow's Google Fonts integration — embeds do NOT need to load it.

Webflow stores responsive type sizes per-breakpoint. Embeds reference variables (`var(--h1-size)`) and inherit responsive behaviour automatically.

| Token | Desktop | Tablet | Mobile-L | Mobile |
|---|---|---|---|---|
| `--h0-size` | 7.99rem | 6.39rem | 5.12rem | 4.09rem |
| `--h1-size` | 5.65rem | 4.52rem | 3.62rem | 2.89rem |
| `--h2-size` | 2.83rem | 2.26rem | 1.81rem | 1.45rem |
| `--text-xxl-size` | 1.4rem | – | – | – |
| `--text-xl-size` | 1.2rem | – | – | – |
| `--text-lg-size` | 1.1rem | – | – | – |
| `--text-sm-size` | 1rem | – | – | – |
| `--base-font-size` | 1rem (16px) | – | – | – |
| `--eyebrow-size` | 0.8rem | – | – | – |

Weights: `--h0-weight: 700`, `--h1-weight: 600`, `--h2-weight: 600`, `--base-font-weight: 400`, `--base-font-weight-bold: 600`.

### Surfaces (chrome / page)

- **Site background:** `--bg-primary` (`#070708`) — the deeper black, current choice across all sections
- **Panel / card surfaces:** `--bg-secondary` (`#161617`) — used inside sections for board panels, chips, modules so they read as elevated above the page
- **Header / footer:** `--bg-primary` to match the page
- **Navbar height:** `~76px` (measured on live site, fixed-position)

### Border radius

Every rectangle frame on the site (chips, buttons, inputs, panels, modules, cards) reads from a single source: `--radius-base`. The default is `2px`. Each section computes two tiers from it:

| Token | Resolves to | Used for |
|---|---|---|
| `--radius-sm` | `var(--radius-base, 2px)` | small surfaces — chips, buttons, inputs, pills, the nav CTA, etc. (was `2px` hard-coded — 11 places) |
| `--radius-md` | `calc(var(--radius-sm) * 2)` | larger panels — board panel, framework figures, testimonial cards, the success block, etc. (was `4px` hard-coded — 6 places) |

Tweak `--radius-base` in [`webflow/head-alias-block.css`](webflow/head-alias-block.css) (or in Webflow Variables once you've wired the alias to a Webflow var) and **every rectangle on the site rounds or sharpens proportionally**. Set it to `0` for square corners everywhere; set it to `8px` for a softer feel; etc. Circles (`border-radius: 50%`) stay perfect circles regardless — they're not tied to the variable.

To wire the base value to a Webflow variable instead of a static `2px`:
1. Webflow → Variables → create a variable named **Radius Base** in any group (Sizing, Component, etc.). Set it to `2px` to start.
2. Publish once so Webflow generates the AI-gen name. In DevTools → `:root`, find the var ending in `…--radius-base`.
3. In [`head-alias-block.css`](webflow/head-alias-block.css), replace `--radius-base: 2px;` with `--radius-base: var(--ai-gen-{PREFIX}---{group}--radius-base, 2px);` — same pattern as the other variables in that file.

---

## Pending Webflow updates

Apply these in Webflow before publishing future embeds. Each is a 1-minute change.

- [x] **Brand blue:** change `Accent Primary` from `#194bcd` to `#0047FF`
- [ ] **Brand blue hover:** review whether `#3c6ce7` still works with the new blue, or pick a darker tone
- [x] **Site background:** standardised on `Neutral Primary` (`#070708`) across all sections (intro, orbital, tailored). Panels inside sections still use `Neutral Secondary` for elevation contrast.
- [ ] **Type scale:** consider bumping `base-font-size` from `1rem` to `1.125rem` (or `1.0625rem`) to address "fonts feel small" feedback. Will cascade to all embeds.
- [x] **Add the alias block** to Project Settings → Custom Code → `<head>` (see `webflow/head-alias-block.css`)

---

## Sections roadmap

Build order recommended by visual-system dependency:

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | **intro** (hero) | DONE | Big logo, main title, subtext, 3 KPIs. Sets the visual contract for the rest of the site. |
| 2 | **orbital** (six modules) | DONE (other chat) | TODO: port HTML to this repo |
| 3 | **tailored** (use cases) | DONE (v10) | This file. |
| 4 | **framework** (5-step explainer) | DONE | Five tiles (Learn → Think → Build → Execute → Deliver) with hover-peek + click-to-lock to expose a stage panel showing the activity for each step. |
| 5 | **me** (background, experience) | TODO | Content-light, easy |
| 6 | **testimonials** | TODO | Main text + testimonials hero |
| 7 | **reach** (contact form) | DONE | See `06-dmc01-contact.html`. |

**Page chrome (no scroll-order number):**

| File | Status | Notes |
|---|---|---|
| **`dmc01-nav.html`** | DONE | Sticky header — brand + Start-a-project CTA + Menu dropdown. Hidden until intro scrolls past. |
| **`dmc01-footer.html`** | DONE | Brand mark + legal links (Terms / Privacy / Cookies) + company registration + copyright. Mirrors live-site content. |

---

## Webflow embed workflow

For each section file in `sections/`:

1. **Copy the file's contents** (everything from `<!DOCTYPE html>` to `</html>` — or just from `<style>` onwards if you split, see below).
2. **In Webflow:** drag an Embed component (the `</>` icon) into the relevant section.
3. **Paste** and save.
4. **Publish** to staging. Test in browser. Open DevTools → Console to see init logs (e.g. `[DMC01-tailored] Initialised. 6 use cases wired up.`).

### Webflow gotchas to watch for

- **Embed component limit: 50,000 characters per block.** If a section exceeds this, split into two embeds OR host the JS as an external file on Cloudflare Pages.
- **Scripts only run on published sites**, NOT in Webflow Designer preview. Publish to staging to test interactivity.
- **The parent section needs `overflow: visible`** for full-bleed (`100vw` breakout) to work. Default Webflow sections clip overflow.
- **`overflow: hidden` on the parent** will clip our 100vw layouts. If a section appears narrower than expected, this is why.

### Splitting embeds (if a file exceeds 50k chars)

1. Embed component on the page: `<style>` block + the markup (`<section>...</section>`)
2. Project Settings → Custom Code → Before `</body>`: the `<script>` content (without `<script>` tags themselves)

**Framework currently needs this** — it's at ~54k chars (over the 50k limit) because of the five SVG illustrations on the stage panel. Move the contents of the trailing `<script>...</script>` block into Project Settings → Custom Code → Before `</body>` (just the JS body, no `<script>` tags), and paste only the `<style>` + `<section>` markup into the page Embed component.

Tailored is at ~40k chars with ~10k headroom. Intro and orbital are well under.

---

## Local development

This repo can be edited and previewed in VS Code.

### Setup
```bash
# In project root
git init
git add .
git commit -m "Initial commit"
```

Open in VS Code (`code .`). Install the **Live Server** extension. Right-click any HTML file → "Open with Live Server" to preview in a browser with hot reload.

For a full-site scroll preview, open [`sections/dmc01-fullsite.html`](sections/dmc01-fullsite.html) — it loads the three section files as same-origin iframes, auto-sizes them to their content, and bridges the cross-section `dmc01:openModule` event so the tailored→orbital deep-link still works. Local-only; the live site uses Webflow Embeds, not iframes.

### Note on iCloud
This repo lives in an iCloud-synced folder. Risks:
- iCloud may evict files when storage is low. **Mitigation:** right-click the project folder → "Keep Downloaded".
- Multi-machine `.git/` corruption is rare for solo work but possible. **Mitigation:** push to GitHub regularly so the canonical version is remote-backed.

### Editing with Claude
Two surfaces:
- **claude.ai chat** — design-thinking, image upload, brand context. Round-trip via copy-paste.
- **Claude Code** (terminal CLI or VS Code extension) — direct file editing, multi-file refactors. Recommended once the repo has 3+ sections.

---

## Decisions log

(Brief audit trail of non-obvious choices, so future-you doesn't relitigate.)

| Date | Decision | Why |
|---|---|---|
| Apr 2026 | Brand blue unified on `#0047FF` (was split between `#3149FF` web, `#0047FF` Figma) | Single source of truth |
| Apr 2026 | Site background → `--bg-secondary` (`#161617`) | Smoother than `#070708` on cheap displays |
| Apr 2026 | Adopted Webflow variables as canonical, embeds inherit | Eliminates duplication, single change propagates everywhere |
| Apr 2026 | Tailored section: tactical-board metaphor, side rail + dynamic chip grid | Solved the "wall of 33 sub-blocks" problem in v3 of the section |
| Apr 2026 | Constellation under chips frame as orbital-section echo | Atmospheric quote of orbital, no second-panel reading |
| Apr 2026 | Module codes `MDL-XXX` instead of numeric IDs in Recommended panel | User preference; data layer keeps numeric IDs |
| Apr 2026 | Webflow AI-gen var separator is `--` between group and var-name, not `---` | Alias block patched; Pattern A vs B documented in `webflow/head-alias-block.css` header so it isn't relitigated |
| Apr 2026 | Derived alphas (`--accent-primary-glow`, `--accent-primary-faint`) use `color-mix()` against `--accent-primary` | Auto-tracks Webflow brand-blue changes instead of drifting from a hard-coded hex |
| Apr 2026 | Renamed `--accent-primary-grid` → `--brand-grid` | The grid colour is intentionally a different blue (`#4948C0`); old name implied derivation that didn't exist |
| Apr 2026 | Framework section: 5 cards in a flex row with hover-peek + click-to-lock; each tile reveals a stage-panel illustration (signed SOW, stakeholder interviews, Notion analysis page, Figma + VS Code split, executive brief + handover bundle). Default stage shows a Gantt-proportional 12-month timeline (Learn 0.5mo / Think 1mo / Build 4.5mo / Execute 5mo / Deliver 1mo). A static-line + animated SMIL pulse runs under the cards, with the 3 / 12 / 18-month range called out as the project envelope. | The live site's "Powered by a rigorous framework" tiles were text-only; user wanted to expose the *activity* per step. The hover-peek mirrors the tailored section's interaction so the page has one consistent click-to-explore vocabulary. SVG illustrations for Build/Execute/Deliver intentionally show the actual tools (Notion, Figma, VS Code) so the section reads as concrete rather than aspirational. |
| Apr 2026 | Light/dark theme toggle: `data-theme="light"` on `<html>` flips surfaces (`--neutral-primary` → `#f5f5f7`, `--neutral-secondary` → `#fff`), text (`--white` → `#070708`), and border alphas to black. Brand blue + glow stay (work on both). Toggle lives in the nav menu's "Display" section (segmented Dark/Light). State persists in `localStorage['dmc01-theme']`; respects `prefers-color-scheme` first time. A FOUC-prevention script in each section's `<head>` applies the attribute before first paint. SVG illustrations (Notion / Figma / VS Code mocks, storm field) keep their dark look in light mode — they read as embedded device-screens. | User wanted both modes. Two-attribute approach (one toggle on `<html>` cascades to every embed via descendant selectors in CSS) is the standard pattern; section-specific gradient overrides (intro vignette, board-panel & step-figure fades, nav glassmorphism bar) flip the hardcoded RGBAs that don't go through the variable system. Cross-iframe propagation in fullsite preview (parent reaches into each iframe's `<html>` to mirror the attribute) is needed because iframes are isolated documents — Webflow doesn't have this problem since everything's one DOM. |
| Apr 2026 | Orbital — the centre DMC01 mark is now clickable: each click fires an engagement wave (same `engagementMoment()` path the auto-fire uses every 11s). Wrap gets a tactile scale pulse via `.is-firing`, a `cursor: pointer`, and a hover scale-up. Disabled while a module is unfolded (the centre is invisible there). | User asked for a "playable" mark — clicking the heart of the orbital should fire the wave on demand, not just wait for the timer. Re-using the existing wave function rather than building a parallel one keeps timing/easing consistent with the auto-fired version. |
| Apr 2026 | Border radius globalised: every rectangle frame (chips, buttons, inputs, panels, cards) now reads from `--radius-base` (default `2px`) defined in `head-alias-block.css`. Each section's `:root` derives `--radius-sm` (= base) and `--radius-md` (= 2× base). Single tweak in Webflow scales the whole site proportionally; circles untouched. | User asked for one-knob global radius control. Two-tier proportional approach preserves the current 1:2 visual hierarchy (small surfaces vs panels) while keeping a single source-of-truth — `--radius-base = 0` flat-corners the whole site, `8px` softens it, etc. |
| Apr 2026 | Site background flipped from `--bg-secondary` (#161617) to `--bg-primary` (#070708) on intro / orbital / tailored — section backgrounds use `var(--neutral-primary)` so the variable chain (and any future Webflow override) propagates. Panel surfaces inside sections still use `--bg-secondary` (#161617) so they read as elevated above the page. | User preferred the deeper black for the page background; the two-tier system (primary page, secondary panels) gives clearer visual hierarchy than the previous flat #161617. |
| Apr 2026 | Intro hero v5: rails moved from y=32%/68% to y=22%/78% for more breathing room around the content. Feather-style icons reinstated on the KPIs but without the surrounding chip boxes — icons sit inline next to each label with hairline dividers between items. | v4's rail spacing was tight; pushing them out gives the text the visual headroom the user asked for. Icons on the KPIs add quick scannability without the visual weight of the boxed chips that were removed earlier. |
| Apr 2026 | Intro hero v4: rails are *spindle polygons* (thick centre, thin tips) instead of constant-width lines. Logo dropped, tagline dropped, KPI chips replaced by inline labels with hairline dividers, new orchestration-layer description added. | The user wanted a 3D feel for the road and asked for elegant text-road integration. Spindle polygons give the rails mass at the centre (where the content sits) and recede to nothing at the far ends — that's the perspective cue without breaking parallelism. Boxed KPIs felt cluttered; inline labels with hairline separators are quieter and tie visually to the rails. |
| Apr 2026 | Intro hero v3: two parallel angled rails framing the logo top/bottom, each rail's stroke is a linear gradient with a soft bell peak that sweeps end-to-end via SMIL `animateTransform` on `gradientTransform`. Counter-flow directions on the two rails. | v2 had crossed lines + 16 discrete flickering segments — wrong: the user wanted a road (parallel rails, not an X) with a smooth continuous brightness sweep, not a chopped-up flicker. Single moving gradient is geometrically what was asked for. Reset jump from translate(+80) → translate(-80) is invisible because the peak is past the rail's far edge at both endpoints. |
| Apr 2026 | Intro hero: flux-capacitor pulse on the DMC01 mark (three tip-to-centre particles + breathing core halo) — REMOVED in v4 when the logo was taken out of the hero | Logo's three-prong topology was an obvious flux-capacitor analogue; tuned to "barely there" so the mark still read as a static identity |

---

## Notes for AI collaborators (Claude, future me)

If you're an instance of Claude opening this repo for the first time:

- The project is **founder-led** — Gregoire is the user, single voice, works mostly solo. Don't pluralise.
- **Webflow is the source of truth.** Don't hard-code colours or font sizes in embeds — use `var(--accent-primary)` etc. Local fallbacks in `brand-tokens.css` are for dev preview only.
- **Brand voice:** confident, direct, slightly understated. No corporate puffery. The user pushes back honestly and expects the same.
- **The user is comfortable with technical detail** but is not a developer by trade. Explain choices and trade-offs; flag when something is "best practice" vs "your call."
- **Push back when you disagree.** The user explicitly values it. Generic agreement is unhelpful.
- **Webflow embed limit is 50,000 characters.** Track each file's size when editing. Tailored is at ~40k.
- **Design language is dark + Rajdhani + brand blue.** Geometric, slightly technical (mono-style labels, corner brackets, status lines). Not playful, not corporate — somewhere in between. Look at the orbital and tailored sections for the established tone.
