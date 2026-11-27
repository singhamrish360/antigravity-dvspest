import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

await build({
  configFile: path.join(root, 'vite.config.ts'),
  build: {
    ssr: path.join(root, 'src/entry-server.tsx'),
    outDir: path.join(root, 'dist-ssr'),
    emptyOutDir: true,
    copyPublicDir: false,
  },
  logLevel: 'warn',
});

const ssrPath = path.join(root, 'dist-ssr/entry-server.js');
if (!fs.existsSync(ssrPath)) {
  const found = fs.readdirSync(path.join(root, 'dist-ssr'));
  throw new Error(`SSR bundle missing at ${ssrPath}. Found: ${found.join(', ')}`);
}

const { render, SEO_ROUTES, applyHeadToTemplate } = await import(pathToFileURL(ssrPath).href);
const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');

if (!template.includes('id="root"')) {
  throw new Error('Built index.html does not contain a root div to inject prerendered HTML.');
}

for (const route of SEO_ROUTES) {
  const { html, head } = render(route.path);
  if (!html.includes('<h1') || !html.includes('₹')) {
    throw new Error(`Prerendered ${route.path} is missing an H1 or price text.`);
  }
  let page = applyHeadToTemplate(template, head);
  if (page.includes('<div id="root"></div>')) {
    page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  } else if (/<div id="root"><\/div>/.test(page)) {
    page = page.replace(/<div id="root"><\/div>/, `<div id="root">${html}</div>`);
  } else {
    page = page.replace(/<div id="root"[^>]*>\s*<\/div>/, `<div id="root">${html}</div>`);
  }
  const outDir = path.join(root, 'dist', route.path.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  console.log('prerendered', route.path);
}

const urls = [
  { loc: 'https://pestcontrolinfra.co.in/', changefreq: 'weekly', priority: '1.0' },
  ...SEO_ROUTES.map((route) => ({
    loc: `https://pestcontrolinfra.co.in${route.path}`,
    changefreq: 'weekly',
    priority: route.path === '/drawings' ? '0.9' : '0.8',
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'dist/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap);
console.log(`wrote sitemap with ${urls.length} URLs`);
