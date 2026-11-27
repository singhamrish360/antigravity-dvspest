import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const fail = (msg) => {
  throw new Error(msg);
};

const read = (rel) => {
  const file = path.join(dist, rel);
  if (!fs.existsSync(file)) fail(`missing ${rel}`);
  return fs.readFileSync(file);
};

const robots = read('robots.txt').toString('utf8');
for (const bot of [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Google-Extended',
  'Bingbot',
  'Applebot',
]) {
  if (!robots.includes(bot)) fail(`robots.txt missing ${bot}`);
}
if (!robots.includes('Sitemap: https://pestcontrolinfra.co.in/sitemap.xml')) {
  fail('robots.txt missing sitemap');
}

const llms = read('llms.txt').toString('utf8');
const llmsFull = read('llms-full.txt').toString('utf8');
if (!llms.includes('https://pestcontrolinfra.co.in')) fail('llms.txt missing site URL');
if (!llmsFull.includes('/drawings/ghar-ka-naksha')) fail('llms-full.txt missing Hindi page');

const keyFiles = fs.readdirSync(dist).filter((n) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(n) && !['robots.txt','llms.txt','llms-full.txt'].includes(n));
const keyFile = keyFiles.find((n) => read(n).toString('utf8').trim() === n.replace(/\.txt$/, ''));
if (!keyFile) fail('IndexNow key file missing from dist/');

const isHtml = (buf) => buf.slice(0, 64).toString('utf8').toLowerCase().includes('<!doctype html');
if (isHtml(read('favicon.ico'))) fail('favicon.ico is HTML');
if (isHtml(read('apple-touch-icon.png'))) fail('apple-touch-icon.png is HTML');
if (isHtml(read('og-home.jpg'))) fail('og-home.jpg is HTML');
if (isHtml(read('og-drawings.jpg'))) fail('og-drawings.jpg is HTML');

const home = read('index.html').toString('utf8');
for (const needle of [
  '"@type": "Organization"',
  '"@type": "LocalBusiness"',
  '"@type": "Person"',
  'Amrish Singh',
  'B.Tech Civil',
  'M.Tech Structural Engineering',
  'linkedin.com/company/m-s-dvs-pest-control-infrastructure-co',
  'og-home.jpg',
  'apple-touch-icon.png',
  'favicon.ico',
]) {
  if (!home.includes(needle)) fail(`homepage missing ${needle}`);
}

const drawings = read('drawings/index.html').toString('utf8');
const hindi = read('drawings/ghar-ka-naksha/index.html').toString('utf8');
for (const [name, html] of [['drawings', drawings], ['hindi', hindi]]) {
  if (!html.includes('hreflang="en"') || !html.includes('hreflang="hi"') || !html.includes('hreflang="x-default"')) {
    fail(`${name} missing hreflang`);
  }
  if (!html.includes('og-drawings.jpg')) fail(`${name} missing og-drawings.jpg`);
  if (!html.includes('"@type": "Organization"') || !html.includes('Amrish Singh')) {
    fail(`${name} lost the site-wide entity schema`);
  }
}
if (!hindi.includes('og:locale') || !hindi.includes('hi_IN')) fail('Hindi page missing og:locale hi_IN');

const sitemap = read('sitemap.xml').toString('utf8');
if (!sitemap.includes('xmlns:xhtml')) fail('sitemap missing xhtml namespace');
if (!sitemap.includes('<lastmod>')) fail('sitemap missing lastmod');
if ((sitemap.match(/<loc>/g) || []).length < 32) fail('sitemap has fewer than 32 URLs');
if (!sitemap.includes('xhtml:link rel="alternate" hreflang="hi"')) fail('sitemap missing hreflang on language pair');

console.log('Verified SEO infra: robots, llms-full, IndexNow key, icons, entity schema, hreflang, sitemap.');
