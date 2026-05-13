/* =====================================================================
   DMC01 — Orbital section JS (hosted on Cloudflare Pages)
   =====================================================================

   WHY THIS FILE EXISTS
   The orbital section embed (sections/02-dmc01-orbital.html) was 78kB,
   above Webflow's 50kB-per-embed limit. The bulk is the MODULES array
   and animation code below. Hosting that here keeps the embed itself
   well under the limit.

   HOW IT'S SERVED IN PRODUCTION
   This repo is connected to Cloudflare Pages. On every push to `main`,
   Pages builds the repo and exposes its files at:
     https://<project>.pages.dev/webflow/dmc01-orbital.js
   The orbital embed in Webflow loads that URL via <script src=…>.
   Cloudflare's global edge serves it with the right Content-Type and
   no cold-start, so reliability rides on the same Cloudflare we
   already use for DNS — no additional third party.

   TO UPDATE
   Edit this file, commit, push. Pages auto-deploys (~30 seconds).
   The embed's <script src> URL never changes — there's no commit
   hash to swap. Cloudflare's cache picks up the new file on next
   request (or use the Pages dashboard to purge if needed).

   LOCAL DEV
   Live Server resolves the relative path `../webflow/dmc01-orbital.js`
   straight to this file, so the orbital works in dev preview without
   any URL swap. The Webflow embed uses the absolute Pages URL; the
   local HTML uses the relative repo path. Both find the same file.

   HISTORY (in case anyone wonders)
   We tried Webflow Assets first — Webflow blocks .js uploads (XSS).
   Then a public GitHub Gist via gist.githubusercontent.com — the Raw
   URL serves Content-Type: text/plain, which strict browsers refuse
   to execute. Then Statically.io (a Gist CDN that rewrites the type)
   — worked, but ~10 s cold-cache fetch on first-of-region. Cloudflare
   Pages is the destination after that detour; no third-party CDN we
   don't already use, no character-by-character URL swap on every
   edit, no cold-start.

   IMPORTANT
   This script scopes all DOM lookups to `document.querySelector('#dmc01-product')`
   — the orbital section's unique ID. We previously used `.section`
   but Webflow ships its own `.section` class on native components,
   so that selector matched a Webflow wrapper instead and every
   `root.querySelector('#orbital')` returned null.
   ===================================================================== */

/* IIFE + DOMContentLoaded for Webflow embed compatibility.
   All DOM lookups are scoped to `root` (the orbital section) so multiple
   embeds on the same page can't collide.
   We anchor on the section's unique ID `#dmc01-product` rather than its
   `.section` class — Webflow ships its own `.section` class on native
   components, and `document.querySelector('.section')` was matching one
   of those wrappers instead of our orbital container, leaving every
   `root.querySelector('#orbital')` lookup null and the nodes piled at
   the centre with no orbit transform applied. */
(function() {
  'use strict';
  function init() {
    const root = document.querySelector('#dmc01-product');
    if (!root) return;

/* ============ MODULE DATA ============
   Note on colours inside `preview` SVGs: these are *illustrative
   replicas* of static client deliverables (chart screenshots, matrices).
   They keep their original calibrated hex values (#0047FF, #194BCD, etc.)
   on purpose — they're content, not chrome. The orbital's chrome
   (storm gradient, pulses, ellipses) reads from CSS variables and
   responds to Webflow overrides; these embedded illustrations don't. */
const MODULES = [
  {
    id: '01', code: 'Licensing', title: 'Rights &amp; Licensing Framework', eyebrow: 'Module One',
    icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    paragraph: 'Advisory and review of Master Service Agreements (MSA), order forms, and commercial terms governing data licensing and delivery. Aligns contractual language with monetisation best practice — including modern use cases such as API distribution, downstream access or consumption to derived data, and AI-driven applications with clearly defined permissioning tiers.',
    reportTitle: 'Licensing Framework Review', previewLabel: 'Clause Coverage Matrix',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><rect x="0" y="0" width="320" height="22" fill="#393939"/><text x="8" y="15" fill="#FFFFFF" font-weight="700" font-size="8" letter-spacing="0.5">CLAUSE</text><text x="160" y="15" fill="#FFFFFF" font-weight="700" font-size="8" letter-spacing="0.5">INDUSTRY</text><text x="215" y="15" fill="#FFFFFF" font-weight="700" font-size="8" letter-spacing="0.5">YOUR MSA</text><text x="270" y="15" fill="#FFFFFF" font-weight="700" font-size="8" letter-spacing="0.5">STATUS</text><rect x="0" y="22" width="320" height="28" fill="#FFFFFF" opacity="0.06"/><text x="8" y="40" fill="#FFFFFF" font-size="10">License — Scope</text><rect x="160" y="32" width="38" height="8" fill="#0047FF"/><rect x="215" y="32" width="38" height="8" fill="#FFFFFF" opacity="0.15"/><rect x="215" y="32" width="38" height="8" fill="#0047FF"/><circle cx="285" cy="36" r="5" fill="#22BB66"/><text x="8" y="68" fill="#FFFFFF" font-size="10">License — Post-termination</text><rect x="160" y="60" width="38" height="8" fill="#0047FF"/><rect x="215" y="60" width="38" height="8" fill="#FFFFFF" opacity="0.15"/><rect x="215" y="60" width="18" height="8" fill="#0047FF"/><circle cx="285" cy="64" r="5" fill="#FF8800"/><rect x="0" y="78" width="320" height="28" fill="#FFFFFF" opacity="0.06"/><text x="8" y="96" fill="#FFFFFF" font-size="10">Trial - Permitted workflows</text><rect x="160" y="88" width="38" height="8" fill="#0047FF"/><rect x="215" y="88" width="38" height="8" fill="#FFFFFF" opacity="0.15"/><rect x="215" y="88" width="22" height="8" fill="#0047FF"/><circle cx="285" cy="92" r="5" fill="#FF8800"/><text x="8" y="124" fill="#FFFFFF" font-size="10">Service — Use restrictions</text><rect x="160" y="116" width="38" height="8" fill="#0047FF"/><rect x="215" y="116" width="38" height="8" fill="#FFFFFF" opacity="0.15"/><rect x="215" y="116" width="20" height="8" fill="#0047FF"/><circle cx="285" cy="120" r="5" fill="#FF8800"/><rect x="0" y="134" width="320" height="28" fill="#FFFFFF" opacity="0.06"/><text x="8" y="152" fill="#FFFFFF" font-size="10">Service — GenAI / LLM</text><rect x="160" y="144" width="38" height="8" fill="#0047FF"/><rect x="215" y="144" width="38" height="8" fill="#FFFFFF" opacity="0.15"/><circle cx="285" cy="148" r="5" fill="#E13838"/><text x="8" y="180" fill="#FFFFFF" font-size="10">Schedules — Feeds &amp; APIs</text><rect x="160" y="172" width="38" height="8" fill="#0047FF"/><rect x="215" y="172" width="38" height="8" fill="#FFFFFF" opacity="0.15"/><circle cx="285" cy="176" r="5" fill="#E13838"/><circle cx="10" cy="218" r="4" fill="#22BB66"/><text x="20" y="222" fill="#FFFFFF" font-size="9" opacity="0.75">Covered</text><circle cx="80" cy="218" r="4" fill="#FF8800"/><text x="90" y="222" fill="#FFFFFF" font-size="9" opacity="0.75">Partial</text><circle cx="150" cy="218" r="4" fill="#E13838"/><text x="160" y="222" fill="#FFFFFF" font-size="9" opacity="0.75">Gap</text><text x="215" y="222" fill="#FFFFFF" font-size="9" opacity="0.4" font-style="italic">23 clauses · 11 sections</text></svg>`,
    deliverables: ['MSA &amp; order form clause review with redline recommendations','Trial Agreement review and alignement on permitted workflows','AI-use permissioning matrix across data tiers','Redistribution &amp; downstream use framework','Audit-ready entitlement model']
  },
  {
    id: '02', code: 'Pricing', title: 'Monetisation Model &amp; Pricing', eyebrow: 'Module Two',
    icon: '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    paragraph: 'Design and assessment of pricing frameworks and commercial models (seat-based, usage-based, enterprise, embedded). Aligns pricing with packaging, segmentation, and real client workflows, from direct data consumption to advanced integration use cases, ensuring models scale as customer utilisation and value creation evolve.',
    reportTitle: 'Monetisation Model &amp; Pricing', previewLabel: 'Pricing Engine',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><rect x="4" y="4" width="312" height="232" rx="8" fill="#1a1a1f" stroke="#0047FF" stroke-opacity="0.4" stroke-width="0.8"/><text x="14" y="18" fill="#FFFFFF" font-weight="700" font-size="8" letter-spacing="1.5">DATA FEED PRICING CALCULATOR</text><circle cx="302" cy="14" r="2.4" fill="#22BB66"><animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite"/></circle><line x1="14" y1="25" x2="306" y2="25" stroke="#FFFFFF" stroke-opacity="0.1"/><text x="14" y="38" fill="#0047FF" font-weight="700" font-size="6.5" letter-spacing="1.5">CONTENT SELECTION</text><line x1="14" y1="42" x2="306" y2="42" stroke="#0047FF" stroke-opacity="0.25" stroke-width="0.5"/><text x="14" y="56" fill="#FFFFFF" opacity="0.6" font-size="8">Content Set</text><rect x="238" y="48" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><text x="270" y="57" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">Reference Data</text><text x="14" y="69" fill="#FFFFFF" opacity="0.6" font-size="8">Security Master</text><rect x="238" y="61" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><rect x="238" y="61" width="64" height="12" rx="6" fill="#0047FF" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect x="238" y="61" width="64" height="12" rx="6" fill="none" stroke="#0047FF" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text x="270" y="70" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">Dedicated<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="270" y="70" text-anchor="middle" fill="#0047FF" font-weight="700" font-size="7.5" opacity="0">Full<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="14" y="82" fill="#FFFFFF" opacity="0.6" font-size="8">Point-in-Time</text><rect x="238" y="74" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><rect x="238" y="74" width="64" height="12" rx="6" fill="#0047FF" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect x="238" y="74" width="64" height="12" rx="6" fill="none" stroke="#0047FF" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text x="270" y="83" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">No<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="270" y="83" text-anchor="middle" fill="#0047FF" font-weight="700" font-size="7.5" opacity="0">Yes<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="14" y="95" fill="#FFFFFF" opacity="0.6" font-size="8">Regional Filter</text><rect x="238" y="87" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><text x="270" y="96" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">EU + UK</text><text x="14" y="108" fill="#FFFFFF" opacity="0.6" font-size="8">Add-on Module</text><rect x="238" y="100" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><text x="270" y="109" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">Historical 5y</text><text x="14" y="124" fill="#0047FF" font-weight="700" font-size="6.5" letter-spacing="1.5">LICENSEE INFORMATION</text><line x1="14" y1="128" x2="306" y2="128" stroke="#0047FF" stroke-opacity="0.25" stroke-width="0.5"/><text x="14" y="142" fill="#FFFFFF" opacity="0.6" font-size="8">Client Type</text><rect x="238" y="134" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><text x="270" y="143" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">Asset Manager</text><text x="14" y="155" fill="#FFFFFF" opacity="0.6" font-size="8">Licensee</text><rect x="238" y="147" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><rect x="238" y="147" width="64" height="12" rx="6" fill="#0047FF" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect x="238" y="147" width="64" height="12" rx="6" fill="none" stroke="#0047FF" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text x="270" y="156" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">2 teams<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="270" y="156" text-anchor="middle" fill="#0047FF" font-weight="700" font-size="7.5" opacity="0">Enterprise<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="14" y="168" fill="#FFFFFF" opacity="0.6" font-size="8">Workflow Rights</text><rect x="232" y="160" width="70" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><rect x="232" y="160" width="70" height="12" rx="6" fill="#0047FF" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect x="232" y="160" width="70" height="12" rx="6" fill="none" stroke="#0047FF" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text x="267" y="169" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7">Internal + Derived<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="267" y="169" text-anchor="middle" fill="#0047FF" font-weight="700" font-size="7" opacity="0">Fine-tuning Model<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="14" y="184" fill="#0047FF" font-weight="700" font-size="6.5" letter-spacing="1.5">DELIVERY MECHANISM</text><line x1="14" y1="188" x2="306" y2="188" stroke="#0047FF" stroke-opacity="0.25" stroke-width="0.5"/><text x="14" y="202" fill="#FFFFFF" opacity="0.6" font-size="8">Technology</text><rect x="238" y="194" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><text x="270" y="203" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">REST API</text><text x="14" y="215" fill="#FFFFFF" opacity="0.6" font-size="8">Streaming</text><rect x="238" y="207" width="64" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.06"/><text x="270" y="216" text-anchor="middle" fill="#FFFFFF" font-weight="600" font-size="7.5">Web Socket</text><rect x="14" y="222" width="292" height="12" rx="6" fill="#0047FF" fill-opacity="0.16" stroke="#0047FF" stroke-opacity="0.5" stroke-width="0.7"/><text x="22" y="231" fill="#FFFFFF" font-weight="700" font-size="8" letter-spacing="0.5">CALCULATED QUOTE</text><text x="298" y="232" text-anchor="end" fill="#0047FF" font-weight="700" font-size="11" letter-spacing="1.5">$ $<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text x="298" y="232" text-anchor="end" fill="#0047FF" font-weight="700" font-size="11" letter-spacing="1.5" opacity="0">$ $ $ $ $<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text></svg>`,
    deliverables: ['Pricing framework design across seat / usage / enterprise / embedded','Bespoke workflow rights aligned onto transfer of IP and corresponding premium','Segmentation-driven pricing tiers with elasticity assumptions','Three-year revenue projection scenarios','Discounting guardrails &amp; commercial governance']
  },
  {
    id: '03', code: 'Roadmap', title: 'Product Direction &amp; Roadmap', eyebrow: 'Module Three',
    icon: '<svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    paragraph: 'Strategic input on long-term product development — including prioritisation of data assets, API improvements, and delivery channels to support future scalability and monetisation. Translates business ambition into a sequenced delivery plan with clear trade-offs and dependencies.',
    reportTitle: 'Product Roadmap &amp; Sequencing', previewLabel: '12-Month Roadmap Sequencing',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><line x1="80" y1="20" x2="80" y2="200" stroke="#999999" stroke-width="1" opacity="0.2" stroke-dasharray="2,3"/><line x1="160" y1="20" x2="160" y2="200" stroke="#999999" stroke-width="1" opacity="0.2" stroke-dasharray="2,3"/><line x1="240" y1="20" x2="240" y2="200" stroke="#999999" stroke-width="1" opacity="0.2" stroke-dasharray="2,3"/><text x="40" y="14" text-anchor="middle" fill="#999999" font-family="Rajdhani" font-weight="600" font-size="10">Q1</text><text x="120" y="14" text-anchor="middle" fill="#999999" font-family="Rajdhani" font-weight="600" font-size="10">Q2</text><text x="200" y="14" text-anchor="middle" fill="#999999" font-family="Rajdhani" font-weight="600" font-size="10">Q3</text><text x="280" y="14" text-anchor="middle" fill="#999999" font-family="Rajdhani" font-weight="600" font-size="10">Q4</text><rect x="0" y="30" width="120" height="18" fill="#0047FF" rx="2"/><text x="6" y="42" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="9">REST API v2</text><rect x="60" y="56" width="140" height="18" fill="#194BCD" rx="2"/><text x="66" y="68" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="9">Unstructured Dataset GA</text><rect x="120" y="82" width="100" height="18" fill="#0047FF" rx="2"/><text x="126" y="94" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="9">Snowflake listing</text><rect x="100" y="108" width="180" height="18" fill="#194BCD" rx="2"/><text x="106" y="120" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="9">MCP expansion to Unstructured Dataset</text><rect x="180" y="134" width="120" height="18" fill="#0047FF" rx="2"/><text x="186" y="146" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="9">Databricks marketplace</text><rect x="220" y="160" width="100" height="18" fill="#194BCD" rx="2"/><text x="226" y="172" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="9">Streaming endpoints</text><rect x="0" y="220" width="10" height="6" fill="#0047FF"/><text x="14" y="225" fill="#FFFFFF" font-family="Rajdhani" font-size="9" opacity="0.7">Tier 1</text><rect x="60" y="220" width="10" height="6" fill="#194BCD"/><text x="74" y="225" fill="#FFFFFF" font-family="Rajdhani" font-size="9" opacity="0.7">Tier 2</text></svg>`,
    deliverables: ['Roadmap outline with quarterly sequencing','Asset prioritisation matrix (impact × effort × dependency)','Trade-off framework for build / buy / partner decisions','Delivery planning &amp; resource modelling']
  },
  {
    id: '04', code: 'Enablement', title: 'Value Strategy &amp; Enablement', eyebrow: 'Module Four',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    paragraph: 'Product positioning and value proposition design. Includes review or creation of pitch decks and go-to-market narratives that equip Sales and Pre-Sales teams to articulate the commercial and strategic value of data products to specific buyer personas.',
    reportTitle: 'Value Proposition &amp; Sales Enablement', previewLabel: 'Buyer Persona — Value Mapping',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="320" height="24" fill="#393939"/><text x="60" y="16" text-anchor="middle" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="10">PORTFOLIO MGR</text><text x="160" y="16" text-anchor="middle" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="10">DATA OFFICER</text><text x="260" y="16" text-anchor="middle" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="10">QUANT LEAD</text><text x="6" y="42" fill="#999999" font-family="Rajdhani" font-weight="600" font-size="9">PAIN</text><rect x="10" y="48" width="100" height="40" fill="#F0F0F5" opacity="0.1" stroke="#194BCD" stroke-width="1"/><text x="16" y="62" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.85">Inconsistent</text><text x="16" y="74" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.85">coverage gaps</text><rect x="110" y="48" width="100" height="40" fill="#F0F0F5" opacity="0.1" stroke="#194BCD" stroke-width="1"/><text x="116" y="62" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.85">Vendor sprawl,</text><text x="116" y="74" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.85">licensing risk</text><rect x="210" y="48" width="100" height="40" fill="#F0F0F5" opacity="0.1" stroke="#194BCD" stroke-width="1"/><text x="216" y="62" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.85">Slow API,</text><text x="216" y="74" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.85">poor docs</text><text x="6" y="108" fill="#0047FF" font-family="Rajdhani" font-weight="600" font-size="9">VALUE</text><rect x="10" y="114" width="100" height="40" fill="#0047FF" opacity="0.18" stroke="#0047FF" stroke-width="1"/><text x="16" y="128" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="8">Survivorship-</text><text x="16" y="140" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="8">free history</text><rect x="110" y="114" width="100" height="40" fill="#0047FF" opacity="0.18" stroke="#0047FF" stroke-width="1"/><text x="116" y="128" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="8">One contract,</text><text x="116" y="140" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="8">audited tiers</text><rect x="210" y="114" width="100" height="40" fill="#0047FF" opacity="0.18" stroke="#0047FF" stroke-width="1"/><text x="216" y="128" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="8">Sub-100ms</text><text x="216" y="140" fill="#FFFFFF" font-family="Rajdhani" font-weight="600" font-size="8">SLA, OpenAPI</text><text x="6" y="174" fill="#999999" font-family="Rajdhani" font-weight="600" font-size="9">PROOF</text><text x="16" y="190" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.7">25y point-in-time</text><text x="116" y="190" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.7">SOC2 / GDPR</text><text x="216" y="190" fill="#FFFFFF" font-family="Rajdhani" font-size="8" opacity="0.7">99.95% uptime</text><text x="16" y="220" fill="#0047FF" font-family="Rajdhani" font-size="9" font-weight="600">→ Outperformance</text><text x="116" y="220" fill="#0047FF" font-family="Rajdhani" font-size="9" font-weight="600">→ Risk reduction</text><text x="216" y="220" fill="#0047FF" font-family="Rajdhani" font-size="9" font-weight="600">→ Faster signal</text></svg>`,
    deliverables: ['Pitch deck refinement (cover, problem, solution, proof, CTA)','Persona-mapped value propositions with proof points','Sales enablement playbook &amp; objection-handling guide','Discovery question library by buyer role']
  },
  {
    id: '05', code: 'Packaging', title: 'Offer Design &amp; Packaging', eyebrow: 'Module Five',
    icon: '<svg viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    paragraph: 'Review or creation of data packaging strategy, ensuring alignment with customer workflows, investment strategies, and commercial models. Covers asset-type bundles, regional groupings, and thematic or cross-asset packages calibrated for clear price/value laddering.',
    reportTitle: 'Offer Design &amp; Packaging Strategy', previewLabel: 'Hybrid Package Architecture',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><path d="M160 30 V 38 M 85 38 H 235 M 85 38 V 44 M 235 38 V 44 M 85 72 V 80 M 33 80 H 138 M 33 80 V 92 M 68 80 V 92 M 103 80 V 92 M 138 80 V 92 M 235 72 V 80 M 183 80 H 288 M 183 80 V 92 M 218 80 V 92 M 253 80 V 92 M 288 80 V 92 M 33 118 V 126 M 68 118 V 126 M 103 118 V 126 M 138 118 V 126" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1" fill="none"/><rect x="80" y="4" width="160" height="26" rx="13" fill="#393939"/><text x="160" y="22" text-anchor="middle" fill="#FFFFFF" font-weight="700" font-size="11">Data Feed Products</text><g fill="#0047FF" fill-opacity="0.14" stroke="#0047FF" stroke-width="1.4"><rect x="15" y="44" width="140" height="28" rx="3"/><rect x="165" y="44" width="140" height="28" rx="3"/></g><g fill="#0047FF" font-weight="700" font-size="9" text-anchor="middle"><text x="85" y="63">Workflow / Thematic Packages</text><text x="235" y="63">Allowance-based Access</text></g><g fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="0.9"><rect x="18" y="92" width="30" height="26" rx="1.5"/><rect x="53" y="92" width="30" height="26" rx="1.5"/><rect x="88" y="92" width="30" height="26" rx="1.5"/><rect x="123" y="92" width="30" height="26" rx="1.5"/><rect x="168" y="92" width="30" height="26" rx="1.5"/><rect x="203" y="92" width="30" height="26" rx="1.5"/><rect x="238" y="92" width="30" height="26" rx="1.5"/><rect x="273" y="92" width="30" height="26" rx="1.5"/></g><g fill="#FFFFFF" font-size="9" font-weight="600" text-anchor="middle"><text x="33" y="109">Pkg 1</text><text x="68" y="109">Pkg 2</text><text x="103" y="109">Pkg 3</text><text x="138" y="109">Pkg 4</text><text x="183" y="109">Band 1</text><text x="218" y="109">Band 2</text><text x="253" y="109">Band 3</text><text x="288" y="109">Band 4</text></g><g fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="0.7"><rect x="18" y="126" width="30" height="18" rx="1"/><rect x="18" y="146" width="30" height="18" rx="1"/><rect x="18" y="166" width="30" height="18" rx="1"/><rect x="18" y="186" width="30" height="18" rx="1"/><rect x="53" y="126" width="30" height="18" rx="1"/><rect x="53" y="146" width="30" height="18" rx="1"/><rect x="53" y="166" width="30" height="18" rx="1"/><rect x="53" y="186" width="30" height="18" rx="1"/><rect x="88" y="126" width="30" height="18" rx="1"/><rect x="88" y="146" width="30" height="18" rx="1"/><rect x="88" y="166" width="30" height="18" rx="1"/><rect x="123" y="126" width="30" height="18" rx="1"/><rect x="123" y="146" width="30" height="18" rx="1"/></g><g fill="#FFFFFF" opacity="0.75" font-size="8" text-anchor="middle"><text x="33" y="139">Ds a</text><text x="33" y="159">Ds b</text><text x="33" y="179">Ds c</text><text x="33" y="199">Ds d</text><text x="68" y="139">Ds a</text><text x="68" y="159">Ds b</text><text x="68" y="179">Ds e</text><text x="68" y="199">Ds f</text><text x="103" y="139">Ds a</text><text x="103" y="159">Ds e</text><text x="103" y="179">Ds g</text><text x="138" y="139">Ds e</text><text x="138" y="159">Ds f</text></g></svg>`,
    deliverables: ['Tiered package architecture','Asset-type bundles aligned to buyer workflows','Entity Mastery evaluation','Thematic cross-asset packages','Data Dictionary & Content Methodology guidance','Data-driven evaluation of packaging options']
  },
  {
    id: '06', code: 'Distribution', title: 'Distribution &amp; Delivery Architecture', eyebrow: 'Module Six',
    icon: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    paragraph: 'Technical and functional advisory on data delivery channels — APIs, file-based delivery, marketplace listings. Includes endpoint specifications, recommended delivery workflows, and architecture for listing on platforms such as Snowflake or Databricks.',
    reportTitle: 'Distribution &amp; Delivery Architecture', previewLabel: 'API Endpoint Specifications',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><rect x="4" y="4" width="82" height="216" rx="3" fill="#393939"/><g fill="#FFFFFF"><rect x="22" y="50" width="46" height="6" rx="3" opacity="0.6"/><rect x="22" y="58" width="46" height="6" rx="3" opacity="0.45"/><rect x="22" y="66" width="46" height="6" rx="3" opacity="0.3"/></g><g fill="#FFFFFF" font-weight="700" font-size="11" text-anchor="middle"><text x="45" y="105">VENDOR</text><text x="45" y="120">DATABASES</text></g><line x1="88" y1="112" x2="95" y2="112" stroke="#FFFFFF" stroke-opacity="0.55"/><path d="M95 108 L99 112 L95 116 Z" fill="#FFFFFF" fill-opacity="0.55"/><rect x="100" y="4" width="216" height="216" rx="3" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="0.8"/><rect x="100" y="4" width="216" height="22" fill="#0047FF" opacity="0.18"/><text x="110" y="19" fill="#FFFFFF" font-weight="700" font-size="10" letter-spacing="0.5">REST API · v1.0</text><text x="306" y="19" text-anchor="end" fill="#FFFFFF" opacity="0.45" font-weight="500" font-size="7" letter-spacing="0.3">OPENAPI 3.0 · OAUTH2</text><g fill="#22BB66"><rect x="108" y="34" width="34" height="12" rx="2"/><rect x="108" y="50" width="34" height="12" rx="2"/><rect x="108" y="66" width="34" height="12" rx="2"/><rect x="108" y="82" width="34" height="12" rx="2"/><rect x="108" y="98" width="34" height="12" rx="2"/></g><rect x="108" y="114" width="34" height="12" rx="2" fill="#FF8800"/><g fill="#FFFFFF" font-weight="700" font-size="7" letter-spacing="0.4" text-anchor="middle"><text x="125" y="43">GET</text><text x="125" y="59">GET</text><text x="125" y="75">GET</text><text x="125" y="91">GET</text><text x="125" y="107">GET</text><text x="125" y="123">POST</text></g><g fill="#FFFFFF" font-size="9" font-weight="500"><text x="148" y="43">/v1/data</text><text x="148" y="59">/v1/search</text><text x="148" y="75">/v1/metadata</text><text x="148" y="91">/v1/reference</text><text x="148" y="107">/v1/historical</text><text x="148" y="123">/v1/subscribe</text></g><g fill="#FFFFFF" opacity="0.55" font-size="7.5" text-anchor="end"><text x="306" y="43">Time-series data</text><text x="306" y="59">Instrument search</text><text x="306" y="75">Field metadata</text><text x="306" y="91">Reference data</text><text x="306" y="107">Point-in-time</text><text x="306" y="123">Open stream</text></g><line x1="108" y1="148" x2="308" y2="148" stroke="#FFFFFF" stroke-opacity="0.15"/><text x="208" y="166" text-anchor="middle" fill="#FFFFFF" opacity="0.4" font-weight="700" font-size="7" letter-spacing="0.4">ALSO AVAILABLE VIA</text><g fill="#0047FF" fill-opacity="0.15" stroke="#0047FF" stroke-width="1"><rect x="128" y="178" width="70" height="22" rx="3"/><rect x="208" y="178" width="80" height="22" rx="3"/></g><g fill="#0047FF" font-weight="700" font-size="9" letter-spacing="0.3" text-anchor="middle"><text x="163" y="193">SNOWFLAKE</text><text x="248" y="193">DATABRICKS</text></g></svg>`,
    deliverables: ['OpenAPI endpoint specifications &amp; field-level documentation (pre-requisite for MCP servers)','Snowflake / Databricks marketplace listing specifications','Delivery workflow architecture (real-time / batch / hybrid)','Latency &amp; SLA framework with monitoring approach']
  }
];

/* ============ MODULE SLUG ROUTING (deep-link via URL fragment) ============
   Maps URL slugs → module IDs so marketing materials can link directly
   to a module's expanded panel.

   Pattern: dmc01.com/#m/<slug>
   Examples: /#m/packaging  → opens module 05
             /#m/pricing    → opens module 02
             /#m/licensing  → opens module 01

   The hash is kept in sync as the user opens/closes panels via the
   in-page controls (setActiveModule / dismissUnfolded), using
   replaceState so we don't pollute browser history.
   ====================================================================== */
const SLUG_TO_ID = {
  licensing:    '01',
  pricing:      '02',
  roadmap:      '03',
  enablement:   '04',
  packaging:    '05',
  distribution: '06'
};
const ID_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_ID).map(([k, v]) => [v, k])
);

function parseModuleHash() {
  const m = location.hash.match(/^#m\/([a-z]+)$/i);
  return m ? SLUG_TO_ID[m[1].toLowerCase()] : null;
}

function setModuleHash(id) {
  const slug = ID_TO_SLUG[id];
  if (!slug) return;
  const newHash = `#m/${slug}`;
  if (location.hash !== newHash) {
    history.replaceState(null, '', newHash);
  }
}

function clearModuleHash() {
  if (parseModuleHash()) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

/* ==========================================================
   ORBITAL CONFIGURATION — single ellipse, six modules at 60°

   All modules share the same ellipse and rotate at the same
   angular speed in the same direction. Relative angular
   distance stays at 60° forever, so they never collide.

   Position assignments (anchored clockwise from top, where the
   sin/cos convention here gives -π/2 = top, π/2 = bottom):
   - 01 top, 02 top-right, 03 bottom-right
   - 04 bottom, 05 bottom-left, 06 top-left
   ========================================================== */
const ORBITS = {
  '01': { rx: 380, ry: 215, phase: -Math.PI/2,   speed: 0.008, dir: +1 },
  '02': { rx: 380, ry: 215, phase: -Math.PI/6,   speed: 0.008, dir: +1 },
  '03': { rx: 380, ry: 215, phase:  Math.PI/6,   speed: 0.008, dir: +1 },
  '04': { rx: 380, ry: 215, phase:  Math.PI/2,   speed: 0.008, dir: +1 },
  '05': { rx: 380, ry: 215, phase:  5*Math.PI/6, speed: 0.008, dir: +1 },
  '06': { rx: 380, ry: 215, phase:  7*Math.PI/6, speed: 0.008, dir: +1 }
};

const FLOWS = [
  // PRIMARY
  { from: '05', to: '02', weight: 1.0, directional: true,  speed: 1800, rate: 1.0 },
  { from: '01', to: '02', weight: 1.0, directional: false, speed: 1600, rate: 1.0 },
  { from: '03', to: '06', weight: 1.0, directional: false, speed: 2000, rate: 0.9 },
  { from: '05', to: '04', weight: 1.0, directional: true,  speed: 2400, rate: 0.7 },
  { from: '01', to: '04', weight: 1.0, directional: true,  speed: 2400, rate: 0.7 },
  { from: '02', to: '04', weight: 1.0, directional: true,  speed: 2400, rate: 0.7 },
  // SECONDARY
  { from: '06', to: '02', weight: 0.6, directional: true,  speed: 2200, rate: 0.4 },
  { from: '03', to: '05', weight: 0.6, directional: true,  speed: 2200, rate: 0.4 },
  { from: '01', to: '06', weight: 0.6, directional: true,  speed: 2200, rate: 0.4 },
  { from: '04', to: '03', weight: 0.6, directional: true,  speed: 2400, rate: 0.3 },
];

/* ==========================================================
   ANIMATION
   ========================================================== */
const VIEWBOX_W = 1200;
const VIEWBOX_H = 720;
const CENTRE_X = VIEWBOX_W / 2;
const CENTRE_Y = VIEWBOX_H / 2;

const orbital = root.querySelector('#orbital');
const orbitalSvg = root.querySelector('#orbitalSvg');
const orbitsGroup = root.querySelector('#orbits');
const pulsesGroup = root.querySelector('#pulses');
const nodes = root.querySelectorAll('.node');

/* Read brand colours from CSS variables so JS-set SVG attributes
   inherit any Webflow override automatically. */
const cs = getComputedStyle(root);
const C_BRAND = cs.getPropertyValue('--brand-blue').trim() || '#0047FF';
const C_ICON  = cs.getPropertyValue('--icon-blue').trim() || '#194BCD';

/* Faint orbital ellipses — drawn once per unique track */
const drawnOrbits = new Set();
Object.entries(ORBITS).forEach(([id, o]) => {
  const key = `${o.rx}-${o.ry}`;
  if (drawnOrbits.has(key)) return;
  drawnOrbits.add(key);

  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', CENTRE_X);
  ellipse.setAttribute('cy', CENTRE_Y);
  ellipse.setAttribute('rx', o.rx);
  ellipse.setAttribute('ry', o.ry);
  ellipse.setAttribute('fill', 'none');
  ellipse.setAttribute('stroke', C_ICON);
  ellipse.setAttribute('stroke-width', '0.5');
  ellipse.setAttribute('stroke-opacity', '0.1');
  ellipse.setAttribute('stroke-dasharray', '2,5');
  orbitsGroup.appendChild(ellipse);
});

const nodePositions = {};

function getNodeScreenPos(id) {
  const o = ORBITS[id];
  const angle = o.phase + (Date.now() / 1000) * o.speed * o.dir;
  return {
    vx: CENTRE_X + o.rx * Math.cos(angle),
    vy: CENTRE_Y + o.ry * Math.sin(angle),
    angle
  };
}

function tick() {
  const svgRect = orbitalSvg.getBoundingClientRect();
  const scaleX = svgRect.width / VIEWBOX_W;
  const scaleY = svgRect.height / VIEWBOX_H;

  /* The icon circle's centre sits about 40px above the node container's
     geometric centre (circle height 80px, margin-top: -80px on container).
     Convert that screen-pixel offset to viewBox units so pulses land on
     the icon, not the gap between icon and text. */
  const ICON_OFFSET_PX = -40;
  const iconOffsetVy = ICON_OFFSET_PX / scaleY;

  nodes.forEach(node => {
    const id = node.getAttribute('data-module');
    const pos = getNodeScreenPos(id);
    const offsetX = (pos.vx - CENTRE_X) * scaleX;
    const offsetY = (pos.vy - CENTRE_Y) * scaleY;
    node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    /* Store the icon-circle centre (where pulses should land), not the container centre */
    nodePositions[id] = { x: pos.vx, y: pos.vy + iconOffsetVy };
  });

  /* Reveal the nodes once they've been moved to their orbit positions.
     Pairs with the `opacity: 0` default in the embed's CSS — keeps the
     section from showing six modules piled at the centre during the
     window between embed render and external-JS execution. */
  if (!orbital.classList.contains('is-positioned')) {
    orbital.classList.add('is-positioned');
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

/* ============ PULSES ============ */
function spawnFlowPulse(flow) {
  const fromPos = nodePositions[flow.from];
  const toPos = nodePositions[flow.to];
  if (!fromPos || !toPos) return;

  let sx, sy, ex, ey, isReverse = false;
  if (flow.directional) {
    sx = fromPos.x; sy = fromPos.y; ex = toPos.x; ey = toPos.y;
  } else {
    if (Math.random() < 0.5) {
      sx = fromPos.x; sy = fromPos.y; ex = toPos.x; ey = toPos.y;
    } else {
      sx = toPos.x; sy = toPos.y; ex = fromPos.x; ey = fromPos.y;
      isReverse = true;
    }
  }

  /* Dot only — no tail. Earlier directional pulses had a short trailing
     line; feedback was that the comet shape read as something we'd rather
     it didn't. Plain circular dots are clearer about "discrete signal". */
  const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pulse.setAttribute('cx', sx);
  pulse.setAttribute('cy', sy);
  pulse.setAttribute('r', flow.weight === 1.0 ? 3.5 : 2.5);
  pulse.setAttribute('fill', C_BRAND);
  pulse.setAttribute('filter', flow.weight === 1.0 ? 'url(#strongGlow)' : 'url(#pulseGlow)');
  pulsesGroup.appendChild(pulse);

  const startTime = Date.now();
  const duration = flow.speed;

  function animate() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const targetId = flow.directional ? flow.to : (isReverse ? flow.from : flow.to);
    const currentTo = nodePositions[targetId];

    if (currentTo) {
      const cx = sx + (currentTo.x - sx) * eased;
      const cy = sy + (currentTo.y - sy) * eased;
      pulse.setAttribute('cx', cx);
      pulse.setAttribute('cy', cy);
      let opacity;
      if (t < 0.15) opacity = t / 0.15;
      else if (t > 0.85) opacity = (1 - t) / 0.15;
      else opacity = 1;
      pulse.setAttribute('opacity', opacity);
    }

    if (t < 1) requestAnimationFrame(animate);
    else { pulse.remove(); }
  }
  requestAnimationFrame(animate);
}

function pulseScheduler() {
  if (root.querySelector('#stage').classList.contains('unfolded')) {
    setTimeout(pulseScheduler, 500);
    return;
  }
  FLOWS.forEach(flow => {
    if (Math.random() < flow.rate * 0.18) spawnFlowPulse(flow);
  });
  setTimeout(pulseScheduler, 280);
}
setTimeout(pulseScheduler, 800);

/* ============ ENGAGEMENT MOMENT ============
   Originates at the centre (logo) — signal emerges from the centre,
   travels through the canonical engagement path, exits at Value & Enablement.
   No ignition flash on the logo itself — the existing ambient halo
   (centreHalo + centreRing) carries the visual heartbeat. */
function engagementMoment() {
  const path = ['CENTRE', '05', '02', '01', '04'];
  let i = 0;

  function getPos(id) {
    if (id === 'CENTRE') return { x: CENTRE_X, y: CENTRE_Y };
    return nodePositions[id];
  }

  function nextHop() {
    if (i >= path.length - 1) return;
    const from = path[i], to = path[i + 1];
    const fromPos = getPos(from), toPos = getPos(to);
    if (!fromPos || !toPos) return;

    const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulse.setAttribute('cx', fromPos.x);
    pulse.setAttribute('cy', fromPos.y);
    pulse.setAttribute('r', from === 'CENTRE' ? 8 : 6);
    pulse.setAttribute('fill', C_BRAND);
    pulse.setAttribute('filter', 'url(#strongGlow)');
    pulsesGroup.appendChild(pulse);

    const start = Date.now();
    const dur = from === 'CENTRE' ? 1700 : 1400;
    const sx = fromPos.x, sy = fromPos.y;

    function step() {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / dur, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const currentTo = getPos(to);
      if (currentTo) {
        pulse.setAttribute('cx', sx + (currentTo.x - sx) * eased);
        pulse.setAttribute('cy', sy + (currentTo.y - sy) * eased);
        let op = t < 0.1 ? t / 0.1 : (t > 0.9 ? (1 - t) / 0.1 : 1);
        pulse.setAttribute('opacity', op);
      }
      if (t < 1) requestAnimationFrame(step);
      else { pulse.remove(); i++; setTimeout(nextHop, 200); }
    }
    requestAnimationFrame(step);
  }
  nextHop();
}

setInterval(() => {
  if (!root.querySelector('#stage').classList.contains('unfolded')) engagementMoment();
}, 11000);

setTimeout(() => {
  if (!root.querySelector('#stage').classList.contains('unfolded')) engagementMoment();
}, 4000);

/* ============ USER-TRIGGERED WAVES + CURIOSITY POPUP ============
   Clicking the centre DMC01 mark fires an engagement wave on
   demand — same path as the auto-fire above, but the user gets
   to *play* with it. The .is-firing class on the wrap gives a
   short tactile pulse, so the click feels mechanical.
   The click is ignored while a module is unfolded (the centre
   isn't visible then anyway).

   Easter egg: after CURIOSITY_THRESHOLD clicks within the same
   session, surface the popup that explains the dot-weight design
   metaphor. Shown once per session — once dismissed, further
   clicks just keep firing waves as before. */
const CURIOSITY_THRESHOLD = 7;
let centreClickCount = 0;
let curiosityShown = false;

const curiosityPopup = root.querySelector('#curiosityPopup');
const curiosityClose = root.querySelector('#curiosityClose');
const curiosityBackdrop = curiosityPopup ? curiosityPopup.querySelector('.curiosity-backdrop') : null;

function showCuriosityPopup() {
  if (!curiosityPopup) return;
  curiosityShown = true;
  curiosityPopup.hidden = false;
  /* Force reflow so the .is-visible transition actually animates. */
  void curiosityPopup.offsetWidth;
  curiosityPopup.classList.add('is-visible');
}
function hideCuriosityPopup() {
  if (!curiosityPopup) return;
  curiosityPopup.classList.remove('is-visible');
  setTimeout(() => { curiosityPopup.hidden = true; }, 400);
}
if (curiosityClose) curiosityClose.addEventListener('click', hideCuriosityPopup);
if (curiosityBackdrop) curiosityBackdrop.addEventListener('click', hideCuriosityPopup);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && curiosityPopup && !curiosityPopup.hidden) hideCuriosityPopup();
});

const centreLogoWrap = root.querySelector('.centre-logo-wrap');
if (centreLogoWrap) {
  centreLogoWrap.addEventListener('click', () => {
    if (root.querySelector('#stage').classList.contains('unfolded')) return;
    centreLogoWrap.classList.remove('is-firing');
    void centreLogoWrap.offsetWidth; /* restart the keyframe */
    centreLogoWrap.classList.add('is-firing');
    engagementMoment();
    centreClickCount++;
    if (!curiosityShown && centreClickCount >= CURIOSITY_THRESHOLD) {
      /* Slight delay so the user sees the engagement wave start
         before the popup steals the spotlight. */
      setTimeout(showCuriosityPopup, 700);
    }
  });
  centreLogoWrap.addEventListener('animationend', () => {
    centreLogoWrap.classList.remove('is-firing');
  });
}

/* ============ HOVER & CLICK ============ */
nodes.forEach(node => {
  const moduleId = node.getAttribute('data-module');
  node.addEventListener('mouseenter', () => orbital.classList.add('has-hover'));
  node.addEventListener('mouseleave', () => orbital.classList.remove('has-hover'));
  node.addEventListener('click', (e) => {
    e.stopPropagation();
    setActiveModule(moduleId);
  });
});

/* ============ UNFOLDED VIEW ============ */
const stage = root.querySelector('#stage');
const heroPanel = root.querySelector('#heroPanel');
const rail = root.querySelector('#rail');
const resetBtn = root.querySelector('#resetBtn');

function renderHero(mod) {
  heroPanel.innerHTML = `
    <div class="hero-icon">${mod.icon}</div>
    <div class="hero-eyebrow">${mod.code}</div>
    <h2 class="hero-title">${mod.title}</h2>
    <p class="hero-paragraph">${mod.paragraph}</p>
    <div class="deliverables-block">
      <div class="preview-block">
        <div class="preview-header">
          <div class="preview-eyebrow">Sample deliverable</div>
          <div class="preview-label">${mod.previewLabel}</div>
        </div>
        <div class="preview-content">${mod.preview}</div>
      </div>
      <div class="deliverables-list-wrap">
        <div class="preview-label">What's included</div>
        <ul class="deliverables-list">${mod.deliverables.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>
    </div>
  `;
}

function renderRail(activeId) {
  /* Always render all 6 modules in canonical order — no filtering.
     The active one is marked with .is-active so it can be styled
     differently and clicks on it become no-ops. */
  rail.innerHTML = MODULES.map(mod => `
    <div class="rail-item ${mod.id === activeId ? 'is-active' : ''}" data-rail-module="${mod.id}">
      <div class="rail-item-head">
        <div class="rail-item-num">${mod.id}</div>
        <div class="rail-item-icon">${mod.icon}</div>
      </div>
      <div class="rail-item-title">${mod.title}</div>
    </div>
  `).join('');

  rail.querySelectorAll('.rail-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation(); /* prevent the click-outside handler from firing */
      const clickedId = item.getAttribute('data-rail-module');
      /* Don't reload if clicking the active one — it's already shown */
      if (clickedId === activeId) return;
      setActiveModule(clickedId);
    });
  });
}

function setActiveModule(id) {
  const mod = MODULES.find(m => m.id === id);
  if (!mod) return;
  renderHero(mod);
  renderRail(id);
  if (!stage.classList.contains('unfolded')) stage.classList.add('unfolded');
  setModuleHash(id);
  const stageTop = stage.getBoundingClientRect().top + window.scrollY - 80;
  if (window.scrollY > stageTop + 200) {
    window.scrollTo({ top: stageTop, behavior: 'smooth' });
  }
}

function dismissUnfolded() {
  stage.classList.remove('unfolded');
  clearModuleHash();
}

resetBtn.addEventListener('click', dismissUnfolded);

/* Click-outside-to-close: any click on the stage that isn't on the
   hero panel, the rail, or the reset button dismisses the unfolded view. */
stage.addEventListener('click', (e) => {
  if (!stage.classList.contains('unfolded')) return;
  /* If the click is inside the hero panel or rail, ignore */
  if (e.target.closest('#heroPanel') || e.target.closest('.rail-column')) return;
  dismissUnfolded();
});

/* Escape key also dismisses */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && stage.classList.contains('unfolded')) {
    dismissUnfolded();
  }
});

/* External trigger: another embed (e.g. dmc01-solutions) can request a
   specific module by dispatching `dmc01:openModule` with { detail: { id } }.
   We always scroll the stage into view here — internal clicks already sit
   on the stage, but external triggers usually originate from a section above. */
document.addEventListener('dmc01:openModule', (e) => {
  const id = e.detail && e.detail.id;
  if (!id || !MODULES.find(m => m.id === id)) return;
  setActiveModule(id);
  const stageTop = stage.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: stageTop, behavior: 'smooth' });
});

/* Hash routing: open a module on initial load if URL has #m/<slug>,
   and respond to browser back/forward + manual hash edits. The hash
   is updated via replaceState from setActiveModule/dismissUnfolded
   (no hashchange fired by replaceState), so this listener only fires
   on real user navigation — no risk of a loop. */
window.addEventListener('hashchange', () => {
  const id = parseModuleHash();
  if (id) {
    setActiveModule(id);
    const stageTop = stage.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: stageTop, behavior: 'smooth' });
  } else if (stage.classList.contains('unfolded')) {
    dismissUnfolded();
  }
});

const initialModuleId = parseModuleHash();
if (initialModuleId) {
  /* Defer slightly so orbital node positions settle (rAF tick) before
     we expand the panel — avoids a visible "jump" on first paint. */
  setTimeout(() => {
    setActiveModule(initialModuleId);
    const stageTop = stage.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: stageTop, behavior: 'smooth' });
  }, 150);
}

    console.log('[DMC01-orbital] Initialised.');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
