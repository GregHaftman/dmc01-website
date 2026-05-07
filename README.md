# DMC01 Website

Source code for [dmc01.com](https://dmc01.com) — a founder-led data-monetisation consultancy.

The site is built on **Webflow** (visual editor + hosting), with custom HTML/CSS/JS pasted into Code Embed blocks. Heavy assets that exceed Webflow's 50 kB-per-embed limit are hosted on **Cloudflare Workers Static Assets** and loaded into the embeds at runtime.

This repo is published publicly for transparency and as an engineering reference. Brand, copy, and design are proprietary to DMC01 Ltd — see [LICENSE](LICENSE).

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
│   ├── page-pricing.html              # /pricing
│   ├── page-faq.html                  # /faq
│   ├── page-privacy.html              # /privacy-policy
│   ├── page-terms.html                # /terms-of-use
│   └── page-cookies.html              # /cookie-policy
│
├── shared/
│   └── brand-tokens.css               # Local fallback / dev-preview tokens
│
├── webflow/                           # Public via Cloudflare Worker — reachable at
│   │                                  # https://dmc01-website.ghaftman.workers.dev/<filename>
│   ├── head-alias-block.css           # Pasted into Webflow Project → Custom Code → <head>
│   ├── dmc01-orbital.js               # External JS for the orbital section (~47 kB)
│   ├── logo-lockup.svg                # Brand-asset master (mark + DMC01 wordmark)
│   └── portrait.svg                   # Bio portrait — loaded by the testimonials section
│
├── wrangler.toml                      # Cloudflare Workers config
├── LICENSE
└── README.md
```

### Naming convention

| Prefix | Meaning |
|---|---|
| `home-NN-…` | Section embedded into the home page in scroll order (NN = 01–06) |
| `chrome-…` | Used on every page (nav, footer) |
| `page-…` | Standalone Webflow page; the suffix matches the URL slug (`page-faq.html` → `/faq`) |
| `fullsite-preview.html` | Local-only assembly of home sections via iframes for full-page preview |

---

## Architecture

The design system lives in **two places** that mirror each other:

1. **Webflow's variable system** (canonical, runtime source of truth) — colours, typography, spacing are defined as Webflow variables. Native Webflow components consume them automatically.

2. **`shared/brand-tokens.css`** (local fallback) — used when previewing embeds outside Webflow. Mirrors the Webflow values so embeds look right in dev.

The bridge is **`webflow/head-alias-block.css`**, which renames Webflow's auto-generated AI-gen variable names (`--ai-gen-…---accent-primary`) to friendly names (`--accent-primary`) site-wide. Once that block is in Webflow's `<head>` Custom Code, embeds use clean variable names that resolve correctly on the live site.

**Net effect:** change a colour or font size in Webflow → every native component AND every embed updates automatically.

### External asset hosting

Webflow's Code Embed has a **50 kB limit per block**. The orbital section's JS (~47 kB) and the bio portrait don't fit inside their respective embeds. The `webflow/` folder is served publicly via a Cloudflare Worker:

- The repo is connected to **Cloudflare Workers & Pages → dmc01-website**
- On every push to `main`, Cloudflare auto-deploys
- Files in `webflow/` become reachable at `https://dmc01-website.ghaftman.workers.dev/<filename>`
- Embeds use an inline auto-detect loader: relative `../webflow/<file>` for Live Server, the Cloudflare URL for the Webflow-hosted site, no manual URL swap on re-paste

Configuration in [`wrangler.toml`](wrangler.toml). **Only `webflow/` is served publicly** — everything else stays scoped to GitHub.

### Cross-page anchor pattern

Anchor links in `chrome-nav.html` and `chrome-footer.html` are **root-relative** (`/#dmc01-contact`, not `#dmc01-contact`). Since the nav and footer appear on every page, a bare `#dmc01-contact` would resolve relative to the current URL (e.g. `/faq#dmc01-contact`) and 404-anchor. Root-relative anchors navigate to home + scroll to the section regardless of where the user clicked from.

---

## Brand tokens

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#070708` | Section background |
| `--bg-secondary` | `#161617` | Panel / card surfaces |
| `--accent-primary` | `#0047FF` | Brand Blue — CTAs, accents |
| `--accent-primary-hover` | `#3c6ce7` | Hover state for brand blue |
| `--text-primary` | `#FFFFFF` | Body / heading text on dark |
| `--border-secondary` | `rgba(255,255,255,0.15)` | Dividers, panel borders |

**Typography:** Rajdhani (300 / 400 / 500 / 600 / 700) loaded via Webflow's Google Fonts integration. Responsive type scale is stored in Webflow Variables and exposed to embeds as `--h1-size`, `--text-lg-size`, etc.

**Border radius:** every rectangle reads from `--radius-base` (default `2 px`). Sections derive `--radius-sm` (= base) and `--radius-md` (= base × 2), so tweaking one variable rounds every rectangle on the site proportionally.

---

## Pages

### Home page sections

| # | Section | File |
|---|---|---|
| 1 | Intro / Hero | `home-01-intro.html` |
| 2 | Product (orbital) | `home-02-orbital.html` + `webflow/dmc01-orbital.js` |
| 3 | Solutions (4 outcomes) | `home-03-solutions.html` |
| 4 | Framework (5-step) | `home-04-framework.html` |
| 5 | Work with me / testimonials | `home-05-testimonials.html` + `webflow/portrait.svg` |
| 6 | Open a brief / contact | `home-06-contact.html` (reCAPTCHA wired) |

### Chrome (used on every page)

| File | Purpose |
|---|---|
| `chrome-nav.html` | Sticky header — brand + Start-a-project CTA + Menu dropdown |
| `chrome-footer.html` | Brand mark + legal links + company registration + copyright |

### Standalone pages

| URL | File |
|---|---|
| `/pricing` | `page-pricing.html` — three tiers (Focus / Build / Transform) + hourly + collapsible "How it works" |
| `/faq` | `page-faq.html` — 17 questions in 4 thematic groups |
| `/privacy-policy` | `page-privacy.html` |
| `/terms-of-use` | `page-terms.html` |
| `/cookie-policy` | `page-cookies.html` |

---

## Webflow embed workflow

For each file in `sections/`:

1. Copy the file's contents (everything from `<!DOCTYPE html>` to `</html>`)
2. In Webflow Designer: drag a Code Embed component (`</>` icon) into the relevant section
3. Paste and save
4. Publish to staging. Test in browser. Console shows init logs (e.g. `[DMC01-orbital] Initialised.`)

### Webflow gotchas worth knowing

- **50 kB embed limit** per block — extract heavy JS/SVG to `webflow/` and load via the Cloudflare Worker.
- **Scripts only run on published sites**, not in Webflow Designer preview. Publish to staging to test interactivity.
- **Webflow's site CSS leaks into Code Embed scope.** Every section explicitly resets `text-align: left; margin: 0` on titles to neutralise Webflow's heading defaults. Don't drop those resets.
- **CSS leaks across embeds too** — namespace section-specific rules to the section's outer class (`.solutions-section .section-title`, not bare `.section-title`).

---

## Forms + reCAPTCHA (`home-06-contact.html`)

- Webflow's native form handling — submissions land in Project Settings → Forms tab and email the account owner.
- reCAPTCHA v2 is enabled in Project Settings → Forms; site key + secret key are configured there.
- The contact embed inlines the public site key as `data-sitekey="…"` (Google explicitly marks site keys public; the secret key stays in Webflow only).
- The embed loads Google's `recaptcha/api.js` itself via an idempotent inline script, because Webflow only auto-injects api.js on native form elements.
- A honeypot field (`bot-field`) catches blunt bots that auto-fill every input.

---

## Local development

```bash
git clone https://github.com/GregHaftman/dmc01-website.git
cd dmc01-website
code .
```

Install the **Live Server** VS Code extension. Right-click any HTML file → "Open with Live Server".

For a full-site scroll preview of the home page, open [`sections/fullsite-preview.html`](sections/fullsite-preview.html) — it loads all six home sections as same-origin iframes, auto-sizes them to their content, and bridges cross-section events. Local-only; the live site uses Webflow Code Embeds.

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
