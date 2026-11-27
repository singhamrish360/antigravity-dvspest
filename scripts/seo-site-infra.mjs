/**
 * Site-wide SEO infra applied after prerender.
 * Does not edit page templates. Safe to run on top of a sitemap that later
 * gains more URLs (e.g. pest-control landing pages).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://pestcontrolinfra.co.in';
const DRAWINGS = `${SITE}/drawings`;
const HINDI = `${SITE}/drawings/ghar-ka-naksha`;
const OG_DRAWINGS = `${SITE}/og-drawings.jpg`;
const today = new Date().toISOString().slice(0, 10);

const findIndexNowKey = () => {
  const pub = path.join(root, 'public');
  const names = fs.readdirSync(pub).filter((name) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(name));
  for (const name of names) {
    if (['robots.txt', 'llms.txt', 'llms-full.txt'].includes(name)) continue;
    const body = fs.readFileSync(path.join(pub, name), 'utf8').trim();
    const stem = name.replace(/\.txt$/, '');
    if (body === stem) return stem;
  }
  throw new Error('IndexNow key file not found in public/');
};

const upsertMeta = (html, attr, key, value) => {
  const pattern = new RegExp(`<meta[^>]*${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${value}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
};

const ensureLink = (html, rel, extraAttr, href) => {
  if (html.includes(`hreflang="${extraAttr}"`) && html.includes(href)) return html;
  const tag = extraAttr
    ? `<link rel="${rel}" hreflang="${extraAttr}" href="${href}" />`
    : `<link rel="${rel}" href="${href}" />`;
  if (html.includes(tag)) return html;
  return html.replace('</head>', `    ${tag}\n  </head>`);
};

const enhanceHtmlPage = (filePath, { hreflang, ogImage, ogLocale } = {}) => {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');
  if (ogImage) {
    html = upsertMeta(html, 'property', 'og:image', ogImage);
    html = upsertMeta(html, 'property', 'og:image:width', '1200');
    html = upsertMeta(html, 'property', 'og:image:height', '630');
    html = upsertMeta(html, 'property', 'og:image:alt', 'DVS house plan and 3D elevation drawings');
    html = upsertMeta(html, 'name', 'twitter:image', ogImage);
    html = upsertMeta(html, 'name', 'twitter:image:alt', 'DVS house plan and 3D elevation drawings');
  }
  if (ogLocale) {
    html = upsertMeta(html, 'property', 'og:locale', ogLocale);
  }
  if (hreflang) {
    html = ensureLink(html, 'alternate', 'en', DRAWINGS);
    html = ensureLink(html, 'alternate', 'hi', HINDI);
    html = ensureLink(html, 'alternate', 'x-default', DRAWINGS);
  }
  fs.writeFileSync(filePath, html);
  return true;
};

const walkDrawingsHtml = (dir, visit) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDrawingsHtml(full, visit);
    else if (entry.name === 'index.html') visit(full);
  }
};

// 1) Hreflang + OG card on prerendered drawings pages
const drawingsRoot = path.join(root, 'dist/drawings');
walkDrawingsHtml(drawingsRoot, (filePath) => {
  const rel = path.relative(path.join(root, 'dist'), path.dirname(filePath)).replace(/\\/g, '/');
  const isHindi = rel === 'drawings/ghar-ka-naksha';
  const isHub = rel === 'drawings';
  enhanceHtmlPage(filePath, {
    hreflang: isHindi || isHub,
    ogImage: OG_DRAWINGS,
    ogLocale: isHindi ? 'hi_IN' : 'en_IN',
  });
});
console.log('enhanced prerendered drawings pages');

// 2) Sitemap: add lastmod; add xhtml hreflang on the language pair
const sitemapPath = path.join(root, 'dist/sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  throw new Error('dist/sitemap.xml missing; run prerender first');
}
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes('xmlns:xhtml')) {
  sitemap = sitemap.replace(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  );
}
if (!/<lastmod>/.test(sitemap)) {
  sitemap = sitemap.replace(/<\/loc>\n/g, `</loc>\n    <lastmod>${today}</lastmod>\n`);
}

const hreflangBlock = `    <xhtml:link rel="alternate" hreflang="en" href="${DRAWINGS}" />
    <xhtml:link rel="alternate" hreflang="hi" href="${HINDI}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${DRAWINGS}" />`;

const injectHreflangOn = (xml, loc) => {
  const pattern = new RegExp(
    `(<url>\\s*<loc>${loc.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}<\\/loc>[\\s\\S]*?)(\\s*<\\/url>)`,
  );
  return xml.replace(pattern, (full, body, close) => {
    if (body.includes('xhtml:link')) return full;
    return `${body}\n${hreflangBlock}${close}`;
  });
};

sitemap = injectHreflangOn(sitemap, DRAWINGS);
sitemap = injectHreflangOn(sitemap, HINDI);
fs.writeFileSync(sitemapPath, sitemap);
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap);
const locCount = (sitemap.match(/<loc>/g) || []).length;
console.log(`enhanced sitemap with lastmod and hreflang (${locCount} URLs)`);

// 3) llms-full.txt from the sitemap plus route titles when present
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const titles = new Map();
const routesFile = path.join(root, 'src/seo/routes-data.json');
if (fs.existsSync(routesFile)) {
  const routes = JSON.parse(fs.readFileSync(routesFile, 'utf8'));
  for (const route of routes) {
    if (route.path && route.title) titles.set(`${SITE}${route.path}`, route.title);
  }
}
titles.set(`${SITE}/`, 'DVS Pest Control | Lucknow — pest control for homes and businesses');
titles.set(DRAWINGS, 'House plan and 3D elevation drawing services in India');
titles.set(HINDI, 'घर का नक्शा / मकान का नक्शा');

const lineFor = (url) => {
  const title = titles.get(url);
  return title ? `- [${title}](${url})` : `- [${url.replace(SITE, '') || '/'}](${url})`;
};

const home = locs.filter((u) => u === `${SITE}/` || u === SITE);
const drawings = locs.filter((u) => u.includes('/drawings')).sort();
const other = locs.filter((u) => !home.includes(u) && !drawings.includes(u));

const llmsFull = `# DVS Pest Control Infrastructure Co

> A Lucknow business with two public services: pest control in Lucknow and Uttar Pradesh, and online house-drawing (AutoCAD) work delivered anywhere in India.

The website is ${SITE}
Contact: +91 93304 78897 (call or WhatsApp). Email: dvsinfrapest@gmail.com
Short summary: ${SITE}/llms.txt
Sitemap: ${SITE}/sitemap.xml

## Pest control

- [DVS Pest Control | Lucknow](${SITE}/)
- Pest control for homes and businesses in Lucknow and Uttar Pradesh, including cockroach, termite, rodent, mosquito and related treatments.
- Call or WhatsApp +91 93304 78897 to book an inspection.

## House drawings

- 2D AutoCAD house plans, sections and elevations, including plumbing and electrical drawings: ₹6 per sq ft of built-up area.
- 3D front elevation: a flat ₹6,000 for any size.
- Delivered online as DWG and PDF, anywhere in India, in 10 days.
- Drawings by Amrish Singh, B.Tech Civil, M.Tech Structural Engineering, Lucknow.

${drawings.map(lineFor).join('\n')}

${other.length ? `## Other pages\n\n${other.map(lineFor).join('\n')}\n` : ''}`.trim() + '\n';

fs.writeFileSync(path.join(root, 'dist/llms-full.txt'), llmsFull);
fs.writeFileSync(path.join(root, 'public/llms-full.txt'), llmsFull);
console.log(`wrote llms-full.txt with ${locs.length} URLs`);

// 4) Make sure the IndexNow key is in dist (Vite copies public/, this is a safety net)
const key = findIndexNowKey();
const keyName = `${key}.txt`;
fs.copyFileSync(path.join(root, 'public', keyName), path.join(root, 'dist', keyName));
console.log('indexnow key in dist:', keyName);
