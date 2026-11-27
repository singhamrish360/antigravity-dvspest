import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');

const requiredPaths = [
  '/drawings',
  '/drawings/20x40-house-plan',
  '/drawings/1500-sq-ft-house-plan',
  '/drawings/house-map-design-lucknow',
  '/drawings/east-facing-house-plan',
  '/drawings/ghar-ka-naksha',
];

const issues = [];

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const llms = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8');
if (!llms.includes('House drawings') && !llms.includes('house drawings')) {
  issues.push('dist/llms.txt does not describe house drawings');
}
if (!llms.includes('Pest control') && !llms.includes('pest control')) {
  issues.push('dist/llms.txt does not describe pest control');
}

for (const urlPath of requiredPaths) {
  const file = path.join(dist, urlPath.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(file)) {
    issues.push(`Missing prerendered file: ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const checks = [
    ['title', /<title>[^<]*(House Plan|घर का नक्शा|3D Elevation|House Map|East Facing)/i],
    ['canonical', new RegExp(`<link rel="canonical" href="https://pestcontrolinfra.co.in${urlPath}"`)],
    ['description', /<meta name="description" content="[^"]{40,}"/],
    ['h1', /<h1[^>]*>[^<]{10,}/],
    ['2D rate', /₹6/],
    ['3D fee', /₹6,000|₹6000/],
    ['Service schema', /"@type": "Service"/],
    ['Offer schema', /"@type": "Offer"/],
    ['FAQ schema', /"@type": "FAQPage"/],
    ['no ratings', { not: /AggregateRating|"@type": "Review"/ }],
  ];
  if (!sitemap.includes(`https://pestcontrolinfra.co.in${urlPath}`)) {
    issues.push(`${urlPath} missing from sitemap.xml`);
  }
  for (const [label, rule] of checks) {
    if (rule instanceof RegExp) {
      if (!rule.test(html)) issues.push(`${urlPath}: missing ${label}`);
    } else if (rule.not.test(html)) {
      issues.push(`${urlPath}: unexpectedly contains ${label}`);
    }
  }
}

const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes('href="https://pestcontrolinfra.co.in/"') && !home.includes("href='https://pestcontrolinfra.co.in/'")) {
  issues.push('Homepage canonical is not https://pestcontrolinfra.co.in/');
}

if (issues.length) {
  console.error('Prerender verification failed:');
  issues.forEach((issue) => console.error(' -', issue));
  process.exit(1);
}

console.log(`Verified ${requiredPaths.length} prerendered pages, sitemap and llms.txt.`);
