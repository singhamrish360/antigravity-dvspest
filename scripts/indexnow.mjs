/**
 * Notify Bing and Yandex (IndexNow) of every URL in the live sitemap.
 * Run after the production deploy so the key file is already live.
 *
 *   node scripts/indexnow.mjs
 *   node scripts/indexnow.mjs --sitemap https://pestcontrolinfra.co.in/sitemap.xml
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://pestcontrolinfra.co.in';
const HOST = 'pestcontrolinfra.co.in';

const argValue = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

const findKey = () => {
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

const key = findKey();
const keyLocation = `${SITE}/${key}.txt`;
const sitemapUrl = argValue('--sitemap') || `${SITE}/sitemap.xml`;

const sitemapRes = await fetch(sitemapUrl, {
  headers: { 'User-Agent': 'DVS-IndexNow/1.0', 'Cache-Control': 'no-cache' },
});
if (!sitemapRes.ok) {
  throw new Error(`Failed to fetch sitemap ${sitemapUrl}: ${sitemapRes.status}`);
}
const sitemap = await sitemapRes.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) throw new Error('Sitemap contained no <loc> URLs');

const payload = {
  host: HOST,
  key,
  keyLocation,
  urlList: urls,
};

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

console.log(`IndexNow: submitting ${urls.length} URLs with key ${keyLocation}`);

const results = [];
for (const endpoint of endpoints) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'DVS-IndexNow/1.0',
      },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    const row = { endpoint, status: res.status, body: body.slice(0, 500) };
    results.push(row);
    console.log(`${endpoint} -> ${res.status} ${body.slice(0, 300)}`);
  } catch (err) {
    const row = { endpoint, status: null, body: String(err) };
    results.push(row);
    console.log(`${endpoint} -> ERROR ${err}`);
  }
}

const ok = results.some((r) => r.status === 200 || r.status === 202);
if (!ok) {
  console.error('IndexNow: no endpoint accepted the submission.');
  process.exit(1);
}
console.log('IndexNow: at least one endpoint accepted the URL list.');
