import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');

const drawingPaths = [
  '/drawings',
  '/drawings/20x40-house-plan',
  '/drawings/1500-sq-ft-house-plan',
  '/drawings/house-map-design-lucknow',
  '/drawings/east-facing-house-plan',
  '/drawings/ghar-ka-naksha',
];

const pestPaths = [
  '/pest-control',
  '/pest-control/cockroach-control-lucknow',
  '/pest-control/termite-control-lucknow',
  '/pest-control/pre-construction-anti-termite-lucknow',
  '/pest-control/deemak-keede-ka-ilaaj-lucknow',
  '/pest-control/gomti-nagar',
  '/pest-control/sushant-golf-city',
  '/pest-control/homes-flats-lucknow',
  '/pest-control/warehouses-lucknow',
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
if (!llms.includes('/pest-control')) {
  issues.push('dist/llms.txt is missing the pest-control hub URL');
}

const fileFor = (urlPath) =>
  urlPath === '/'
    ? path.join(dist, 'index.html')
    : path.join(dist, urlPath.replace(/^\//, ''), 'index.html');

const checkCommon = (urlPath, html) => {
  const checks = [
    ['title', /<title>[^<]{10,}<\/title>/],
    ['canonical', new RegExp(`<link rel="canonical" href="https://pestcontrolinfra.co.in${urlPath === '/' ? '/' : urlPath}"`)],
    ['description', /<meta name="description" content="[^"]{40,}"/],
    ['h1', /<h1[^>]*>[\s\S]{10,}?<\/h1>/],
    ['FAQ schema', /"@type": "FAQPage"/],
    ['no ratings', { not: /AggregateRating|"@type": "Review"/ }],
    ['no free inspection claim', { not: /free inspection/i }],
    ['no 2-4 hour dispatch', { not: /2\s*[–-]\s*4\s*h/i }],
  ];
  if (!sitemap.includes(`https://pestcontrolinfra.co.in${urlPath === '/' ? '/' : urlPath}`)) {
    issues.push(`${urlPath} missing from sitemap.xml`);
  }
  for (const [label, rule] of checks) {
    if (rule instanceof RegExp) {
      if (!rule.test(html)) issues.push(`${urlPath}: missing ${label}`);
    } else if (rule.not.test(html)) {
      issues.push(`${urlPath}: unexpectedly contains ${label}`);
    }
  }
};

for (const urlPath of drawingPaths) {
  const file = fileFor(urlPath);
  if (!fs.existsSync(file)) {
    issues.push(`Missing prerendered file: ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  checkCommon(urlPath, html);
  const extra = [
    ['title keywords', /<title>[^<]*(House Plan|घर का नक्शा|3D Elevation|House Map|East Facing)/i],
    ['2D rate', /₹6/],
    ['3D fee', /₹6,000|₹6000/],
    ['Service schema', /"@type": "Service"/],
    ['Offer schema', /"@type": "Offer"/],
  ];
  for (const [label, rule] of extra) {
    if (!rule.test(html)) issues.push(`${urlPath}: missing ${label}`);
  }
}

for (const urlPath of pestPaths) {
  const file = fileFor(urlPath);
  if (!fs.existsSync(file)) {
    issues.push(`Missing prerendered file: ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  checkCommon(urlPath, html);
  const extra = [
    ['phone', /93304/],
    ['price text', /₹/],
    ['PestControl or LocalBusiness schema', /PestControlService|"LocalBusiness"/],
    ['Service schema', /"@type": "Service"/],
  ];
  for (const [label, rule] of extra) {
    if (!rule.test(html)) issues.push(`${urlPath}: missing ${label}`);
  }
}

const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
checkCommon('/', home);
if (!home.includes('93304')) issues.push('Homepage is missing the contact number');
if (!/<h1[^>]*>[\s\S]*?Pest control/i.test(home)) issues.push('Homepage H1 is missing pest control wording');
if (!home.includes('Cockroach') && !home.includes('cockroach')) issues.push('Homepage is missing cockroach service text');
if (!/"@type": \[?"LocalBusiness"|"@type": "PestControlService"|"@type": \["LocalBusiness"/.test(home)
    && !/PestControlService/.test(home)) {
  issues.push('Homepage is missing LocalBusiness or PestControlService schema');
}
if (!/"@type": "FAQPage"/.test(home)) issues.push('Homepage is missing FAQPage schema');
if (/AggregateRating|"@type": "Review"/.test(home)) issues.push('Homepage unexpectedly contains review schema');

if (!sitemap.includes('https://pestcontrolinfra.co.in/pest-control<') && !sitemap.includes('https://pestcontrolinfra.co.in/pest-control</loc>')) {
  // the loc is inside <loc>...</loc>
}
if (!sitemap.includes('https://pestcontrolinfra.co.in/pest-control</loc>')) {
  issues.push('Hub /pest-control missing from sitemap.xml');
}

if (issues.length) {
  console.error('Prerender verification failed:');
  issues.forEach((issue) => console.error(' -', issue));
  process.exit(1);
}

console.log(`Verified ${drawingPaths.length} drawings pages, ${pestPaths.length} pest pages, homepage, sitemap and llms.txt.`);
