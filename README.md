# DMC01 Website

Webflow embed code, shared design tokens, and external-asset hosting for [dmc01.com](https://dmc01.com).

DMC01 is a founder-led financial data monetisation consultancy. This repo holds the custom HTML/CSS/JS sections embedded into the Webflow site as Code Embed blocks, the shared design system that keeps them coherent, and the static-asset bundle deployed to Cloudflare for files that exceed Webflow's 50kB-per-embed limit.

---

## Repo structure

```
dmc01-website/
├── sections/                          # One file per Webflow Code Embed
│   ├── 00-dmc01-fullsite.html         # Local-only — stitches all sections via iframes
│   ├── 01-dmc01-intro.html            # Hero
│   ├── 02-dmc01-orbital.html          # Six-module orbital ("Product")
│   ├── 03-dmc01-solutions.html        # Four outcomes ("Solutions")
│   ├── 04-dmc01-framework.html        # 5-step delivery framework
│   ├── 05-dmc01-testimonials.html     # Bio + testimonial marquee ("Work with me")
│   ├── 06-dmc01-contact.html          # Contact form ("Open a brief")
│   ├── dmc01-nav.html                 # Sticky page header
│   └── dmc01-footer.html              # Brand mark + legal links + company info
├── shared/
│   └── brand-tokens.css               # Local fallback / dev-preview tokens
├── webflow/
│   ├── head-alias-block.css           # Pasted into Webflow Project → Custom Code → <head>
│   └── dmc01-orbital.js               # External JS for the orbital section (47kB, served from Cloudflare)
├── wrangler.toml                      # Cloudflare Workers config — serves webflow/* publicly
├── README.md
└── .gitignore
```

---

## Architecture

The design system lives in **two places** that mirror each other:

1. **Webflow's variable system** (canonical, runtime source of truth) — colours, typography, spacing are all defined as Webflow variables. Native Webflow components (navbar, CTAs, headings) consume them automatically.

2. **`shared/brand-tokens.css`** (local fallback) — used when previewing embeds outside Webflow (Live Server). Mirrors the Webflow values so embeds look right in dev.

The bridge between them is **`webflow/head-alias-block.css`**, which renames Webflow's auto-generated AI-gen variable names (`--ai-gen-…---accent-primary`) to friendly names (`--accent-primary`) site-wide. Once that block is in Webflow's `<head>` Custom Code, embeds use clean variable names that resolve correctly on the live site.

**Net effect:** change a colour or font size in Webflow → every native component AND every embed updates automatically.

### External asset hosting (Cloudflare Workers Static Assets)

Webflow's Code Embed has a **50,000-character limit per block**. The orbital section's JS (~47kB on its own) plus its HTML/CSS doesn't fit. To solve this, the `webflow/` folder is served publicly via a Cloudflare Worker with the Static Assets feature:

- This repo is connected to **Cloudflare Workers & Pages → dmc01-website**
- On every push to `main`, Cloudflare auto-deploys
- Files in `webflow/` become reachable at `https://dmc01-website.<account>.workers.dev/<filename>`  
  — so `webflow/dmc01-orbital.js` is at `https://dmc01-website.ghaftman.workers.dev/dmc01-orbital.js`
- The orbital embed in Webflow loads it via `<script src=…>`

Configuration lives in [`wrangler.toml`](wrangler.toml). Only `webflow/` is served publicly; everything else in the repo (sections, shared, README, etc.) stays private to GitHub.

---

## Brand tokens

These are the canonical values. They live in Webflow as variables; the alias block exposes them as the names below.

### Colours

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#070708` | Deepest background (currently unused on live site) |
| `--bg-secondary` | `#161617` | **Recommended site-wide background** — smoother than primary |
| `--accent-primary` | `#0047FF` | **Brand Blue** — CTAs, accents, highlights |
| `--accent-primary-hover` | `#3c6ce7` | Hover state for brand blue (TODO: review whether this still works against `#0047FF`) |
| `--text-primary` | `#FFFFFF` | Body / heading text on dark backgrounds |
| `--text-on-accent-primary` | `#FFFFFF` | Text on blue surfaces (CTAs) |
| `--neutral-inverse` | `#FFFFFF` | White, used as inverse of dark surfaces |
| `--border-secondary` | `rgba(255,255,255,0.15)` | Subtle dividers and panel borders |

### Brand-blue iteration history

- Original Figma report template: `#0047FF`
- Original Webflow: `#3149FF` (off-brand drift)
- Current: unified on **`#0047FF`** for both web and report

### Typography

All typography is **Rajdhani** (300 / 400 / 500 / 600 / 700) — a condensed geometric sans, loaded site-wide via Webflow's Google Fonts integration. Embeds do NOT load it themselves.

Webflow stores responsive type sizes per-breakpoint. Embeds reference variables (`var(--h1-size)`) and inherit responsive behaviour automatically.

| Token | Desktop | Tablet | Mobile-L | Mobile |
|---|---|---|---|---|
| `--h0-size` | 7.99rem | 6.39rem | 5.12rem | 4.09rem |
| `--h1-size` | 5.65rem | 4.52rem | 3.62rem | 2.89rem |
| `--h2-size` | 2.83rem | 2.26rem | 1.81rem | 1.45rem |
| `--text-xxl-size` | 1.5rem | – | – | – |
| `--text-xl-size` | 1.3rem | – | – | – |
| `--text-lg-size` | 1.2rem | – | – | – |
| `--base-font-size` | 1.0625rem (17px) | – | – | – |
| `--eyebrow-size` | 0.85rem | – | – | – |

Weights: `--h0-weight: 700`, `--h1-weight: 600`, `--h2-weight: 600`, `--base-font-weight: 400`, `--base-font-weight-bold: 600`.

Body-text opacity (dark theme): `0.88` for primary body, `0.86` for ledes, `0.62` for secondary labels — bumped from the Webflow defaults of `0.72 / 0.70 / 0.50` after a contrast review (text was reading as washed grey on dark surfaces).

### Surfaces

- **Site background:** `--bg-primary` (`#070708`) on every section's outer frame
- **Panel / card surfaces:** `--bg-secondary` (`#161617`) — used inside sections for elevated reading
- **Header / footer:** `--bg-primary` to match the page
- **Navbar height:** ~76px (fixed-position)

### Border radius

Every rectangle (chips, buttons, inputs, panels, modules, cards) reads from `--radius-base`. Default is `2px`. Each section computes two tiers:

| Token | Resolves to | Used for |
|---|---|---|
| `--radius-sm` | `var(--radius-base, 2px)` | Small surfaces — chips, buttons, inputs, pills |
| `--radius-md` | `calc(var(--radius-sm) * 2)` | Larger panels — board panel, framework figures, testimonial cards |

Tweak `--radius-base` in [`webflow/head-alias-block.css`](webflow/head-alias-block.css) (or in Webflow Variables once wired) and **every rectangle on the site rounds proportionally**. Circles (`border-radius: 50%`) stay perfect circles — they're not tied to the variable.

---

## Pending Webflow updates

- [x] **Brand blue:** changed `Accent Primary` from `#194bcd` to `#0047FF`
- [ ] **Brand blue hover:** review whether `#3c6ce7` still pairs well with the new `#0047FF`, or pick a darker tone
- [x] **Site background:** standardised on `Neutral Primary` (`#070708`) across all sections; panels inside sections use `Neutral Secondary` for elevation
- [x] **Type scale:** bumped `base-font-size` to `1.0625rem` (17px), `lg` to `1.2rem`, `xl` to `1.3rem`, `eyebrow` to `0.85rem` — addresses the "fonts feel small" feedback
- [x] **Contrast:** body text opacity lifted from `0.72 → 0.88` (dark) and `0.72 → 0.85` (light)
- [x] **Add the alias block** to Project Settings → Custom Code → `<head>` (see [`webflow/head-alias-block.css`](webflow/head-alias-block.css))

---

## Sections roadmap

| # | Section | File | Status |
|---|---|---|---|
| 1 | Intro / Hero | `01-dmc01-intro.html` | DONE |
| 2 | Product (orbital) | `02-dmc01-orbital.html` + external JS | DONE |
| 3 | Solutions (4 outcomes) | `03-dmc01-solutions.html` | DONE |
| 4 | Framework (5-step) | `04-dmc01-framework.html` | DONE |
| 5 | Work with me / testimonials | `05-dmc01-testimonials.html` | DONE |
| 6 | Open a brief / contact | `06-dmc01-contact.html` | DONE |

**Page chrome (no scroll number):**

| File | Status | Notes |
|---|---|---|
| `dmc01-nav.html` | DONE | Sticky header — brand + Start-a-project CTA + Menu dropdown. Hidden until intro scrolls past. |
| `dmc01-footer.html` | DONE | Brand mark + legal links (Terms / Privacy / Cookies) + company registration + copyright. |

---

## Webflow embed workflow

For each section file in `sections/`:

1. **Copy the file's contents** (everything from `<!DOCTYPE html>` to `</html>`)
2. **In Webflow Designer:** drag a Code Embed component (the `</>` icon) into the relevant section
3. **Paste** and save
4. **Publish** to staging. Test in browser. Open DevTools → Console to see init logs (e.g. `[DMC01-orbital] Initialised.`)

### Webflow gotchas

- **Code Embed limit: 50,000 characters per block.** If a section exceeds this, see *External JS hosting* below.
- **Scripts only run on published sites**, NOT in Webflow Designer preview. Publish to staging to test interactivity.
- **The parent section needs `overflow: visible`** for full-bleed (`100vw` breakout) to work.
- **`overflow: hidden` on the parent** will clip our 100vw layouts.

### Section sizes (current)

| Section | Bytes | % of 50k | Notes |
|---|---:|---:|---|
| `01-dmc01-intro.html` | 13,583 | 27% | |
| `02-dmc01-orbital.html` | 33,316 | 67% | JS extracted to Cloudflare |
| `03-dmc01-solutions.html` | 19,631 | 39% | |
| `04-dmc01-framework.html` | 44,733 | 89% | No headroom — extract JS if it grows |
| `05-dmc01-testimonials.html` | 30,688 | 61% | |
| `06-dmc01-contact.html` | 21,340 | 43% | |
| `dmc01-nav.html` | 21,065 | 42% | |
| `dmc01-footer.html` | 8,008 | 16% | |

### External JS hosting (for embeds over 50kB)

When a section's combined HTML/CSS/JS exceeds the limit, extract the JS to a separate file in `webflow/` and reference it from the embed.

**Currently used by:** `02-dmc01-orbital.html` → `webflow/dmc01-orbital.js`

The pattern in the embed:

```html
<!-- LOCAL DEV: relative path resolves directly via Live Server -->
<!-- IN WEBFLOW: replace with the Cloudflare Worker URL -->
<script src="https://dmc01-website.ghaftman.workers.dev/dmc01-orbital.js" defer></script>
```

The Cloudflare Worker (configured in [`wrangler.toml`](wrangler.toml)) serves anything in `webflow/` at the root of `https://dmc01-website.ghaftman.workers.dev/`. The `webflow/` folder prefix is stripped — `webflow/dmc01-orbital.js` becomes `/dmc01-orbital.js`.

**To update an externally-hosted file:** edit it in the repo, commit, push. Cloudflare auto-redeploys (~30 seconds). The embed URL never changes — Cloudflare just serves the new content from the same URL. No re-paste in Webflow needed.

---

## Local development

This repo is git-tracked and previewable via VS Code + Live Server.

### Setup

```bash
# Already done — repo is at github.com/GregHaftman/dmc01-website
git clone https://github.com/GregHaftman/dmc01-website.git
cd dmc01-website
code .
```

Install the **Live Server** VS Code extension. Right-click any HTML file → "Open with Live Server" to preview in a browser with hot reload.

For a full-site scroll preview, open [`sections/00-dmc01-fullsite.html`](sections/00-dmc01-fullsite.html) — it loads all eight section files as same-origin iframes, auto-sizes them to their content, and bridges cross-section events (e.g. `dmc01:openModule` for solutions → orbital deep-linking). Local-only; the live site uses Webflow Embeds, not iframes.

### Note on iCloud

This repo lives in an iCloud-synced folder. Risks:
- iCloud may evict files when storage is low. **Mitigation:** right-click the project folder → "Keep Downloaded".
- Multi-machine `.git/` corruption is rare for solo work but possible. **Mitigation:** push to GitHub regularly so the canonical version is remote-backed.

### Editing with Claude

- **Claude Code** (terminal CLI or VS Code extension) — direct file editing, multi-file refactors. Primary workflow.
- **claude.ai chat** — design-thinking, image upload, brand context. Round-trip via copy-paste.

---

## Decisions log

(Brief audit trail of non-obvious choices, so future-you doesn't relitigate.)

| Date | Decision | Why |
|---|---|---|
| Apr 2026 | Brand blue unified on `#0047FF` (was split between `#3149FF` web, `#0047FF` Figma) | Single source of truth |
| Apr 2026 | Adopted Webflow variables as canonical, embeds inherit | Eliminates duplication, single change propagates everywhere |
| Apr 2026 | Border radius globalised via `--radius-base` (default `2px`); each section derives `--radius-sm` and `--radius-md` | One-knob global radius control. Two-tier proportional approach preserves the 1:2 visual hierarchy. |
| Apr 2026 | Light/dark theme: `data-theme="light"` on `<html>` flips surfaces, text, borders. Brand blue + glow stay (work on both). FOUC-prevention script in each section's `<head>` applies before first paint. State in `localStorage`; respects `prefers-color-scheme` first time. | User wanted both modes. Two-attribute approach is the standard pattern; section-specific gradient overrides flip the hardcoded RGBAs that don't go through the variable system. |
| Apr 2026 | Orbital — centre DMC01 mark is clickable: each click fires an engagement wave (same path the auto-fire uses every 11s). After 7 clicks, an easter-egg popup explains the dot-weight design. | Playable detail; rewards curious clickers without becoming noise. |
| May 2026 | Reframed "Tailored use cases" as **Solutions** (Vercel-inspired Product / Solutions vocabulary). Six use cases consolidated into four broader outcomes (Sell smarter / Bring new offerings to market / Modernise delivery / Get deal-ready). Compact 4-tile grid replaces the editorial vertical-strip layout. | The previous framing was unclear about what "modules" vs "use cases" meant. Product = the toolkit (six modules in the orbital), Solutions = what you achieve (four outcomes that combine modules). The grid layout is also visually distinct from the Framework section's vertical timeline below it. |
| May 2026 | Module 02 (Pricing) preview SVG redesigned: rounded outer container, brand-blue eyebrows + hairlines, pill-shaped values, animated tinted pills for active states, calculated quote panel. | The old design read as a flat table; the new one looks like a real pricing engine UI. |
| May 2026 | Solution-tile chips show module *names* (Pricing, Licensing, Roadmap, Enablement, Packaging, Distribution) instead of numeric codes (`02`, `01`…). Same data-module wiring still opens the matching module. | Numbers needed a mental lookup back to the orbital. Names carry meaning on their own. |
| May 2026 | Orbital pulse tails removed — just dots now | Comet shape was reading as something we'd rather it didn't. |
| May 2026 | Type scale bumped: base `1rem → 1.0625rem`, lg `1.1 → 1.2rem`, xl `1.2 → 1.3rem`, eyebrow `0.8 → 0.85rem`. Contrast lifted: body opacity `0.72 → 0.88` dark, `0.72 → 0.85` light. | Body copy was reading as small + washed grey. Titles untouched so the H-scale isn't disturbed. |
| May 2026 | Testimonials marquee swapped from CSS-transform animation to native `overflow-x: auto` + rAF-driven `scrollLeft`. Click any card → modal with full quote. Cards have fixed 260px height (was min-height) so the long Macrobond quote no longer overflows. | Native scroll lets two-finger trackpad gestures Just Work; the rAF auto-advance pauses for 1.5s after each user gesture and while the modal is open. |
| May 2026 | Orbital JS extracted to `webflow/dmc01-orbital.js`, hosted via Cloudflare Workers Static Assets at `dmc01-website.ghaftman.workers.dev` | The orbital embed was 78kB (over Webflow's 50kB limit) due to the MODULES array + animation code. Webflow Assets blocks `.js` uploads. Tried GitHub Gist Raw (blocked by `nosniff` + `text/plain`), then Statically.io (cold-start 10s on first-of-region). Cloudflare Workers solved both: same Cloudflare we already use for DNS, no new third-party, ~30s git push → live deploy, no embed re-paste required for JS edits. |
| May 2026 | `wrangler.toml` scoped to `directory = "./webflow"` (not repo root) | First deploy with `directory = "."` uploaded the entire repo as public assets — including `.git/`, `.wrangler/cache/`, `.gitignore`, all section sources. Wrangler doesn't honour `.gitignore` for static asset uploads. Scoping to `webflow/` keeps the public surface to exactly the files designed for external reference. |
| May 2026 | Orbital JS scopes its root via `document.querySelector('#dmc01-product')`, not `.section` | Webflow ships its own `.section` class on native components; the original selector was matching one of those wrappers, leaving every `root.querySelector('#orbital')` null and the nodes piled at the centre. |
| May 2026 | Footer padding tightened from 48px to 24px (top/bottom); divider margin from 28px to 18px | Previous footer had ~150px of empty dark space below the bottom row. |

---

## Notes for AI collaborators (Claude, future me)

If you're an instance of Claude opening this repo for the first time:

- The project is **founder-led** — Gregoire is the user. Don't pluralise.
- **Webflow is the source of truth for design tokens.** Don't hard-code colours or font sizes in embeds — use `var(--accent-primary)` etc. Local fallbacks in `brand-tokens.css` are for dev preview only.
- **Webflow Code Embed limit is 50,000 characters.** Track each file's size when editing. Framework is at ~89% — no headroom; extract JS to `webflow/` if it grows. Orbital JS already extracted.
- **For files over 50kB:** put them in `webflow/`. The Cloudflare Worker auto-deploys them on git push to `https://dmc01-website.ghaftman.workers.dev/<filename>`. The embed loads via `<script src=…>`.
- **Brand voice:** confident, direct, slightly understated. No corporate puffery.
- **The user is comfortable with technical detail** but is not a developer by trade. Explain choices and trade-offs; flag when something is "best practice" vs "your call."
- **Push back when you disagree.** The user explicitly values it. Generic agreement is unhelpful.
- **Design language:** dark + Rajdhani + brand blue. Geometric, slightly technical (mono-style labels, corner brackets, status lines). Not playful, not corporate.
