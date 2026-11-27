import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, Plugin, PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';

const servePrerenderedPages = (): Plugin => {
  const tryFile = (root: string, urlPath: string) => {
    const clean = decodeURIComponent((urlPath || '/').split('?')[0].split('#')[0]);
    if (clean.includes('..')) return null;
    const candidates = [
      path.join(root, clean, 'index.html'),
      path.join(root, `${clean}.html`),
    ];
    if (clean.endsWith('/')) {
      candidates.unshift(path.join(root, clean, 'index.html'));
    }
    return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
  };

  const attach = (server: PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
        next();
        return;
      }
      const file = tryFile(server.config.root ? path.join(server.config.root, 'dist') : 'dist', req.url || '/');
      // Vite preview already serves from dist as root, so also try outDir directly.
      const outDir = server.config.build?.outDir
        ? path.resolve(server.config.root, server.config.build.outDir)
        : path.resolve(server.config.root, 'dist');
      const found = tryFile(outDir, req.url || '/');
      if (!found) {
        next();
        return;
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      fs.createReadStream(found).pipe(res);
    });
  };

  return {
    name: 'serve-prerendered-pages',
    configurePreviewServer(server) {
      attach(server);
    },
  };
};

export default defineConfig({
  plugins: [react(), servePrerenderedPages()],
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
