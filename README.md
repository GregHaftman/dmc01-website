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

- **Site background:** `--bg-secondary` (`#161617`) — recommended
- **Header / footer:** also `--bg-secondary` (or `--bg-primary` if you want subtle separation)
- **Navbar height:** `~76px` (measured on live site, fixed-position)

---

## Pending Webflow updates

Apply these in Webflow before publishing future embeds. Each is a 1-minute change.

- [ ] **Brand blue:** change `Accent Primary` from `#194bcd` to `#0047FF`
- [ ] **Brand blue hover:** review whether `#3c6ce7` still works with the new blue, or pick a darker tone
- [ ] **Site background:** standardise to `Neutral Secondary` (`#161617`) on all sections
- [ ] **Type scale:** consider bumping `base-font-size` from `1rem` to `1.125rem` (or `1.0625rem`) to address "fonts feel small" feedback. Will cascade to all embeds.
- [ ] **Add the alias block** to Project Settings → Custom Code → `<head>` (see `webflow/head-alias-block.css`)

---

## Sections roadmap

Build order recommended by visual-system dependency:

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | **intro** (hero) | TODO | Big logo, main title, subtext, 3 KPIs. Sets the visual contract for the rest of the site. |
| 2 | **orbital** (six modules) | DONE (other chat) | TODO: port HTML to this repo |
| 3 | **tailored** (use cases) | DONE (v10) | This file. |
| 4 | **framework** (5-step explainer) | TODO | Includes deliverable examples |
| 5 | **me** (background, experience) | TODO | Content-light, easy |
| 6 | **testimonials** | TODO | Main text + testimonials hero |
| 7 | **reach** (contact form) | TODO | Replace Webflow's default form |

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

Currently no section needs this. Tailored is at ~40k chars with ~10k headroom.

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
