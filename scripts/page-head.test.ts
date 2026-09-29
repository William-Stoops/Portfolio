import { describe, expect, it } from 'vitest';

import { gatewayHeadTags, pageHeadTags, robotsTxt, SOCIAL_CARD, sitemapXml } from './page-head.ts';
import { PRERENDERED_PAGES } from './prerender-pages.ts';

const ORIGIN = 'https://william-stoops.pages.dev';

const LEGAL_NOTICE = pageHeadTags({
  path: '/fr/mentions-legales',
  locale: 'fr',
  title: 'Mentions légales – William Stoops',
  description: 'Éditeur, hébergeur &amp; données.',
});

describe('pageHeadTags', () => {
  it('gives the page its absolute address, and the same page in each language', () => {
    expect(LEGAL_NOTICE).toContain(`<link rel="canonical" href="${ORIGIN}/fr/mentions-legales">`);
    expect(LEGAL_NOTICE).toContain(
      `<link rel="alternate" hreflang="fr" href="${ORIGIN}/fr/mentions-legales">`,
    );
    expect(LEGAL_NOTICE).toContain(
      `<link rel="alternate" hreflang="en" href="${ORIGIN}/en/legal-notice">`,
    );
    // Visitors without a language of the site go through the gateway, which chooses.
    expect(LEGAL_NOTICE).toContain(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/">`);
  });

  it('describes the page for link previews, with its card', () => {
    expect(LEGAL_NOTICE).toContain(
      '<meta property="og:title" content="Mentions légales – William Stoops">',
    );
    expect(LEGAL_NOTICE).toContain(
      '<meta property="og:description" content="Éditeur, hébergeur &amp; données.">',
    );
    expect(LEGAL_NOTICE).toContain(
      `<meta property="og:url" content="${ORIGIN}/fr/mentions-legales">`,
    );
    expect(LEGAL_NOTICE).toContain('<meta property="og:locale" content="fr_FR">');
    expect(LEGAL_NOTICE).toContain('<meta property="og:locale:alternate" content="en_US">');
    expect(LEGAL_NOTICE).toContain(
      `<meta property="og:image" content="${ORIGIN}${SOCIAL_CARD.path}">`,
    );
    expect(LEGAL_NOTICE).toContain(
      '<meta property="og:image:alt" content="William Stoops, Software Engineer &amp; AI Engineer">',
    );
    expect(LEGAL_NOTICE).toContain('<meta name="twitter:card" content="summary_large_image">');
  });

  it('keeps quotes from breaking out of an attribute', () => {
    const tags = pageHeadTags({
      path: '/en',
      locale: 'en',
      title: 'A "quoted" title',
      description: 'x',
    });

    expect(tags).toContain('content="A &quot;quoted&quot; title"');
  });
});

describe('gatewayHeadTags', () => {
  it('points crawlers at both languages from the gateway', () => {
    const tags = gatewayHeadTags();

    expect(tags).toContain(`<link rel="canonical" href="${ORIGIN}/">`);
    expect(tags).toContain(`<link rel="alternate" hreflang="fr" href="${ORIGIN}/fr">`);
    expect(tags).toContain(`<link rel="alternate" hreflang="en" href="${ORIGIN}/en">`);
    expect(tags).toContain(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/">`);
  });
});

describe('sitemapXml', () => {
  it('lists every prerendered page, each with its translations', () => {
    const sitemap = sitemapXml(PRERENDERED_PAGES);

    expect(sitemap.match(/<url>/g)).toHaveLength(PRERENDERED_PAGES.length);
    expect(sitemap).toContain(`<loc>${ORIGIN}/en/site-map</loc>`);
    expect(sitemap).toContain(
      `<xhtml:link rel="alternate" hreflang="fr" href="${ORIGIN}/fr/plan-du-site"/>`,
    );
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});

describe('robotsTxt', () => {
  it('lets every crawler in and points at the sitemap', () => {
    expect(robotsTxt()).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  });
});
