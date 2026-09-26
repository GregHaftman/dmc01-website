/* =====================================================================
   DMC01 — Product section JS: the "Flux Dial"
   =====================================================================

   Implements "Flux Dial.dc.html" from the Claude Design project
   (claude.ai/design/p/5a11a118-…). Six modules sit on a dial around
   the DMC01 mark. Hovering (or focusing) a module swings the hand to
   it, and brings forward the relationships it takes part in — dots travelling along arcs inside
   the ring. Clicking opens the module's detail (description, sample
   deliverable, what's included) in a modal.

   Replaces webflow/dmc01-orbital.js (the old orbital). Loaded by
   sections/home-02-product.html; served from Cloudflare like the
   orbital was. Everything is scoped to #dmc01-product.

   Kept from the orbital, because other things depend on them:
     • /#m/<slug> deep links (case studies link to these)
     • the `dmc01:openModule` event fired by the Solutions chips
     • the relationship data (FLOWS) — the design's were placeholders
     • the curiosity easter egg: 7 clicks on the mark
   ===================================================================== */
(function() {
  'use strict';

  function init() {
    const root = document.querySelector('#dmc01-product');
    if (!root) return;

/* ============ MODULE DATA ============
   `summary` is the short line from the Flux Dial design (shown under
   the dial on hover); `paragraph`, `preview` and `deliverables` fill
   the modal. Preview SVGs carry classes, not hex values (f-ink,
   f-accent, st-full…), styled from the site tokens in the embed. */
const MODULES = [
  {
    id: '01', summary: 'Define who can use what, where and for how long — licence terms that hold up in negotiation.', code: 'Licensing', title: 'Rights &amp; Licensing Framework', eyebrow: 'Module One',
    icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    paragraph: 'Advisory and review of Master Service Agreements (MSA), order forms, and commercial terms governing data licensing and delivery. Aligns contractual language with monetisation best practice — including modern use cases such as API distribution, downstream access or consumption to derived data, and AI-driven applications with clearly defined permissioning tiers.',
    reportTitle: 'Licensing Framework Review', previewLabel: 'Clause Coverage Matrix',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><rect class="f-p3" x="0" y="0" width="320" height="22"/><text class="f-ink" x="8" y="15" font-weight="700" font-size="8" letter-spacing="0.5">CLAUSE</text><text class="f-ink" x="160" y="15" font-weight="700" font-size="8" letter-spacing="0.5">INDUSTRY</text><text class="f-ink" x="215" y="15" font-weight="700" font-size="8" letter-spacing="0.5">YOUR MSA</text><text class="f-ink" x="270" y="15" font-weight="700" font-size="8" letter-spacing="0.5">STATUS</text><rect class="f-ink" x="0" y="22" width="320" height="28" opacity="0.06"/><text class="f-ink" x="8" y="40" font-size="10">License — Scope</text><rect class="f-accent" x="160" y="32" width="38" height="8"/><rect class="f-ink" x="215" y="32" width="38" height="8" opacity="0.15"/><rect class="f-accent" x="215" y="32" width="38" height="8"/><circle class="st-full" cx="285" cy="36" r="5"/><text class="f-ink" x="8" y="68" font-size="10">License — Post-termination</text><rect class="f-accent" x="160" y="60" width="38" height="8"/><rect class="f-ink" x="215" y="60" width="38" height="8" opacity="0.15"/><rect class="f-accent" x="215" y="60" width="18" height="8"/><circle class="st-part" cx="285" cy="64" r="5"/><rect class="f-ink" x="0" y="78" width="320" height="28" opacity="0.06"/><text class="f-ink" x="8" y="96" font-size="10">Trial - Permitted workflows</text><rect class="f-accent" x="160" y="88" width="38" height="8"/><rect class="f-ink" x="215" y="88" width="38" height="8" opacity="0.15"/><rect class="f-accent" x="215" y="88" width="22" height="8"/><circle class="st-part" cx="285" cy="92" r="5"/><text class="f-ink" x="8" y="124" font-size="10">Service — Use restrictions</text><rect class="f-accent" x="160" y="116" width="38" height="8"/><rect class="f-ink" x="215" y="116" width="38" height="8" opacity="0.15"/><rect class="f-accent" x="215" y="116" width="20" height="8"/><circle class="st-part" cx="285" cy="120" r="5"/><rect class="f-ink" x="0" y="134" width="320" height="28" opacity="0.06"/><text class="f-ink" x="8" y="152" font-size="10">Service — GenAI / LLM</text><rect class="f-accent" x="160" y="144" width="38" height="8"/><rect class="f-ink" x="215" y="144" width="38" height="8" opacity="0.15"/><circle class="st-gap" cx="285" cy="148" r="5"/><text class="f-ink" x="8" y="180" font-size="10">Schedules — Feeds &amp; APIs</text><rect class="f-accent" x="160" y="172" width="38" height="8"/><rect class="f-ink" x="215" y="172" width="38" height="8" opacity="0.15"/><circle class="st-gap" cx="285" cy="176" r="5"/><circle class="st-full" cx="10" cy="218" r="4"/><text class="f-ink" x="20" y="222" font-size="9" opacity="0.75">Covered</text><circle class="st-part" cx="80" cy="218" r="4"/><text class="f-ink" x="90" y="222" font-size="9" opacity="0.75">Partial</text><circle class="st-gap" cx="150" cy="218" r="4"/><text class="f-ink" x="160" y="222" font-size="9" opacity="0.75">Gap</text><text class="f-ink" x="215" y="222" font-size="9" opacity="0.4" font-style="italic">23 clauses · 11 sections</text></svg>`,
    deliverables: ['MSA &amp; order form clause review with redline recommendations','Trial Agreement review and alignement on permitted workflows','AI-use permissioning matrix across data tiers','Redistribution &amp; downstream use framework','Audit-ready entitlement model']
  },
  {
    id: '02', summary: 'Set pricing metrics and tiers that match how clients actually extract value from your data.', code: 'Pricing', title: 'Monetisation Model &amp; Pricing', eyebrow: 'Module Two',
    icon: '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    paragraph: 'Design and assessment of pricing frameworks and commercial models (seat-based, usage-based, enterprise, embedded). Aligns pricing with packaging, segmentation, and real client workflows, from direct data consumption to advanced integration use cases, ensuring models scale as customer utilisation and value creation evolve.',
    reportTitle: 'Monetisation Model &amp; Pricing', previewLabel: 'Pricing Engine',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><rect class="f-p2 s-accent" x="4" y="4" width="312" height="232" rx="8" stroke-opacity="0.4" stroke-width="0.8"/><text class="f-ink" x="14" y="18" font-weight="700" font-size="8" letter-spacing="1.5">DATA FEED PRICING CALCULATOR</text><circle class="f-accent" cx="302" cy="14" r="2.4"><animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite"/></circle><line class="s-ink" x1="14" y1="25" x2="306" y2="25" stroke-opacity="0.1"/><text class="f-accent" x="14" y="38" font-weight="700" font-size="6.5" letter-spacing="1.5">CONTENT SELECTION</text><line class="s-accent" x1="14" y1="42" x2="306" y2="42" stroke-opacity="0.25" stroke-width="0.5"/><text class="f-ink" x="14" y="56" opacity="0.6" font-size="8">Content Set</text><rect class="f-ink" x="238" y="48" width="64" height="12" rx="6" fill-opacity="0.06"/><text class="f-ink" x="270" y="57" text-anchor="middle" font-weight="600" font-size="7.5">Reference Data</text><text class="f-ink" x="14" y="69" opacity="0.6" font-size="8">Security Master</text><rect class="f-ink" x="238" y="61" width="64" height="12" rx="6" fill-opacity="0.06"/><rect class="f-accent" x="238" y="61" width="64" height="12" rx="6" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect class="s-accent" x="238" y="61" width="64" height="12" rx="6" fill="none" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text class="f-ink" x="270" y="70" text-anchor="middle" font-weight="600" font-size="7.5">Dedicated<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-accent" x="270" y="70" text-anchor="middle" font-weight="700" font-size="7.5" opacity="0">Full<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-ink" x="14" y="82" opacity="0.6" font-size="8">Point-in-Time</text><rect class="f-ink" x="238" y="74" width="64" height="12" rx="6" fill-opacity="0.06"/><rect class="f-accent" x="238" y="74" width="64" height="12" rx="6" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect class="s-accent" x="238" y="74" width="64" height="12" rx="6" fill="none" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text class="f-ink" x="270" y="83" text-anchor="middle" font-weight="600" font-size="7.5">No<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-accent" x="270" y="83" text-anchor="middle" font-weight="700" font-size="7.5" opacity="0">Yes<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-ink" x="14" y="95" opacity="0.6" font-size="8">Regional Filter</text><rect class="f-ink" x="238" y="87" width="64" height="12" rx="6" fill-opacity="0.06"/><text class="f-ink" x="270" y="96" text-anchor="middle" font-weight="600" font-size="7.5">EU + UK</text><text class="f-ink" x="14" y="108" opacity="0.6" font-size="8">Add-on Module</text><rect class="f-ink" x="238" y="100" width="64" height="12" rx="6" fill-opacity="0.06"/><text class="f-ink" x="270" y="109" text-anchor="middle" font-weight="600" font-size="7.5">Historical 5y</text><text class="f-accent" x="14" y="124" font-weight="700" font-size="6.5" letter-spacing="1.5">LICENSEE INFORMATION</text><line class="s-accent" x1="14" y1="128" x2="306" y2="128" stroke-opacity="0.25" stroke-width="0.5"/><text class="f-ink" x="14" y="142" opacity="0.6" font-size="8">Client Type</text><rect class="f-ink" x="238" y="134" width="64" height="12" rx="6" fill-opacity="0.06"/><text class="f-ink" x="270" y="143" text-anchor="middle" font-weight="600" font-size="7.5">Asset Manager</text><text class="f-ink" x="14" y="155" opacity="0.6" font-size="8">Licensee</text><rect class="f-ink" x="238" y="147" width="64" height="12" rx="6" fill-opacity="0.06"/><rect class="f-accent" x="238" y="147" width="64" height="12" rx="6" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect class="s-accent" x="238" y="147" width="64" height="12" rx="6" fill="none" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text class="f-ink" x="270" y="156" text-anchor="middle" font-weight="600" font-size="7.5">2 teams<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-accent" x="270" y="156" text-anchor="middle" font-weight="700" font-size="7.5" opacity="0">Enterprise<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-ink" x="14" y="168" opacity="0.6" font-size="8">Workflow Rights</text><rect class="f-ink" x="232" y="160" width="70" height="12" rx="6" fill-opacity="0.06"/><rect class="f-accent" x="232" y="160" width="70" height="12" rx="6" fill-opacity="0"><animate attributeName="fill-opacity" values="0;0;0.2;0.2;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><rect class="s-accent" x="232" y="160" width="70" height="12" rx="6" fill="none" stroke-opacity="0" stroke-width="0.7"><animate attributeName="stroke-opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></rect><text class="f-ink" x="267" y="169" text-anchor="middle" font-weight="600" font-size="7">Internal + Derived<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-accent" x="267" y="169" text-anchor="middle" font-weight="700" font-size="7" opacity="0">Fine-tuning Model<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-accent" x="14" y="184" font-weight="700" font-size="6.5" letter-spacing="1.5">DELIVERY MECHANISM</text><line class="s-accent" x1="14" y1="188" x2="306" y2="188" stroke-opacity="0.25" stroke-width="0.5"/><text class="f-ink" x="14" y="202" opacity="0.6" font-size="8">Technology</text><rect class="f-ink" x="238" y="194" width="64" height="12" rx="6" fill-opacity="0.06"/><text class="f-ink" x="270" y="203" text-anchor="middle" font-weight="600" font-size="7.5">REST API</text><text class="f-ink" x="14" y="215" opacity="0.6" font-size="8">Streaming</text><rect class="f-ink" x="238" y="207" width="64" height="12" rx="6" fill-opacity="0.06"/><text class="f-ink" x="270" y="216" text-anchor="middle" font-weight="600" font-size="7.5">Web Socket</text><rect class="f-accent s-accent" x="14" y="222" width="292" height="12" rx="6" fill-opacity="0.16" stroke-opacity="0.5" stroke-width="0.7"/><text class="f-ink" x="22" y="231" font-weight="700" font-size="8" letter-spacing="0.5">CALCULATED QUOTE</text><text class="f-accent" x="298" y="232" text-anchor="end" font-weight="700" font-size="11" letter-spacing="1.5">$ $<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text><text class="f-accent" x="298" y="232" text-anchor="end" font-weight="700" font-size="11" letter-spacing="1.5" opacity="0">$ $ $ $ $<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite"/></text></svg>`,
    deliverables: ['Pricing framework design across seat / usage / enterprise / embedded','Bespoke workflow rights aligned onto transfer of IP and corresponding premium','Segmentation-driven pricing tiers with elasticity assumptions','Three-year revenue projection scenarios','Discounting guardrails &amp; commercial governance']
  },
  {
    id: '03', summary: 'Identify what matters, prioritise actions, and sequence a roadmap the team can deliver.', code: 'Roadmap', title: 'Product Direction &amp; Roadmap', eyebrow: 'Module Three',
    icon: '<svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    paragraph: 'Strategic input on long-term product development — including prioritisation of data assets, API improvements, and delivery channels to support future scalability and monetisation. Translates business ambition into a sequenced delivery plan with clear trade-offs and dependencies.',
    reportTitle: 'Product Roadmap &amp; Sequencing', previewLabel: '12-Month Roadmap Sequencing',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><line class="s-muted" x1="80" y1="20" x2="80" y2="200" stroke-width="1" opacity="0.2" stroke-dasharray="2,3"/><line class="s-muted" x1="160" y1="20" x2="160" y2="200" stroke-width="1" opacity="0.2" stroke-dasharray="2,3"/><line class="s-muted" x1="240" y1="20" x2="240" y2="200" stroke-width="1" opacity="0.2" stroke-dasharray="2,3"/><text class="f-muted" x="40" y="14" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">Q1</text><text class="f-muted" x="120" y="14" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">Q2</text><text class="f-muted" x="200" y="14" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">Q3</text><text class="f-muted" x="280" y="14" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">Q4</text><rect x="0" y="30" width="120" height="18" class="f-brand" rx="3"/><text x="6" y="42" class="f-onbrand" font-family="Rajdhani" font-weight="600" font-size="9">REST API v2</text><rect class="f-purple" x="60" y="56" width="140" height="18" rx="3"/><text x="66" y="68" class="f-onbrand" font-family="Rajdhani" font-weight="600" font-size="9">Unstructured Dataset GA</text><rect x="120" y="82" width="100" height="18" class="f-brand" rx="3"/><text x="126" y="94" class="f-onbrand" font-family="Rajdhani" font-weight="600" font-size="9">Snowflake listing</text><rect class="f-purple" x="100" y="108" width="180" height="18" rx="3"/><text x="106" y="120" class="f-onbrand" font-family="Rajdhani" font-weight="600" font-size="9">MCP expansion to Unstructured Dataset</text><rect x="180" y="134" width="120" height="18" class="f-brand" rx="3"/><text x="186" y="146" class="f-onbrand" font-family="Rajdhani" font-weight="600" font-size="9">Databricks marketplace</text><rect class="f-purple" x="220" y="160" width="100" height="18" rx="3"/><text x="226" y="172" class="f-onbrand" font-family="Rajdhani" font-weight="600" font-size="9">Streaming endpoints</text><rect x="0" y="220" width="10" height="6" class="f-brand"/><text class="f-ink" x="14" y="225" font-family="Rajdhani" font-size="9" opacity="0.7">Tier 1</text><rect class="f-purple" x="60" y="220" width="10" height="6"/><text class="f-ink" x="74" y="225" font-family="Rajdhani" font-size="9" opacity="0.7">Tier 2</text></svg>`,
    deliverables: ['Roadmap outline with quarterly sequencing','Asset prioritisation matrix (impact × effort × dependency)','Trade-off framework for build / buy / partner decisions','Delivery planning &amp; resource modelling']
  },
  {
    id: '04', summary: 'Give the commercial team the story, the proof and the tools to sell better.', code: 'Enablement', title: 'Value Strategy &amp; Enablement', eyebrow: 'Module Four',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    paragraph: 'Product positioning and value proposition design. Includes review or creation of pitch decks and go-to-market narratives that equip Sales and Pre-Sales teams to articulate the commercial and strategic value of data products to specific buyer personas.',
    reportTitle: 'Value Proposition &amp; Sales Enablement', previewLabel: 'Buyer Persona — Value Mapping',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><rect class="f-p3" x="0" y="0" width="320" height="24"/><text class="f-ink" x="60" y="16" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">PORTFOLIO MGR</text><text class="f-ink" x="160" y="16" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">DATA OFFICER</text><text class="f-ink" x="260" y="16" text-anchor="middle" font-family="Rajdhani" font-weight="600" font-size="10">QUANT LEAD</text><text class="f-muted" x="6" y="42" font-family="Rajdhani" font-weight="600" font-size="9">PAIN</text><rect class="f-p2 s-line" x="10" y="48" width="100" height="40" stroke-width="1"/><text class="f-ink" x="16" y="62" font-family="Rajdhani" font-size="8" opacity="0.85">Inconsistent</text><text class="f-ink" x="16" y="74" font-family="Rajdhani" font-size="8" opacity="0.85">coverage gaps</text><rect class="f-p2 s-line" x="110" y="48" width="100" height="40" stroke-width="1"/><text class="f-ink" x="116" y="62" font-family="Rajdhani" font-size="8" opacity="0.85">Vendor sprawl,</text><text class="f-ink" x="116" y="74" font-family="Rajdhani" font-size="8" opacity="0.85">licensing risk</text><rect class="f-p2 s-line" x="210" y="48" width="100" height="40" stroke-width="1"/><text class="f-ink" x="216" y="62" font-family="Rajdhani" font-size="8" opacity="0.85">Slow API,</text><text class="f-ink" x="216" y="74" font-family="Rajdhani" font-size="8" opacity="0.85">poor docs</text><text class="f-accent" x="6" y="108" font-family="Rajdhani" font-weight="600" font-size="9">VALUE</text><rect class="f-accent s-accent" x="10" y="114" width="100" height="40" opacity="0.18" stroke-width="1"/><text class="f-ink" x="16" y="128" font-family="Rajdhani" font-weight="600" font-size="8">Survivorship-</text><text class="f-ink" x="16" y="140" font-family="Rajdhani" font-weight="600" font-size="8">free history</text><rect class="f-accent s-accent" x="110" y="114" width="100" height="40" opacity="0.18" stroke-width="1"/><text class="f-ink" x="116" y="128" font-family="Rajdhani" font-weight="600" font-size="8">One contract,</text><text class="f-ink" x="116" y="140" font-family="Rajdhani" font-weight="600" font-size="8">audited tiers</text><rect class="f-accent s-accent" x="210" y="114" width="100" height="40" opacity="0.18" stroke-width="1"/><text class="f-ink" x="216" y="128" font-family="Rajdhani" font-weight="600" font-size="8">Sub-100ms</text><text class="f-ink" x="216" y="140" font-family="Rajdhani" font-weight="600" font-size="8">SLA, OpenAPI</text><text class="f-muted" x="6" y="174" font-family="Rajdhani" font-weight="600" font-size="9">PROOF</text><text class="f-ink" x="16" y="190" font-family="Rajdhani" font-size="8" opacity="0.7">25y point-in-time</text><text class="f-ink" x="116" y="190" font-family="Rajdhani" font-size="8" opacity="0.7">SOC2 / GDPR</text><text class="f-ink" x="216" y="190" font-family="Rajdhani" font-size="8" opacity="0.7">99.95% uptime</text><text class="f-accent" x="16" y="220" font-family="Rajdhani" font-size="9" font-weight="600">→ Outperformance</text><text class="f-accent" x="116" y="220" font-family="Rajdhani" font-size="9" font-weight="600">→ Risk reduction</text><text class="f-accent" x="216" y="220" font-family="Rajdhani" font-size="9" font-weight="600">→ Faster signal</text></svg>`,
    deliverables: ['Pitch deck refinement (cover, problem, solution, proof, CTA)','Persona-mapped value propositions with proof points','Sales enablement playbook &amp; objection-handling guide','Discovery question library by buyer role']
  },
  {
    id: '05', summary: 'Turn raw datasets into products buyers can understand, compare and buy.', code: 'Packaging', title: 'Offer Design &amp; Packaging', eyebrow: 'Module Five',
    icon: '<svg viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    paragraph: 'Review or creation of data packaging strategy, ensuring alignment with customer workflows, investment strategies, and commercial models. Covers asset-type bundles, regional groupings, and thematic or cross-asset packages calibrated for clear price/value laddering.',
    reportTitle: 'Offer Design &amp; Packaging Strategy', previewLabel: 'Hybrid Package Architecture',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><path class="s-ink" d="M160 30 V 38 M 85 38 H 235 M 85 38 V 44 M 235 38 V 44 M 85 72 V 80 M 33 80 H 138 M 33 80 V 92 M 68 80 V 92 M 103 80 V 92 M 138 80 V 92 M 235 72 V 80 M 183 80 H 288 M 183 80 V 92 M 218 80 V 92 M 253 80 V 92 M 288 80 V 92 M 33 118 V 126 M 68 118 V 126 M 103 118 V 126 M 138 118 V 126" stroke-opacity="0.35" stroke-width="1" fill="none"/><rect class="f-p3" x="80" y="4" width="160" height="26" rx="13"/><text class="f-ink" x="160" y="22" text-anchor="middle" font-weight="700" font-size="11">Data Feed Products</text><g class="f-accent s-accent" fill-opacity="0.14" stroke-width="1.4"><rect x="15" y="44" width="140" height="28" rx="4"/><rect x="165" y="44" width="140" height="28" rx="4"/></g><g class="f-accent" font-weight="700" font-size="9" text-anchor="middle"><text x="85" y="63">Workflow / Thematic Packages</text><text x="235" y="63">Allowance-based Access</text></g><g class="s-ink" fill="none" stroke-opacity="0.45" stroke-width="0.9"><rect x="18" y="92" width="30" height="26" rx="2.5"/><rect x="53" y="92" width="30" height="26" rx="2.5"/><rect x="88" y="92" width="30" height="26" rx="2.5"/><rect x="123" y="92" width="30" height="26" rx="2.5"/><rect x="168" y="92" width="30" height="26" rx="2.5"/><rect x="203" y="92" width="30" height="26" rx="2.5"/><rect x="238" y="92" width="30" height="26" rx="2.5"/><rect x="273" y="92" width="30" height="26" rx="2.5"/></g><g class="f-ink" font-size="9" font-weight="600" text-anchor="middle"><text x="33" y="109">Pkg 1</text><text x="68" y="109">Pkg 2</text><text x="103" y="109">Pkg 3</text><text x="138" y="109">Pkg 4</text><text x="183" y="109">Band 1</text><text x="218" y="109">Band 2</text><text x="253" y="109">Band 3</text><text x="288" y="109">Band 4</text></g><g class="s-ink" fill="none" stroke-opacity="0.22" stroke-width="0.7"><rect x="18" y="126" width="30" height="18" rx="2"/><rect x="18" y="146" width="30" height="18" rx="2"/><rect x="18" y="166" width="30" height="18" rx="2"/><rect x="18" y="186" width="30" height="18" rx="2"/><rect x="53" y="126" width="30" height="18" rx="2"/><rect x="53" y="146" width="30" height="18" rx="2"/><rect x="53" y="166" width="30" height="18" rx="2"/><rect x="53" y="186" width="30" height="18" rx="2"/><rect x="88" y="126" width="30" height="18" rx="2"/><rect x="88" y="146" width="30" height="18" rx="2"/><rect x="88" y="166" width="30" height="18" rx="2"/><rect x="123" y="126" width="30" height="18" rx="2"/><rect x="123" y="146" width="30" height="18" rx="2"/></g><g class="f-ink" opacity="0.75" font-size="8" text-anchor="middle"><text x="33" y="139">Ds a</text><text x="33" y="159">Ds b</text><text x="33" y="179">Ds c</text><text x="33" y="199">Ds d</text><text x="68" y="139">Ds a</text><text x="68" y="159">Ds b</text><text x="68" y="179">Ds e</text><text x="68" y="199">Ds f</text><text x="103" y="139">Ds a</text><text x="103" y="159">Ds e</text><text x="103" y="179">Ds g</text><text x="138" y="139">Ds e</text><text x="138" y="159">Ds f</text></g></svg>`,
    deliverables: ['Tiered package architecture','Asset-type bundles aligned to buyer workflows','Entity Mastery evaluation','Thematic cross-asset packages','Data Dictionary & Content Methodology guidance','Data-driven evaluation of packaging options']
  },
  {
    id: '06', summary: 'Choose the channels and delivery formats that get data to clients at scale.', code: 'Distribution', title: 'Distribution &amp; Delivery Architecture', eyebrow: 'Module Six',
    icon: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    paragraph: 'Technical and functional advisory on data delivery channels — APIs, file-based delivery, marketplace listings. Includes endpoint specifications, recommended delivery workflows, and architecture for listing on platforms such as Snowflake or Databricks.',
    reportTitle: 'Distribution &amp; Delivery Architecture', previewLabel: 'API Endpoint Specifications',
    preview: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Rajdhani"><rect class="f-p3" x="4" y="4" width="82" height="216" rx="4"/><g class="f-ink"><rect x="22" y="50" width="46" height="6" rx="4" opacity="0.6"/><rect x="22" y="58" width="46" height="6" rx="4" opacity="0.45"/><rect x="22" y="66" width="46" height="6" rx="4" opacity="0.3"/></g><g class="f-ink" font-weight="700" font-size="11" text-anchor="middle"><text x="45" y="105">VENDOR</text><text x="45" y="120">DATABASES</text></g><line class="s-ink" x1="88" y1="112" x2="95" y2="112" stroke-opacity="0.55"/><path class="f-ink" d="M95 108 L99 112 L95 116 Z" fill-opacity="0.55"/><rect class="s-ink" x="100" y="4" width="216" height="216" rx="4" fill="none" stroke-opacity="0.2" stroke-width="0.8"/><rect class="f-accent" x="100" y="4" width="216" height="22" opacity="0.18"/><text class="f-ink" x="110" y="19" font-weight="700" font-size="10" letter-spacing="0.5">REST API · v1.0</text><text class="f-ink" x="306" y="19" text-anchor="end" opacity="0.45" font-weight="500" font-size="7" letter-spacing="0.3">OPENAPI 3.0 · OAUTH2</text><g class="f-asoft"><rect x="108" y="34" width="34" height="12" rx="3"/><rect x="108" y="50" width="34" height="12" rx="3"/><rect x="108" y="66" width="34" height="12" rx="3"/><rect x="108" y="82" width="34" height="12" rx="3"/><rect x="108" y="98" width="34" height="12" rx="3"/></g><rect x="108" y="114" width="34" height="12" rx="3" class="f-psoft"/><g class="f-accent" font-weight="700" font-size="7" letter-spacing="0.4" text-anchor="middle"><text x="125" y="43">GET</text><text x="125" y="59">GET</text><text x="125" y="75">GET</text><text x="125" y="91">GET</text><text x="125" y="107">GET</text><text x="125" y="123" class="f-purple">POST</text></g><g class="f-ink" font-size="9" font-weight="500"><text x="148" y="43">/v1/data</text><text x="148" y="59">/v1/search</text><text x="148" y="75">/v1/metadata</text><text x="148" y="91">/v1/reference</text><text x="148" y="107">/v1/historical</text><text x="148" y="123">/v1/subscribe</text></g><g class="f-ink" opacity="0.55" font-size="7.5" text-anchor="end"><text x="306" y="43">Time-series data</text><text x="306" y="59">Instrument search</text><text x="306" y="75">Field metadata</text><text x="306" y="91">Reference data</text><text x="306" y="107">Point-in-time</text><text x="306" y="123">Open stream</text></g><line class="s-ink" x1="108" y1="148" x2="308" y2="148" stroke-opacity="0.15"/><text class="f-ink" x="208" y="166" text-anchor="middle" opacity="0.4" font-weight="700" font-size="7" letter-spacing="0.4">ALSO AVAILABLE VIA</text><g class="f-accent s-accent" fill-opacity="0.15" stroke-width="1"><rect x="128" y="178" width="70" height="22" rx="4"/><rect x="208" y="178" width="80" height="22" rx="4"/></g><g class="f-accent" font-weight="700" font-size="9" letter-spacing="0.3" text-anchor="middle"><text x="163" y="193">SNOWFLAKE</text><text x="248" y="193">DATABRICKS</text></g></svg>`,
    deliverables: ['OpenAPI endpoint specifications &amp; field-level documentation (pre-requisite for MCP servers)','Snowflake / Databricks marketplace listing specifications','Delivery workflow architecture (real-time / batch / hybrid)','Latency &amp; SLA framework with monitoring approach']
  }
];

/* Deep-link slugs: dmc01.com/#m/<slug> opens that module. */
const SLUG_TO_ID = { licensing: '01', pricing: '02', roadmap: '03', enablement: '04', packaging: '05', distribution: '06' };
const ID_TO_SLUG = Object.fromEntries(Object.entries(SLUG_TO_ID).map(([k, v]) => [v, k]));

/* Relationships between modules (from the orbital). A flow means work
   in one module moves the other; `mutual` = they iterate together.
   s = strength 1–3 → dot density and speed. */
const FLOWS = [
  { f: '05', t: '02', s: 3 },
  { f: '01', t: '02', s: 3, mutual: true },
  { f: '03', t: '06', s: 3, mutual: true },
  { f: '05', t: '04', s: 2 },
  { f: '01', t: '04', s: 2 },
  { f: '02', t: '04', s: 2 },
  { f: '06', t: '02', s: 1 },
  { f: '03', t: '05', s: 1 },
  { f: '01', t: '06', s: 1 },
  { f: '04', t: '03', s: 1 }
];

/* ============ GEOMETRY (design coordinates, 1200 × 680 stage) ============ */
const W = 1200, H = 680;
const CX = 700, CY = 340, R = 220, S = 0.78;
const MC = [191.18, 314.11];                                   // centre of the mark's bounding box — sits on the dial centre
const MOD_DEG = [180, 240, 300, 0, 60, 120];                   // 01 … 06, clockwise from 9 o'clock
const MARK = 'M190.71 265.57 L310.95 148.9 L71.42 148.9 L190.74 479.32 L190.71 265.57 L71.42 148.9';
const NS = 'http://www.w3.org/2000/svg';
const P = (deg, r) => { const q = deg * Math.PI / 180; return [CX + r * Math.cos(q), CY + r * Math.sin(q)]; };
const f1 = n => n.toFixed(1);
const arc = (a0, a1, r) => { const [x0, y0] = P(a0, r), [x1, y1] = P(a1, r); return `M${f1(x0)} ${f1(y0)} A${r} ${r} 0 0 1 ${f1(x1)} ${f1(y1)}`; };
const relArc = (a, b, r) => {
  const d = ((b - a) % 360 + 360) % 360, sweep = d <= 180 ? 1 : 0;
  const [x0, y0] = P(a, r), [x1, y1] = P(b, r);
  return `M${f1(x0)} ${f1(y0)} A${r} ${r} 0 0 ${sweep} ${f1(x1)} ${f1(y1)}`;
};
const idx = id => parseInt(id, 10) - 1;
const plain = html => { const t = document.createElement('textarea'); t.innerHTML = html; return t.value; };

/* ============ BUILD THE DIAL ============ */
const flux = root.querySelector('#flux');
const stageEl = root.querySelector('#fluxStage');
if (!flux || !stageEl) return;

let svg = `<svg class="fx-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
  <defs>
    <linearGradient id="fxSheenGrad" gradientUnits="userSpaceOnUse" x1="-60" y1="0" x2="440" y2="0">
      <stop offset="0" stop-color="#000"/><stop offset=".4" stop-color="#000"/><stop offset=".5" stop-color="#fff"/><stop offset=".6" stop-color="#000"/><stop offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="fxSheenMask" maskUnits="userSpaceOnUse" x="-200" y="-100" width="800" height="800">
      <g transform="rotate(18 190 314)"><rect class="fx-sheen" x="-60" y="-200" width="500" height="1000" fill="url(#fxSheenGrad)"/></g>
    </mask>
  </defs>
  <circle class="fx-ring" cx="${CX}" cy="${CY}" r="${R}"/>
  <g class="fx-bezel">`;
for (let i = 0; i < 60; i++) {
  const long = i % 5 === 0, [x1, y1] = P(i * 6, R + 8), [x2, y2] = P(i * 6, R + (long ? 18 : 12));
  svg += `<line class="fx-tick${long ? ' is-long' : ''}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
}
svg += `</g><g class="fx-rels">`;
const relEls = [];   // { f, t, track, dot }
FLOWS.forEach((r, i) => {
  const rad = 204 - (i % 4) * 8;
  const add = (a, b, rr) => {
    const d = relArc(MOD_DEG[idx(a)], MOD_DEG[idx(b)], rr);
    const dash = `0.5 ${(100 / r.s - 0.5).toFixed(2)}`, dur = (7 - r.s * 1.5) + 's';
    svg += `<path class="fx-track" data-rel="${relEls.length}" d="${d}"/>` +
           `<path class="fx-dot" data-rel="${relEls.length}" d="${d}" pathLength="100" stroke-dasharray="${dash}" style="animation-duration:${dur}"/>`;
    relEls.push({ f: r.f, t: r.t });
  };
  add(r.f, r.t, rad);
  if (r.mutual) add(r.t, r.f, rad - 4);
});
svg += `</g><g class="fx-batons">`;
MOD_DEG.forEach((deg, j) => {
  const [x1, y1] = P(deg, R - 6), [x2, y2] = P(deg, R + 6);
  svg += `<line class="fx-baton" data-j="${j}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
  svg += `<path class="fx-hit" data-j="${j}" d="${arc(deg - 20, deg + 20, R + 20)}"/>`;
});
svg += `</g>
  <g class="fx-hand"><line x1="878" y1="${CY}" x2="938" y2="${CY}"/><rect x="916" y="${CY - 4}" width="8" height="8" transform="rotate(45 920 ${CY})"/></g>
  <g transform="translate(${CX} ${CY}) scale(${S}) translate(${-MC[0]} ${-MC[1]})">
    <g class="fx-mark-g">
      <path class="fx-mark" d="${MARK}"/>
      <g mask="url(#fxSheenMask)"><path class="fx-mark-sheen" d="${MARK}"/></g>
    </g>`;
svg += `<circle class="fx-core-hit" cx="${MC[0]}" cy="${MC[1]}" r="150"/>
  </g>
</svg>`;

/* Labels: HTML buttons positioned in stage coordinates. */
let labels = '';
MODULES.forEach((m, j) => {
  const deg = MOD_DEG[j], cs = Math.cos(deg * Math.PI / 180), sn = Math.sin(deg * Math.PI / 180);
  const side = Math.abs(sn) < 0.2, [lx, ly] = P(deg, side ? R + 62 : R + 58);
  const right = cs > 0, vy = side ? '-50%' : sn > 0 ? '0%' : '-100%';
  labels += `<button type="button" class="fx-label ${right ? 'is-right' : 'is-left'}" data-j="${j}"
      style="left:${f1(lx)}px;top:${f1(ly)}px;transform:translate(${right ? '0' : '-100%'},${vy})"
      aria-label="${plain(m.title)} — open module">
    <span class="fx-bk fx-bk-tl"></span><span class="fx-bk fx-bk-tr"></span><span class="fx-bk fx-bk-bl"></span><span class="fx-bk fx-bk-br"></span>
    <span class="fx-label-n">${m.id}</span>
    <span class="fx-label-t">${m.title}</span>
    <span class="fx-label-cta">Open →</span>
  </button>`;
});
stageEl.innerHTML = svg + labels + `
  <div class="fx-caption" aria-live="polite">
    <span class="fx-caption-n"></span>
    <span class="fx-caption-t"></span>
    <span class="fx-caption-s"></span>
  </div>`;

/* Phone layout: the same six modules as a plain list. */
const list = root.querySelector('#fxList');
if (list) list.innerHTML = MODULES.map(m => `
  <button type="button" class="fx-list-item" data-id="${m.id}">
    <span class="fx-list-icon" aria-hidden="true">${m.icon}</span>
    <span class="fx-list-body">
      <span class="fx-list-n">${m.id}</span>
      <span class="fx-list-t">${m.title}</span>
      <span class="fx-list-s">${m.summary}</span>
    </span>
    <span class="fx-list-cta" aria-hidden="true">→</span>
  </button>`).join('');

/* ============ SCALE THE STAGE TO ITS CONTAINER ============ */
function fit() {
  const s = Math.min(1, flux.clientWidth / W);
  flux.style.setProperty('--s', s.toFixed(4));
}
fit();
window.addEventListener('resize', fit);

/* ============ HOVER STATE ============ */
const q = sel => Array.from(stageEl.querySelectorAll(sel));
const labelEls = q('.fx-label'), batons = q('.fx-baton');
const tracks = q('.fx-track'), dots = q('.fx-dot');
const hand = stageEl.querySelector('.fx-hand');
const capN = stageEl.querySelector('.fx-caption-n'), capT = stageEl.querySelector('.fx-caption-t'), capS = stageEl.querySelector('.fx-caption-s');
let h, handDeg = -90;   // h starts undefined so the first setHover(null) renders the idle caption

function setHover(j) {
  if (j === h) return;
  h = j;
  /* Hand takes the shortest way round to its target. */
  const target = j == null ? -90 : MOD_DEG[j];
  handDeg += ((target - handDeg) % 360 + 540) % 360 - 180;
  hand.style.transform = `rotate(${handDeg}deg)`;
  stageEl.classList.toggle('has-hover', j != null);

  batons.forEach((b, k) => {
    const on = k === j, deg = MOD_DEG[k];
    const [x1, y1] = P(deg, on ? R - 12 : R - 6), [x2, y2] = P(deg, on ? R + 20 : R + 6);
    b.setAttribute('x1', f1(x1)); b.setAttribute('y1', f1(y1)); b.setAttribute('x2', f1(x2)); b.setAttribute('y2', f1(y2));
    b.classList.toggle('is-on', on);
  });
  labelEls.forEach((l, k) => l.classList.toggle('is-on', k === j));
  const id = j == null ? null : MODULES[j].id;
  relEls.forEach((r, i) => {
    const involved = id != null && (r.f === id || r.t === id);
    tracks[i].classList.toggle('is-on', involved);
    dots[i].classList.toggle('is-on', involved);
    dots[i].classList.toggle('is-off', id != null && !involved);
  });

  if (j == null) {
    capN.textContent = 'Modules · 06';
    capT.textContent = 'Six modules, one working business.';
    capS.textContent = 'Hover a module to see what it covers and how it connects to the rest. Click to open it.';
  } else {
    const m = MODULES[j];
    capN.textContent = m.id;
    capT.textContent = plain(m.title);
    capS.textContent = m.summary;
  }
}
setHover(null);

labelEls.concat(q('.fx-hit')).forEach(el => {
  const j = +el.getAttribute('data-j');
  el.addEventListener('mouseenter', () => setHover(j));
  el.addEventListener('focus', () => setHover(j));
  el.addEventListener('click', () => openModule(MODULES[j].id));
});
stageEl.addEventListener('mouseleave', () => setHover(null));
labelEls.forEach(l => l.addEventListener('blur', () => { if (!stageEl.contains(document.activeElement)) setHover(null); }));
stageEl.querySelector('.fx-caption').addEventListener('click', () => { if (h != null) openModule(MODULES[h].id); });
if (list) list.querySelectorAll('.fx-list-item').forEach(b => b.addEventListener('click', () => openModule(b.getAttribute('data-id'))));

/* Pause every loop (bezel, dots, sheen, core) while off-screen. */
if ('IntersectionObserver' in window) {
  new IntersectionObserver(es => flux.classList.toggle('is-paused', !es[0].isIntersecting)).observe(flux);
}

/* While a popup is open: the page behind stays put, and the site nav
   (chrome-nav.html) hides itself via .dmc01-overlay-open so it can't
   sit over the top of the popup. */
function lockPage(on) {
  document.documentElement.style.overflow = on ? 'hidden' : '';
  document.documentElement.classList.toggle('dmc01-overlay-open', on);
}

/* ============ MODAL — the module detail ============ */
const modal = root.querySelector('#fxModal');
const card = modal.querySelector('.fx-modal-card');
const body = modal.querySelector('#fxModalBody');
const switcher = modal.querySelector('#fxModalSwitch');
let current = null, lastFocus = null;

function render(m) {
  body.innerHTML = `
    <div class="fx-modal-head">
      <div class="fx-modal-eyebrow">Module ${m.id} · ${m.code}</div>
      <div class="hero-icon" aria-hidden="true">${m.icon}</div>
    </div>
    <h3 class="fx-modal-title" id="fxModalTitle">${m.title}</h3>
    <p class="hero-paragraph">${m.paragraph}</p>
    <div class="deliverables-block">
      <div class="preview-block">
        <div class="preview-header">
          <div class="preview-eyebrow">Sample deliverable</div>
          <div class="preview-label">${m.previewLabel}</div>
        </div>
        <div class="preview-content">${m.preview}</div>
      </div>
      <div class="deliverables-list-wrap">
        <div class="preview-label">What's included</div>
        <ul class="deliverables-list">${m.deliverables.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>
    </div>`;
  switcher.innerHTML = MODULES.map(o => `<button type="button" class="fx-switch${o.id === m.id ? ' is-active' : ''}" data-id="${o.id}"${o.id === m.id ? ' aria-current="true"' : ''}>${o.code}</button>`).join('');
  switcher.querySelectorAll('.fx-switch').forEach(b => b.addEventListener('click', () => openModule(b.getAttribute('data-id'), true)));
}

function openModule(id, keepScroll) {
  const m = MODULES.find(x => x.id === id);
  if (!m) return;
  if (current == null) lastFocus = document.activeElement;
  current = id;
  render(m);
  card.scrollTop = 0;
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('is-visible');
  lockPage(true);
  const slug = ID_TO_SLUG[id];
  if (slug && location.hash !== '#m/' + slug) history.replaceState(null, '', '#m/' + slug);
  if (!keepScroll) modal.querySelector('.fx-modal-close').focus({ preventScroll: true });
}

function closeModule() {
  if (current == null) return;
  current = null;
  modal.classList.remove('is-visible');
  if (!popup || popup.hidden) lockPage(false);
  setTimeout(() => { if (current == null) modal.hidden = true; }, 250);
  if (/^#m\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}

modal.querySelector('.fx-modal-close').addEventListener('click', closeModule);
modal.querySelector('.fx-modal-backdrop').addEventListener('click', closeModule);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && current != null) closeModule();
  if (current != null && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    const n = (idx(current) + (e.key === 'ArrowRight' ? 1 : 5)) % 6;
    openModule(MODULES[n].id, true);
  }
});

function scrollToDial() {
  const top = flux.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* Solutions chips (another embed) ask for a module by id. */
document.addEventListener('dmc01:openModule', e => {
  const id = e.detail && e.detail.id;
  if (!id) return;
  scrollToDial();
  setTimeout(() => openModule(id), 350);
});

/* Deep links: /#m/<slug> on load and on hash navigation. */
function fromHash() {
  const m = location.hash.match(/^#m\/([a-z]+)$/i);
  return m ? SLUG_TO_ID[m[1].toLowerCase()] : null;
}
window.addEventListener('hashchange', () => {
  const id = fromHash();
  if (id) { scrollToDial(); openModule(id); } else closeModule();
});
if (fromHash()) setTimeout(() => { scrollToDial(); openModule(fromHash()); }, 150);

/* ============ CORE CLICK + CURIOSITY EASTER EGG ============
   Clicking the mark pulses it, fires the sheen and lights every
   relationship for a moment;
   every 7th click, the popup explains what the travelling dots mean
   (it can be re-opened as often as you like). */
const CURIOSITY_THRESHOLD = 7;
let coreClicks = 0;
const popup = root.querySelector('#curiosityPopup');
function showCuriosity() {
  if (!popup) return;
  coreClicks = 0;   // another 7 clicks re-open it after it's closed
  popup.hidden = false;
  void popup.offsetWidth;
  popup.classList.add('is-visible');
  lockPage(true);
}
function hideCuriosity() {
  if (!popup) return;
  popup.classList.remove('is-visible');
  if (current == null) lockPage(false);
  setTimeout(() => { popup.hidden = true; }, 400);
}
if (popup) {
  popup.querySelector('#curiosityClose').addEventListener('click', hideCuriosity);
  popup.querySelector('.curiosity-backdrop').addEventListener('click', hideCuriosity);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !popup.hidden) hideCuriosity(); });
}
const markG = stageEl.querySelector('.fx-mark-g'), sheenRect = stageEl.querySelector('.fx-sheen');
/* Rapid clicks count as double/triple clicks — don't let them select text. */
stageEl.addEventListener('mousedown', e => { if (e.detail > 1) e.preventDefault(); });
stageEl.querySelector('.fx-core-hit').addEventListener('click', () => {
  /* Every click answers: the mark gives a small pulse and the band of
     light sweeps through it straight away. */
  if (markG.animate) {
    markG.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: 0.3 }, { transform: 'scale(1)' }],
      { duration: 520, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' });
    sheenRect.animate([{ transform: 'translateX(-420px)' }, { transform: 'translateX(420px)' }],
      { duration: 1100, easing: 'cubic-bezier(0.45, 0, 0.15, 1)' });
  }
  stageEl.classList.remove('is-charged');
  void stageEl.getBoundingClientRect();
  stageEl.classList.add('is-charged');
  setTimeout(() => stageEl.classList.remove('is-charged'), 1600);
  coreClicks++;
  if (coreClicks >= CURIOSITY_THRESHOLD) setTimeout(showCuriosity, 600);
});

    console.log('[DMC01-product] Flux dial initialised.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
