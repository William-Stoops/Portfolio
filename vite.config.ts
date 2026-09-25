import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

import { NOT_FOUND_PAGE, PRERENDERED_PAGES } from './scripts/prerender-pages.ts';

// Under Vitest the compiler is off: its memo-cache branches would be counted by coverage
// as untested source branches. The compiled output is exercised by the E2E suite, which
// runs against the production build, and guarded by the react-hooks compiler lint rules.
const IS_VITEST = process.env['VITEST'] === 'true';

const FILE_EXTENSION_PATTERN = /\.[\da-z]+$/i;

// Makes `vite preview` answer like the static host: prerendered pages and assets as is,
// any other URL with 404.html and a real 404 status (no SPA fallback to the home page).
function servePrerenderedNotFound(): Plugin {
  return {
    name: 'serve-prerendered-not-found',
    configurePreviewServer(server) {
      const notFoundFile = resolve(
        server.config.root,
        server.config.build.outDir,
        NOT_FOUND_PAGE.file,
      );
      server.middlewares.use((request, response, next) => {
        const { pathname } = new URL(request.url ?? '/', 'http://localhost');
        const isPrerenderedPage = PRERENDERED_PAGES.some((page) => page.path === pathname);
        if (isPrerenderedPage || FILE_EXTENSION_PATTERN.test(pathname)) {
          next();
          return;
        }
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(notFoundFile));
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
    servePrerenderedNotFound(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    sourcemap: true,
  },
});
