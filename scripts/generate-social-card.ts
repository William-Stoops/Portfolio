import { readFile } from 'node:fs/promises';

import { chromium } from '@playwright/test';

import { SITE_ORIGIN, SITE_OWNER, SITE_ROLE } from '../src/config/site.ts';
import { colorTokens } from './design-tokens.ts';
import { SOCIAL_CARD } from './page-head.ts';

// Run with `pnpm social-card` when the name, the role or the portrait changes, then commit
// the image: the card a shared link shows (Open Graph), 1200 × 630, drawn like the hero
// (ADR 0037): the still field of colour on a slant, the name, the photo in a card. Drawn by
// the browser with the site's own fonts and colour tokens, so it matches the page.
const SOURCES = {
  interTight: new URL(
    '../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
    import.meta.url,
  ),
  portrait: new URL('../docs/content/images/william-stoops-portrait.jpg', import.meta.url),
  tokens: new URL('../src/styles/globals.css', import.meta.url),
};
const TARGET = new URL(`../public${SOCIAL_CARD.path}`, import.meta.url);
// Keywords of the CV that need no translation: the card serves both languages.
const TECHNOLOGIES = 'TypeScript · Python · C++ · Rust · LLM';

async function dataUrl(source: URL, type: string): Promise<string> {
  return `data:${type};base64,${(await readFile(source)).toString('base64')}`;
}

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
}

async function cardHtml(): Promise<string> {
  const tokens = colorTokens(await readFile(SOURCES.tokens, 'utf8'));
  // The light theme, as the hero opens by default.
  const color = (name: string): string => tokens[name]?.light ?? '#000000';
  return `<!doctype html>
<html lang="en">
<head>
<style>
  @font-face { font-family: 'Inter Tight'; src: url(${await dataUrl(SOURCES.interTight, 'font/woff2')}) format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  body { position: relative; width: ${String(SOCIAL_CARD.width)}px; height: ${String(SOCIAL_CARD.height)}px; overflow: hidden;
    background: ${color('canvas')}; color: ${color('fg')}; font-family: 'Inter Tight', sans-serif;
    display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 64px; padding: 0 88px; }
  .field { position: absolute; z-index: -1; left: 0; right: 0; top: -300px; height: 700px;
    transform: skewY(-9deg); transform-origin: 0 100%;
    background-color: ${color('flow-blue')};
    background-image:
      radial-gradient(60% 80% at 15% 30%, ${color('flow-sky')}, transparent 70%),
      radial-gradient(55% 70% at 85% 35%, ${color('flow-violet')}, transparent 70%),
      radial-gradient(60% 70% at 55% 95%, ${color('flow-peach')}, transparent 70%); }
  h1 { font-weight: 600; font-size: 88px; line-height: 1; letter-spacing: -0.05em; }
  .role { margin-top: 22px; font-weight: 500; font-size: 36px; line-height: 1.15; letter-spacing: -0.01em; }
  .stack { margin-top: 30px; font-size: 26px; font-weight: 500; color: ${color('fg-muted')}; }
  .site { position: absolute; left: 88px; bottom: 44px; font-size: 20px; font-weight: 500; color: ${color('fg-muted')}; }
  .photo { width: 360px; height: 450px; border-radius: 20px; overflow: hidden;
    box-shadow: 0 48px 96px -20px rgb(50 50 93 / 0.3), 0 28px 56px -28px rgb(0 0 0 / 0.35); }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block; }
</style>
</head>
<body>
  <div class="field"></div>
  <main>
    <h1>${escapeHtml(SITE_OWNER)}</h1>
    <p class="role">${escapeHtml(SITE_ROLE)}</p>
    <p class="stack">${escapeHtml(TECHNOLOGIES)}</p>
  </main>
  <div class="photo"><img src="${await dataUrl(SOURCES.portrait, 'image/jpeg')}" alt=""></div>
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
