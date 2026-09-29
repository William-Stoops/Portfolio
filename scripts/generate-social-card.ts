import { readFile } from 'node:fs/promises';

import { chromium } from '@playwright/test';

import { SITE_ORIGIN, SITE_OWNER, SITE_ROLE } from '../src/config/site.ts';
import { colorTokens } from './design-tokens.ts';
import { SOCIAL_CARD } from './page-head.ts';

// Run with `pnpm social-card` when the name, the role or the portrait changes, then commit
// the image: the card a shared link shows (Open Graph), 1200 × 630, dark like the hero.
// Drawn by the browser with the site's own fonts and colour tokens, so it matches the page.
const SOURCES = {
  interTight: new URL(
    '../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
    import.meta.url,
  ),
  portrait: new URL('../docs/content/images/william-stoops-portrait.jpg', import.meta.url),
  tokens: new URL('../src/styles/globals.css', import.meta.url),
};
const TARGET = new URL(`../public${SOCIAL_CARD.path}`, import.meta.url);
// The hero's highlights that need no translation: the card serves both languages.
const TECHNOLOGIES = 'C++ · Rust · TS  ·  Agents & LLM';

async function dataUrl(source: URL, type: string): Promise<string> {
  return `data:${type};base64,${(await readFile(source)).toString('base64')}`;
}

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
}

async function cardHtml(): Promise<string> {
  const tokens = colorTokens(await readFile(SOURCES.tokens, 'utf8'));
  const color = (name: string): string => tokens[name]?.dark ?? '#000000';
  return `<!doctype html>
<html lang="en">
<head>
<style>
  @font-face { font-family: 'Inter Tight'; src: url(${await dataUrl(SOURCES.interTight, 'font/woff2')}) format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  body { width: ${String(SOCIAL_CARD.width)}px; height: ${String(SOCIAL_CARD.height)}px; overflow: hidden;
    background: ${color('canvas')}; color: ${color('fg')}; font-family: 'Inter Tight', sans-serif;
    display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 56px; padding: 0 88px; }
  h1 { font-weight: 300; font-size: 96px; line-height: 1; letter-spacing: -0.035em; }
  .role { margin-top: 20px; font-weight: 400; font-size: 40px; line-height: 1.15; text-wrap: balance; color: ${color('accent-fg')}; }
  .rule { margin-top: 40px; width: 72px; height: 4px; border-radius: 2px; background: ${color('accent')}; }
  .stack { margin-top: 28px; font-size: 28px; color: ${color('fg-muted')}; white-space: pre; }
  .site { position: absolute; left: 88px; bottom: 48px; font-size: 20px; letter-spacing: 0.2em;
    text-transform: uppercase; color: ${color('fg-subtle')}; }
  .portrait { width: 360px; height: 360px; border-radius: 50%; padding: 10px;
    border: 5px solid ${color('accent')}; }
  .portrait img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: 50% 30%; display: block; }
  .horizon { position: absolute; inset: auto 0 0; height: 1px; background: ${color('border')}; bottom: 104px; left: 88px; right: 88px; }
</style>
</head>
<body>
  <main>
    <h1>${escapeHtml(SITE_OWNER)}</h1>
    <p class="role">${escapeHtml(SITE_ROLE)}</p>
    <div class="rule"></div>
    <p class="stack">${escapeHtml(TECHNOLOGIES)}</p>
  </main>
  <div class="portrait"><img src="${await dataUrl(SOURCES.portrait, 'image/jpeg')}" alt=""></div>
  <div class="horizon"></div>
  <p class="site">${escapeHtml(new URL(SITE_ORIGIN).host)}</p>
</body>
</html>`;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: SOCIAL_CARD.width, height: SOCIAL_CARD.height },
  });
  await page.setContent(await cardHtml());
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({ path: TARGET.pathname, type: 'jpeg', quality: 88 });
  process.stdout.write(`wrote the social card → public${SOCIAL_CARD.path}\n`);
} finally {
  await browser.close();
}
