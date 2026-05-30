#!/usr/bin/env node
// _generate.mjs — Render the 6 per-vertical mini-landings + the /verticals/
// index page from _verticals-data.json. Dark theme matching the suite landing.
//
// Run: node verticals/_generate.mjs

import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("./_verticals-data.json", import.meta.url), "utf8"));

const HEAD = (title, description, canonical) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="theme-color" content="#10b981" />
  <link rel="canonical" href="${canonical}" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <link rel="stylesheet" href="/assets/fonts.css" />
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/verticals/vertical.css" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</head>`;

const NAV = `<header class="nav">
  <div class="nav-inner">
    <a class="brand" href="/">
      <span class="brand-mark">KG</span>
      <span class="brand-text">
        <strong>Kinetic Gain Protocol Suite</strong>
        <small>OPEN AI GOVERNANCE SPECS</small>
      </span>
    </a>
    <nav class="nav-links">
      <a href="/#suite">Specs</a>
      <a href="/verticals/">Verticals</a>
      <a href="/#audit-stream">Audit stream</a>
      <a class="cta" href="https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite">GitHub</a>
    </nav>
  </div>
</header>`;

const FOOTER = `<footer class="footer">
  <div class="footer-inner">
    <p><a href="/">← Back to Suite hub</a> · <a href="/verticals/">All six verticals</a> · <a href="https://github.com/mizcausevic-dev/kg-suite-vertical-comparator/blob/main/docs/CROSS-VERTICAL-COMPARISON.md">Cross-vertical comparison</a></p>
    <p class="footer-fineprint">Per the standing public-language guardrail: <em>readiness · evidence · posture · controls · scaffolding</em> — never "compliant" / "certified" without an external attestation specific to each regulatory regime.</p>
  </div>
</footer>`;

function renderVerticalPage(v) {
  const title = `${v.long_name} — Kinetic Gain Protocol Suite vertical 6-pack`;
  const description = `${v.tagline} Six sibling spec repos for AI tools in ${v.name}. Decision Card vault contract · Incident Card · Evidence Bundle (compliance) · Evidence Bundle (bias) · Operator audit-stream · Operator regulatory-lifecycle tracker. Part of the Kinetic Gain Protocol Suite.`;
  const canonical = `https://suite.kineticgain.com/verticals/${v.code}/`;

  const reposBlocks = v.repos.map((r) => `
    <article class="repo-card">
      <span class="repo-shape">${escapeHtml(r.shape)}</span>
      <h3><a href="https://github.com/mizcausevic-dev/${r.name}"><code>${r.name}</code></a></h3>
      <p>${escapeHtml(r.blurb)}</p>
    </article>`).join("");

  return `${HEAD(title, description, canonical)}
<body class="vertical-page">
${NAV}
<section class="hero vertical-hero">
  <div class="hero-inner">
    <span class="pill">${escapeHtml(v.name)} vertical 6-pack</span>
    <h1>${escapeHtml(v.long_name)}<br /><em>6 sibling specs · 1 canonical shape per artifact</em></h1>
    <p class="lede">${escapeHtml(v.lede)}</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="#repos">See the 6 repos</a>
      <a class="btn btn-secondary" href="/verticals/">All six verticals →</a>
    </div>
  </div>
</section>

<section class="block-dark">
  <div class="block-inner">
    <h2>Regulatory floor</h2>
    <p class="block-lede">${escapeHtml(v.federal_floor)}</p>

    <h3 class="subhead">Canonical example anchored throughout the 6-pack</h3>
    <ul class="canonical-list">
      <li><strong>Buyer:</strong> ${escapeHtml(v.canonical_buyer)}</li>
      <li><strong>Vendor / AI system:</strong> ${escapeHtml(v.canonical_vendor)}</li>
    </ul>

    <h3 class="subhead">Key design innovation vs sibling-vertical equivalents</h3>
    <p>${escapeHtml(v.key_innovation)}</p>
  </div>
</section>

<section id="repos" class="block">
  <div class="block-inner">
    <h2>The six sibling specs</h2>
    <p class="block-lede">Every Kinetic Gain Protocol Suite vertical 6-pack contains exactly these six artifact shapes. The same six shapes appear in every vertical — only the per-vertical content (data categories, regulatory basis, invariants) differs.</p>
    <div class="repo-grid">
      ${reposBlocks}
    </div>
  </div>
</section>

<section class="block-dark">
  <div class="block-inner">
    <h2>Why parallel structure matters</h2>
    <p>A buyer's procurement team operating across mixed regulated verticals — HealthTech AI vendors plus FinTech AI vendors plus HR Tech AI vendors — can apply the same six-shape Suite vocabulary to every vendor in every vertical. The <a href="https://github.com/mizcausevic-dev/kg-suite-vertical-router"><code>kg-suite-vertical-router</code></a> tool routes any artifact to the right vertical's verification logic with one CLI command. The <a href="https://github.com/mizcausevic-dev/kg-suite-vertical-comparator"><code>kg-suite-vertical-comparator</code></a> tool surfaces the SAME-vs-DIFFERENT design contributions across all six verticals as a single reference table.</p>
  </div>
</section>

${FOOTER}
</body>
</html>`;
}

function renderIndexPage() {
  const verticalCards = data.verticals.map((v) => `
    <a class="vertical-card" href="/verticals/${v.code}/">
      <h3>${escapeHtml(v.long_name)}</h3>
      <p class="vertical-card-tagline">${escapeHtml(v.tagline)}</p>
      <p class="vertical-card-buyer"><span>Canonical buyer:</span> ${escapeHtml(v.canonical_buyer)}</p>
      <span class="vertical-card-cta">See the 6 repos →</span>
    </a>`).join("");

  const title = "The Six Vertical 6-Packs — Kinetic Gain Protocol Suite";
  const description = "Six regulated-vertical 6-packs of AI governance specs — HealthTech, EdTech, PropTech / Real Estate, Insurance / InsurTech, HR Tech / Employment AI, FinTech. 36 sibling spec repos. Same six canonical shapes in every vertical; different per-vertical regulatory basis, data categories, and invariants.";
  const canonical = "https://suite.kineticgain.com/verticals/";

  return `${HEAD(title, description, canonical)}
<body class="vertical-index">
${NAV}
<section class="hero">
  <div class="hero-inner">
    <span class="pill">36 sibling spec repos</span>
    <h1>Six Regulated Verticals.<br /><em>One canonical six-shape vocabulary.</em></h1>
    <p class="lede">The Kinetic Gain Protocol Suite ships six vertical 6-packs — HealthTech, EdTech, PropTech / Real Estate, Insurance / InsurTech, HR Tech / Employment AI, and FinTech — each containing the same six canonical artifact shapes (Decision Card vault contract · Incident Card · Evidence Bundle compliance · Evidence Bundle bias · Operator audit-stream · Operator regulatory-lifecycle tracker). Same shape across verticals; different per-vertical regulatory basis, data categories, and invariants. Pick a vertical to explore its 6 sibling specs + canonical example.</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="https://github.com/mizcausevic-dev/kg-suite-vertical-comparator/blob/main/docs/CROSS-VERTICAL-COMPARISON.md">Cross-vertical comparison table</a>
      <a class="btn btn-secondary" href="https://github.com/mizcausevic-dev/kg-suite-vertical-router">Routing tool</a>
    </div>
  </div>
</section>

<section class="block-dark">
  <div class="block-inner">
    <div class="vertical-grid">
      ${verticalCards}
    </div>
  </div>
</section>

<section class="block">
  <div class="block-inner">
    <h2>The six canonical shapes</h2>
    <p>Every vertical 6-pack contains exactly these six artifact shapes:</p>
    <ol class="shape-list">
      <li><strong>Decision Card vault contract</strong> — what tokenized / pseudonymized / cleartext data an AI tool may access</li>
      <li><strong>Incident Card</strong> — consumer-harm event taxonomy + regulator-referral pathway evaluation</li>
      <li><strong>Evidence Bundle (compliance)</strong> — vertical's federal-floor obligation families</li>
      <li><strong>Evidence Bundle (bias)</strong> — pre-deployment + ongoing bias / equity coverage</li>
      <li><strong>Operator audit-stream</strong> — per-decision hash-chained AI-tool-access events</li>
      <li><strong>Operator regulatory-lifecycle tracker</strong> — per-state / per-jurisdiction law lifecycle</li>
    </ol>
  </div>
</section>

${FOOTER}
</body>
</html>`;
}

// Vertical-specific CSS additions (one file shared by all 6 + index)
const VERTICAL_CSS = `/* vertical.css — shared styles for /verticals/* mini-landings */

body.vertical-page,
body.vertical-index {
  background: var(--slate-950);
  color: var(--slate-200);
}

.vertical-hero { padding: 4rem 1.25rem 4rem; }
.vertical-hero h1 { font-size: clamp(1.9rem, 4.5vw, 3.2rem); }
.vertical-hero h1 em { display: inline; font-size: 0.55em; font-style: italic; }

.block, .block-dark {
  padding: 4rem 1.25rem;
}
.block { background: var(--slate-900); color: var(--slate-200); }
.block-dark { background: var(--slate-950); color: var(--slate-200); }
.block-inner { max-width: 1100px; margin: 0 auto; }
.block h2 { color: #fff; font-size: 1.85rem; margin: 0 0 1rem; font-weight: 700; }
.block h3.subhead { color: var(--emerald-400); font-size: 1rem; margin: 2rem 0 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; font-family: var(--font-mono); }
.block-lede { color: var(--slate-300); font-size: 1.05rem; line-height: 1.6; margin: 0 0 1.5rem; }
.block ul, .block ol, .block-dark ul, .block-dark ol { padding-left: 1.5rem; line-height: 1.7; }
.block li, .block-dark li { color: var(--slate-300); margin: 0.4rem 0; }
.block p, .block-dark p { line-height: 1.7; color: var(--slate-300); }

.canonical-list { list-style: none; padding-left: 0; }
.canonical-list li { padding: 0.6rem 0.9rem; background: var(--slate-800); border: 1px solid var(--slate-700); border-radius: 8px; margin: 0.4rem 0; }
.canonical-list li strong { color: var(--emerald-400); }

.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
}
.repo-card {
  background: var(--slate-800);
  border: 1px solid var(--slate-700);
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 120ms ease, transform 120ms ease;
}
.repo-card:hover {
  border-color: var(--emerald-500);
  transform: translateY(-2px);
}
.repo-shape {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--emerald-400);
  font-family: var(--font-mono);
  margin-bottom: 0.6rem;
}
.repo-card h3 { margin: 0 0 0.6rem; font-size: 1rem; }
.repo-card h3 a { color: #fff; text-decoration: none; }
.repo-card h3 a:hover { color: var(--emerald-400); }
.repo-card h3 code { font-family: var(--font-mono); font-size: 0.92rem; color: inherit; background: transparent; padding: 0; }
.repo-card p { margin: 0; font-size: 0.9rem; line-height: 1.55; color: var(--slate-300); }

.vertical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
}
.vertical-card {
  display: block;
  background: var(--slate-800);
  border: 1px solid var(--slate-700);
  border-radius: 12px;
  padding: 1.75rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 120ms ease, transform 120ms ease;
}
.vertical-card:hover { border-color: var(--emerald-500); transform: translateY(-2px); text-decoration: none; }
.vertical-card h3 { color: #fff; font-size: 1.2rem; margin: 0 0 0.6rem; }
.vertical-card-tagline { color: var(--slate-300); font-size: 0.85rem; line-height: 1.5; margin: 0 0 1rem; }
.vertical-card-buyer { color: var(--slate-400); font-size: 0.85rem; margin: 0 0 1rem; }
.vertical-card-buyer span { color: var(--emerald-400); font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
.vertical-card-cta { color: var(--emerald-400); font-weight: 600; font-size: 0.95rem; }

.shape-list { color: var(--slate-300); font-size: 1rem; }
.shape-list strong { color: var(--emerald-400); }

.footer {
  background: var(--slate-950);
  border-top: 1px solid var(--slate-800);
  padding: 2.5rem 1.25rem;
  color: var(--slate-400);
  text-align: center;
}
.footer-inner { max-width: 900px; margin: 0 auto; }
.footer p { margin: 0.5rem 0; }
.footer a { color: var(--emerald-400); }
.footer-fineprint { font-size: 0.8rem; color: var(--slate-500); }
`;

function escapeHtml(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Write the per-vertical pages
for (const v of data.verticals) {
  const html = renderVerticalPage(v);
  const outPath = new URL(`./${v.code}/index.html`, import.meta.url);
  writeFileSync(outPath, html, "utf8");
  console.log(`wrote verticals/${v.code}/index.html (${html.length} chars)`);
}

// Index page
writeFileSync(new URL("./index.html", import.meta.url), renderIndexPage(), "utf8");
console.log("wrote verticals/index.html");

// Shared CSS
writeFileSync(new URL("./vertical.css", import.meta.url), VERTICAL_CSS, "utf8");
console.log("wrote verticals/vertical.css");
