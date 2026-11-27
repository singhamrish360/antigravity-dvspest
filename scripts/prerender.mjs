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

const { render, SEO_ROUTES, PEST_ROUTES, applyHeadToTemplate } = await import(pathToFileURL(ssrPath).href);
const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');

if (!template.includes('id="root"')) {
  throw new Error('Built index.html does not contain a root div to inject prerendered HTML.');
}

const inject = (templateHtml, body, head) => {
  let page = applyHeadToTemplate(templateHtml, head);
  if (page.includes('<div id="root"></div>')) {
    page = page.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  } else if (/<div id="root"><\/div>/.test(page)) {
    page = page.replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  } else {
    page = page.replace(/<div id="root"[^>]*>\s*<\/div>/, `<div id="root">${body}</div>`);
  }
  return page;
};

const writeRoute = (routePath, pageHtml) => {
  if (routePath === '/') {
    fs.writeFileSync(path.join(root, 'dist/index.html'), pageHtml);
    return;
  }
  const outDir = path.join(root, 'dist', routePath.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml);
};

const allRoutes = [
  { path: '/', requirePrice: true },
  ...PEST_ROUTES.map((route) => ({ path: route.path, requirePrice: true })),
  ...SEO_ROUTES.map((route) => ({ path: route.path, requirePrice: true })),
];

for (const route of allRoutes) {
  const { html, head } = render(route.path);
  if (!html.includes('<h1')) {
    throw new Error(`Prerendered ${route.path} is missing an H1.`);
  }
  if (route.requirePrice && !html.includes('₹') && !html.includes('Rs')) {
    throw new Error(`Prerendered ${route.path} is missing price text.`);
  }
  if (!html.includes('93304') && route.path !== '/drawings' && !route.path.startsWith('/drawings/')) {
    throw new Error(`Prerendered ${route.path} is missing the contact number.`);
  }
  const page = inject(template, html, head);
  writeRoute(route.path, page);
  console.log('prerendered', route.path);
}

const urls = [
  { loc: 'https://pestcontrolinfra.co.in/', changefreq: 'weekly', priority: '1.0' },
  ...PEST_ROUTES.map((route) => ({
    loc: `https://pestcontrolinfra.co.in${route.path}`,
    changefreq: 'weekly',
    priority: route.kind === 'hub' ? '0.95' : route.kind === 'service' || route.kind === 'builders' || route.kind === 'hindi' || route.kind === 'segment' ? '0.9' : '0.8',
  })),
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
