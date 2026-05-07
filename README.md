# DMC01 Website

Webflow embed code, shared design tokens, and external-asset hosting for [dmc01.com](https://dmc01.com).

DMC01 is a founder-led data-monetisation consultancy. This repo holds the custom HTML/CSS/JS pasted into the Webflow site as Code Embed blocks, the shared design system that keeps them coherent, and the static-asset bundle deployed to Cloudflare for files that exceed Webflow's 50kB-per-embed limit.

---

## Repo structure

```
dmc01-website/
├── sections/                          # One file per Webflow Code Embed
│   ├── fullsite-preview.html          # Local-only — stitches all home sections via iframes
│   │
│   ├── home-01-intro.html             # Hero — runway lights + "Data Monetisation Concept"
│   ├── home-02-orbital.html           # Six-module orbital ("Product")
│   ├── home-03-solutions.html         # Four outcomes ("Solutions")
│   ├── home-04-framework.html         # 5-step delivery framework
│   ├── home-05-testimonials.html      # Bio + testimonial marquee ("Work with me")
│   ├── home-06-contact.html           # Contact form ("Open a brief") + reCAPTCHA
│   │
│   ├── chrome-nav.html                # Sticky page header — used on every page
│   ├── chrome-footer.html             # Footer — used on every page
│   │
│   ├── page-pricing.html              # /pricing — three tiers + hourly + how-it-works
│   ├── page-faq.html                  # /faq — 17 questions in 4 thematic groups
│   ├── page-privacy.html              # /privacy-policy
│   ├── page-terms.html                # /terms-of-use
│   └── page-cookies.html              # /cookie-policy
│
├── shared/
│   └── brand-tokens.css               # Local fallback / dev-preview tokens
│
├── webflow/                           # Public via Cloudflare Worker — contents below are reachable at
│   │                                  # https://dmc01-website.ghaftman.workers.dev/<filename>
│   ├── head-alias-block.css           # Pasted into Webflow Project → Custom Code → <head>
│   ├── dmc01-orbital.js               # External JS for the orbital section (~47kB)
│   ├── logo-lockup.svg                # Brand-asset master (mark + DMC01 wordmark)
│   └── portrait.svg                   # Bio portrait — loaded by the testimonials section
│
├── wrangler.toml                      # Cloudflare Workers config — serves webflow/* publicly
├── README.md
└── .gitignore
```

### Naming convention

| Prefix | Meaning |
|---|---|
| `home-NN-…` | Section embedded into the home page in scroll order. NN is the order number (01–06). |
| `chrome-…` | Used on every page (nav, footer). No order number. |
| `page-…` | Standalone Webflow page; the suffix matches the URL slug (`page-faq.html` → `/faq`). |
| `fullsite-preview.html` | Local-only assembly of all home sections via iframes for full-page Live Server preview. Not used by Webflow. |

The `webflow/` folder name is preserved (it's the only folder served publicly by Cloudflare; renaming it would break the deployed worker).

---

## Architecture

The design system lives in **two places** that mirror each other:

1. **Webflow's variable system** (canonical, runtime source of truth) — colours, typography, spacing are defined as Webflow variables. Native Webflow components (navbar, CTAs, headings) consume them automatically.

2. **`shared/brand-tokens.css`** (local fallback) — used when previewing embeds outside Webflow (Live Server). Mirrors the Webflow values so embeds look right in dev.

The bridge is **`webflow/head-alias-block.css`**, which renames Webflow's auto-generated AI-gen variable names (`--ai-gen-…---accent-primary`) to friendly names (`--accent-primary`) site-wide. Once that block is in Webflow's `<head>` Custom Code, embeds use clean variable names that resolve correctly on the live site.

**Net effect:** change a colour or font size in Webflow → every native component AND every embed updates automatically.

### External asset hosting (Cloudflare Workers Static Assets)

Webflow's Code Embed has a **50,000-character limit per block**. The orbital section's JS (~47kB on its own) plus the bio portrait (~8kB SVG) don't fit inside their respective embeds. The `webflow/` folder is served publicly via a Cloudflare Worker with the Static Assets feature:

- This repo is connected to **Cloudflare Workers & Pages → dmc01-website**
- On every push to `main`, Cloudflare auto-deploys
- Files in `webflow/` become reachable at `https://dmc01-website.ghaftman.workers.dev/<filename>`
- The orbital embed loads `dmc01-orbital.js` via `<script src=…>`; the testimonials section loads `portrait.svg` via `<img src=…>`. Both use an inline auto-detect loader: relative `../webflow/<file>` for Live Server, the Cloudflare URL for the Webflow-hosted site.

Configuration lives in [`wrangler.toml`](wrangler.toml). **Only `webflow/` is served publicly**; everything else in the repo (sections, shared, README, `.git/`) stays scoped to GitHub.

---

## Cross-page anchor pattern

Anchor links in `chrome-nav.html` and `chrome-footer.html` are **root-relative**: `/#dmc01-contact`, not `#dmc01-contact`. This matters because the nav and footer appear on every page (Webflow Components):

- From `/`: `/#dmc01-contact` scrolls smoothly to the contact section.
- From `/faq`: `/#dmc01-contact` navigates to home then scrolls to the section.
- A bare `#dmc01-contact` would resolve relative to the current page (`/faq#dmc01-contact`) and 404-anchor.

The "Back to the Top" link and brand-logo link both point to `/` (no anchor) — clean URL on the home page, navigates to home from anywhere else.

---

## Brand tokens

These are the canonical values. They live in Webflow as variables; the alias block exposes them as the names below.

### Colours

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#070708` | Deepest background — used on every section's outer frame |
| `--bg-secondary` | `#161617` | **Panel / card** surfaces — used inside sections for elevated reading |
| `--accent-primary` | `#0047FF` | **Brand Blue** — CTAs, accents, highlights |
| `--accent-primary-hover` | `#3c6ce7` | Hover state for brand blue |
| `--text-primary` | `#FFFFFF` | Body / heading text on dark backgrounds |
| `--text-on-accent-primary` | `#FFFFFF` | Text on blue surfaces (CTAs) |
| `--neutral-inverse` | `#FFFFFF` | White, used as inverse of dark surfaces |
| `--border-secondary` | `rgba(255,255,255,0.15)` | Subtle dividers and panel borders |

### Typography

All typography is **Rajdhani** (300 / 400 / 500 / 600 / 700) — a condensed geometric sans, loaded site-wide via Webflow's Google Fonts integration.

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

Body-text opacity (dark theme): `0.88` for primary body, `0.62` for secondary labels.

### Border radius

Every rectangle (chips, buttons, inputs, panels, modules, cards) reads from `--radius-base`. Default is `2px`. Each section computes two tiers:

| Token | Resolves to | Used for |
|---|---|---|
| `--radius-sm` | `var(--radius-base, 2px)` | Small surfaces — chips, buttons, inputs, pills |
| `--radius-md` | `calc(var(--radius-sm) * 2)` | Larger panels — board panel, framework figures, testimonial cards |

Tweak `--radius-base` in [`webflow/head-alias-block.css`](webflow/head-alias-block.css) (or in Webflow Variables) and **every rectangle on the site rounds proportionally**.

---

## Pages roadmap

### Home page sections

| # | Section | File | Status |
|---|---|---|---|
| 1 | Intro / Hero | `home-01-intro.html` | DONE |
| 2 | Product (orbital) | `home-02-orbital.html` + `webflow/dmc01-orbital.js` | DONE |
| 3 | Solutions (4 outcomes) | `home-03-solutions.html` | DONE |
| 4 | Framework (5-step) | `home-04-framework.html` | DONE |
| 5 | Work with me / testimonials | `home-05-testimonials.html` + `webflow/portrait.svg` | DONE |
| 6 | Open a brief / contact | `home-06-contact.html` (reCAPTCHA wired) | DONE |

### Page chrome (used on every page)

| File | Used for |
|---|---|
| `chrome-nav.html` | Sticky header — brand + Start-a-project CTA + Menu dropdown. Hidden until intro scrolls past on home; visible immediately on other pages. |
| `chrome-footer.html` | Brand mark + legal links + company registration + copyright. |

### Standalone pages

| URL | File | Notes |
|---|---|---|
| `/pricing` | `page-pricing.html` | Three tiers (Focus / Build / Transform) + hourly + collapsible "How it works" |
| `/faq` | `page-faq.html` | 17 questions across 4 groups (What & who / Working with me / Pricing & terms / Getting started) |
| `/privacy-policy` | `page-privacy.html` | UK GDPR notice — 8 sections + TOC |
| `/terms-of-use` | `page-terms.html` | 9 sections + TOC |
| `/cookie-policy` | `page-cookies.html` | 7 sections + TOC + cookie table |

---

## Webflow embed workflow

For each section/page file in `sections/`:

1. **Copy the file's contents** (everything from `<!DOCTYPE html>` to `</html>`)
2. **In Webflow Designer:** drag a Code Embed component (the `</>` icon) into the relevant section
3. **Paste** and save
4. **Publish** to staging. Test in browser. Open DevTools → Console to see init logs (e.g. `[DMC01-orbital] Initialised.`)

### Webflow gotchas

- **Code Embed limit: 50,000 characters per block.** If a file exceeds this, see *External asset hosting* above.
- **Scripts only run on published sites**, NOT in Webflow Designer preview. Publish to staging to test interactivity.
- **The parent section needs `overflow: visible`** for full-bleed (`100vw` breakout) to work.
- **Webflow's site-wide CSS leaks into Code Embed scope** — every section explicitly resets `text-align: left; margin: 0` on titles to neutralise Webflow's heading defaults. Don't drop those resets.
- **CSS leaks across embeds too**, since each embed contributes to the same global stylesheet. Namespace section-specific rules to the section's outer class (`.solutions-section .section-title`, not `.section-title`).

### File sizes (current)

| File | Bytes | % of 50k |
|---|---:|---:|
| `home-01-intro.html` | 25,202 | 50% |
| `home-02-orbital.html` | 36,633 | 73% — JS extracted to Cloudflare |
| `home-03-solutions.html` | 19,927 | 40% |
| `home-04-framework.html` | 44,759 | 90% — **no headroom**; extract JS if it grows |
| `home-05-testimonials.html` | 33,419 | 67% — portrait extracted to Cloudflare |
| `home-06-contact.html` | 31,276 | 63% |
| `chrome-nav.html` | 25,059 | 50% |
| `chrome-footer.html` | 10,165 | 20% |
| `page-pricing.html` | 31,001 | 62% |
| `page-faq.html` | 26,051 | 52% |
| `page-privacy.html` | 18,264 | 37% |
| `page-terms.html` | 16,051 | 32% |
| `page-cookies.html` | 17,588 | 35% |
| `fullsite-preview.html` | 27,739 | (local-only — not embedded) |

### External asset hosting (for embeds over 50kB)

When a section's combined HTML/CSS/JS exceeds the limit, extract heavy assets to `webflow/` and reference via the Cloudflare Worker.

**Currently used by:**
- `home-02-orbital.html` → `webflow/dmc01-orbital.js`
- `home-05-testimonials.html` → `webflow/portrait.svg`

**To update an externally-hosted file:** edit it in the repo, commit, push. Cloudflare auto-redeploys (~30 seconds). The embed URL never changes — Cloudflare serves the new content from the same URL. **No re-paste in Webflow needed for these.**

Each embed uses an inline auto-detect loader so the same file works in both environments without manual URL swapping:

```js
var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
var src = isLocal ? '../webflow/<file>' : 'https://dmc01-website.ghaftman.workers.dev/<file>';
```

---

## Forms + reCAPTCHA wiring (`home-06-contact.html`)

The contact form uses Webflow's native form handling (no third-party endpoint). Submissions land in Project Settings → Forms tab and trigger a notification email to the Webflow account owner.

- **reCAPTCHA v2** is enabled in Project Settings → Forms; site key + secret key are configured there. The contact embed inlines the public site key as `data-sitekey="…"` (Google explicitly marks it public; the secret key stays in Webflow).
- The embed loads Google's `recaptcha/api.js` itself via an idempotent inline script, because Webflow only auto-injects api.js on native form elements — not Code Embed forms.
- Form notification email defaults to the Webflow account owner email (`ghaftman@dmc01.com`).
- A honeypot field (`bot-field`) catches blunt bots that auto-fill every input.

---

## Local development

This repo is git-tracked and previewable via VS Code + Live Server.

### Setup

```bash
git clone https://github.com/GregHaftman/dmc01-website.git
cd dmc01-website
code .
```

Install the **Live Server** VS Code extension. Right-click any HTML file → "Open with Live Server" to preview in a browser with hot reload.

For a full-site scroll preview of the home page, open [`sections/fullsite-preview.html`](sections/fullsite-preview.html) — it loads all six home sections as same-origin iframes, auto-sizes them to their content, and bridges cross-section events (e.g. `dmc01:openModule` for solutions → orbital deep-linking). Local-only; the live site uses Webflow Embeds, not iframes.

### Note on iCloud

This repo lives in an iCloud-synced folder. Risks:
- iCloud may evict files when storage is low. **Mitigation:** right-click the project folder → "Keep Downloaded".
- Multi-machine `.git/` corruption is rare for solo work but possible. **Mitigation:** push to GitHub regularly so the canonical version is remote-backed.

---

## Decisions log

(Brief audit trail of non-obvious choices, so future-you doesn't relitigate.)

| Date | Decision | Why |
|---|---|---|
| Apr 2026 | Brand blue unified on `#0047FF` (was split between `#3149FF` web, `#0047FF` Figma) | Single source of truth |
| Apr 2026 | Adopted Webflow variables as canonical, embeds inherit | Eliminates duplication, single change propagates everywhere |
| Apr 2026 | Border radius globalised via `--radius-base` (default `2px`) | One-knob global radius control |
| Apr 2026 | Light/dark theme: `data-theme="light"` on `<html>` flips surfaces, text, borders. FOUC-prevention script in each section's `<head>` applies before first paint. State in `localStorage`; respects `prefers-color-scheme` first time. | Two-attribute approach is the standard pattern; section-specific overrides flip the hardcoded RGBAs that don't go through the variable system. |
| May 2026 | Reframed "Tailored use cases" as **Solutions**. Six modules collapsed into four outcomes. | Product = the toolkit (six modules), Solutions = what you achieve (four outcomes). |
| May 2026 | Type scale bumped: base `1rem → 1.0625rem`, lg `1.1 → 1.2rem`, xl `1.2 → 1.3rem`, eyebrow `0.8 → 0.85rem`. Body opacity lifted from `0.72 → 0.88` (dark) and `0.72 → 0.85` (light). | Body copy was reading small + washed grey. |
| May 2026 | Testimonials marquee: native `overflow-x: auto` + rAF-driven `scrollLeft`. Click any card → modal with full quote. | Native scroll lets two-finger trackpad gestures Just Work; rAF auto-advance pauses for 1.5s after each user gesture. |
| May 2026 | Orbital JS extracted to `webflow/dmc01-orbital.js`, hosted on Cloudflare Workers Static Assets. Bio portrait extracted to `webflow/portrait.svg`. Both use auto-detect loaders. | Source files exceeded Webflow's 50kB embed limit. Cloudflare was already in the stack for DNS; no new third-party. ~30s git push → live deploy. |
| May 2026 | `wrangler.toml` scoped to `directory = "./webflow"` (not repo root) | First deploy with `directory = "."` uploaded the entire repo as public assets — including `.git/`, all section sources. Wrangler doesn't honour `.gitignore` for static assets. Scoping to `webflow/` keeps the public surface to exactly the files designed for external reference. |
| May 2026 | Combined logo lockup (mark + DMC01 wordmark) replaces separate polyline mark + stacked-text wordmark across nav and footer | One-piece SVG looks more deliberate. Stroke-width 18 in viewBox tuned to match the wordmark glyph stem visual weight. |
| May 2026 | Defensive nav script — each `.dmc01-nav` self-initialises with a `_dmc01Init` flag; `setTheme` is module-level | Webflow Components can render twice (component instance + accidental direct paste); each nav binds its own listeners regardless. |
| May 2026 | Pricing page: three tiers (Focus / Build / Transform) shown with **indicative ranges** (£25-45k / £50-95k / £100-180k+), not "Custom". Plus £300/hr ad-hoc. Day rate £1,750. Cadence: weekly retainer ~2 days/week, calendar follows day count. | Self-qualification beats sticker shock. Ranges anchor without locking. Hidden pricing reads as Big-4 cosplay rather than premium. |
| May 2026 | Pricing "How it works" panel collapsed behind a `<details>` disclosure | Section was visually competing with the tier cards above; collapsing reduces noise while keeping the detail discoverable. |
| May 2026 | Anchors in `chrome-nav.html` + `chrome-footer.html` made root-relative (`/#dmc01-X` not `#dmc01-X`) | Bare `#` anchors resolve relative to the current page URL. From `/faq`, clicking "Open a brief" was hitting `/faq#dmc01-contact` (no such anchor on the FAQ page) instead of bouncing back to home. |
| May 2026 | Section/page files renamed from `NN-dmc01-X.html` mixed convention to `home-NN-X.html` / `chrome-X.html` / `page-X.html` | The old convention mixed numbered home sections with prefixed standalone pages, which was hard to skim. New convention groups files by purpose alphabetically. |

---

## Notes for AI collaborators (Claude, future me)

If you're an instance of Claude opening this repo for the first time:

- The project is **founder-led** — Gregoire is the user. Don't pluralise.
- **Webflow is the source of truth for design tokens.** Don't hard-code colours or font sizes in embeds — use `var(--accent-primary)` etc. Local fallbacks in `brand-tokens.css` are for dev preview only.
- **Webflow Code Embed limit is 50,000 characters.** Track each file's size when editing. Framework is at ~90% — no headroom; extract JS to `webflow/` if it grows. Orbital JS already extracted.
- **Anchor links in nav/footer must be root-relative** (`/#dmc01-X`). Bare `#dmc01-X` resolves to the current page and breaks from non-home pages.
- **Section CSS leaks across embeds.** Namespace section-specific rules (`.foo-section .title`, not `.title`).
- **Brand voice:** confident, direct, slightly understated. No corporate puffery.
- **The user is comfortable with technical detail** but is not a developer by trade. Explain choices and trade-offs; flag when something is "best practice" vs "your call."
- **Push back when you disagree.** The user explicitly values it.

---

## License

Code under MIT, brand and design proprietary to DMC01 Ltd. Full terms in [LICENSE](LICENSE).

## Credits

Built by **Grégoire Haftman** for DMC01 Ltd, with:

- [Webflow](https://webflow.com) — visual editor + hosting
- [Cloudflare Workers](https://workers.cloudflare.com) — static asset hosting (Webflow embed-limit overflow)
- [Claude](https://claude.ai) — architectural collaboration, code review, copy iteration
- [Rajdhani](https://fonts.google.com/specimen/Rajdhani) — typography
- [Figma](https://figma.com) — design system + Open Graph artwork
- [Lucide](https://lucide.dev) — icon set used as reference for inline SVGs

Live site: [**dmc01.com**](https://dmc01.com).
