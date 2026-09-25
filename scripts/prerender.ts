import { readFile, writeFile } from 'node:fs/promises';

import { createServer, createServerModuleRunner } from 'vite';

import { type RenderRoute } from '../src/types/prerender.ts';
import { injectRenderedPage } from './inject-rendered-page.ts';
import { NOT_FOUND_PAGE, PRERENDERED_PAGES } from './prerender-pages.ts';

// Runs after `vite build`: renders every static page to HTML with the app's own code,
// loaded through Vite (TSX, aliases, React Compiler) by an SSR module runner.
const DIST_DIRECTORY = new URL('../dist/', import.meta.url);

const server = await createServer({
  appType: 'custom',
  logLevel: 'warn',
  server: { middlewareMode: true, hmr: false },
});

try {
  const runner = createServerModuleRunner(server.environments.ssr, { hmr: false });
  const { renderRoute } = await runner.import<{ renderRoute: RenderRoute }>(
    '/src/entry-server.tsx',
  );
  const template = await readFile(new URL('index.html', DIST_DIRECTORY), 'utf8');

  await Promise.all(
    [...PRERENDERED_PAGES, NOT_FOUND_PAGE].map(async ({ path, file }) => {
      const page = injectRenderedPage(template, await renderRoute(path));
      await writeFile(new URL(file, DIST_DIRECTORY), page);
      process.stdout.write(`prerendered ${path} → dist/${file}\n`);
    }),
  );

  await runner.close();
} finally {
  await server.close();
}
