import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

import { acceptedEncoding, createPageCompressor } from './scripts/compressed-page.ts';
import { renderLocaleGateway } from './scripts/locale-gateway.ts';
import { GATEWAY_PAGE, notFoundFileFor, PRERENDERED_PAGES } from './scripts/prerender-pages.ts';

// Under Vitest the compiler is off: its memo-cache branches would be counted by coverage
// as untested source branches. The compiled output is exercised by the E2E suite, which
// runs against the production build, and guarded by the react-hooks compiler lint rules.
const IS_VITEST = process.env['VITEST'] === 'true';

const FILE_EXTENSION_PATTERN = /\.[\da-z]+$/i;

// What the two WebGL scenes share (the hero's field, the Korea globe): one chunk, loaded
// with whichever scene comes first, under a stable name its budgets can target
// (.size-limit.json), instead of a name Rolldown would take from one of its modules.
const WEBGL_SHARED_MODULES =
  /[\\/]src[\\/](?:lib[\\/](?:webgl-program|theme-change)|utils[\\/](?:matrix4|parse-rgb-color))\.ts$/;

// Makes `vite preview` answer like the static host (Cloudflare Pages): assets as is,
// prerendered pages from their .html file, compressed, any other URL with the nearest
// 404.html (its locale's) and a real 404 status (no SPA fallback to a page).
function servePrerenderedPages(): Plugin {
  return {
    name: 'serve-prerendered-pages',
    configurePreviewServer(server) {
      const fileInBuild = (file: string): string =>
        resolve(server.config.root, server.config.build.outDir, file);
      const compressPage = createPageCompressor();
      server.middlewares.use((request, response, next) => {
        const { pathname } = new URL(request.url ?? '/', 'http://localhost');
        if (FILE_EXTENSION_PATTERN.test(pathname)) {
          next();
          return;
        }
        const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
        const page = [GATEWAY_PAGE, ...PRERENDERED_PAGES].find((entry) => entry.path === path);
        response.statusCode = page === undefined ? 404 : 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        const file = fileInBuild(page?.file ?? notFoundFileFor(path));
        const html = readFileSync(file);
        // Compressed, as the static host serves it: the page is the first and largest
        // download, and sent raw it held the bandwidth the hero's photo needs.
        const encoding = acceptedEncoding(request.headers['accept-encoding'] ?? '');
        response.setHeader('Vary', 'Accept-Encoding');
        if (encoding === undefined) {
          response.end(html);
          return;
        }
        response.setHeader('Content-Encoding', encoding);
        response.end(compressPage(file, html, encoding));
      });
    },
  };
}

// The dev server answers `/` with the gateway too, so it picks the locale as in production;
// every other URL gets the app, rendered by the client.
function serveLocaleGateway(): Plugin {
  return {
    name: 'serve-locale-gateway',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (new URL(request.url ?? '/', 'http://localhost').pathname !== GATEWAY_PAGE.path) {
          next();
          return;
        }
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(renderLocaleGateway());
      });
    },
  };
}

export default defineConfig({
  // The React Compiler runs through Babel (stable path); the Rust port is still experimental.
  plugins: [
    react(),
    ...(IS_VITEST ? [] : [babel({ presets: [reactCompilerPreset()] })]),
    tailwindcss(),
    servePrerenderedPages(),
    serveLocaleGateway(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    sourcemap: true,
    // Read by scripts/prerender.ts to preload each locale's content chunk, then deleted.
    manifest: true,
    rolldownOptions: {
      output: { codeSplitting: { groups: [{ name: 'webgl', test: WEBGL_SHARED_MODULES }] } },
    },
  },
});
