import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

import { createServer, createServerModuleRunner } from 'vite';

import { LOCALES } from '../src/i18n/locales.ts';
import { type RenderRoute } from '../src/types/prerender.ts';
import { chunkPreloads, parseViteManifest } from './chunk-preloads.ts';
import { injectRenderedPage, renderedMetadata } from './inject-rendered-page.ts';
import { renderLocaleGateway } from './locale-gateway.ts';
import { pageHeadTags, robotsTxt, sitemapXml } from './page-head.ts';
import {
  GATEWAY_PAGE,
  localeOfPage,
  NOT_FOUND_PAGES,
  PRERENDERED_PAGES,
} from './prerender-pages.ts';

// Runs after `vite build`: renders every static page of every locale to HTML with the app's
// own code, loaded through Vite (TSX, aliases, React Compiler) by an SSR module runner, and
// writes the gateway at `/` (ADR 0026).
const DIST_DIRECTORY = new URL('../dist/', import.meta.url);
const MANIFEST_DIRECTORY = new URL('.vite/', DIST_DIRECTORY);

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
  const manifest = parseViteManifest(
    await readFile(new URL('manifest.json', MANIFEST_DIRECTORY), 'utf8'),
  );
  // The locale's content chunk, which hydration awaits: preloaded with the entry.
  const preloadsByLocale = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      chunkPreloads(manifest, `src/app/content/site-content.${locale}.tsx`),
    ]),
  );

  await Promise.all(
    LOCALES.map((locale) => mkdir(new URL(`${locale}/`, DIST_DIRECTORY), { recursive: true })),
  );
  await Promise.all(
    [...PRERENDERED_PAGES, ...NOT_FOUND_PAGES].map(async ({ path, file }) => {
      const locale = localeOfPage(path);
      const rendered = await renderRoute(path);
      // A page that is found has an address and a link preview; a 404 has neither.
      const metadata = NOT_FOUND_PAGES.some((page) => page.path === path)
        ? undefined
        : renderedMetadata(rendered);
      const page = injectRenderedPage(template, rendered, {
        lang: locale,
        preloads: preloadsByLocale[locale] ?? [],
        ...(metadata === undefined
          ? {}
          : { extraHead: pageHeadTags({ path, locale, ...metadata }) }),
      });
      await writeFile(new URL(file, DIST_DIRECTORY), page);
      process.stdout.write(`prerendered ${path} → dist/${file}\n`);
    }),
  );
  await writeFile(new URL(GATEWAY_PAGE.file, DIST_DIRECTORY), renderLocaleGateway());
  process.stdout.write(`wrote the locale gateway → dist/${GATEWAY_PAGE.file}\n`);
  await writeFile(new URL('sitemap.xml', DIST_DIRECTORY), sitemapXml(PRERENDERED_PAGES));
  await writeFile(new URL('robots.txt', DIST_DIRECTORY), robotsTxt());
  process.stdout.write('wrote sitemap.xml and robots.txt\n');

  // Only the prerender reads the manifest: it is not shipped.
  await rm(MANIFEST_DIRECTORY, { recursive: true });
  await runner.close();
} finally {
  await server.close();
}
