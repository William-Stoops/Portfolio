import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { HeroSection } from '@/features/hero/components/hero-section';
import { HERO_CONTENT as HERO_CONTENT_EN } from '@/features/hero/data/hero-content.en';
import { HERO_CONTENT } from '@/features/hero/data/hero-content.fr';
import { type HeroContent } from '@/features/hero/types/hero-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderHero(content: HeroContent = HERO_CONTENT) {
  return render(
    <HeroSection
      content={content}
      headingRef={createRef()}
      contactHref="/fr#contact"
      proofHref="#it-finance-prorealtime"
    />,
  );
}

// The lines of the headline as laid out: where each group of words the wrapping may not
// split lands.
function headlineLines(heading: Element): string[] {
  const text = heading.lastChild;
  if (text?.nodeType !== Node.TEXT_NODE) {
    return [];
  }
  const lines: { top: number; words: string[] }[] = [];
  let offset = 0;
  for (const word of (text.textContent ?? '').split(' ')) {
    const range = document.createRange();
    range.setStart(text, offset);
    range.setEnd(text, offset + word.length);
    const top = Math.round(range.getBoundingClientRect().top);
    const line = lines.at(-1);
    if (line?.top === top) {
      line.words.push(word);
    } else {
      lines.push({ top, words: [word] });
    }
    offset += word.length + 1;
  }
  return lines.map(({ words }) => words.join(' '));
}

// A pronoun or an article left at the end of a line, cut from the word it introduces.
const LINE_ENDING_ON_A_SHORT_WORD = /(?:^|\s)(?:I|an|Je|je|la|d’une)$/u;

// Every line of text laid out in an element, as the boxes of its glyphs.
function textLinesOf(element: Element): DOMRect[] {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const lines: DOMRect[] = [];
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    const range = document.createRange();
    range.selectNodeContents(node);
    lines.push(...[...range.getClientRects()].filter(({ width }) => width > 0));
  }
  return lines;
}

// Where the slanted lower edge of the field runs, at a given x of the viewport.
function fieldEdgeAt(field: HTMLElement, x: number): number {
  const box = field.offsetParent?.getBoundingClientRect();
  const style = getComputedStyle(field);
  const slant = new DOMMatrix(style.transform).b;
  const [originX = 0] = style.transformOrigin.split(' ').map((value) => Number.parseFloat(value));
  const left = (box?.left ?? 0) + field.offsetLeft;
  const bottom = (box?.top ?? 0) + field.offsetTop + field.offsetHeight;
  return bottom + slant * (x - left - originX);
}

describe('HeroSection', () => {
  it('heads the page with the sentence of the CV, and says whose it is', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAccessibleName(`William Stoops : ${HERO_CONTENT.headline}`);
    await expect.element(screen.getByText(HERO_CONTENT.lead)).toBeVisible();
    await expect.element(screen.getByText(HERO_CONTENT.eyebrow)).toBeVisible();
  });

  it('exposes the heading to route focus management', async () => {
    const headingRef = createRef<HTMLHeadingElement>();
    const screen = await render(
      <HeroSection
        content={HERO_CONTENT}
        headingRef={headingRef}
        contactHref="/fr#contact"
        proofHref="#it-finance-prorealtime"
      />,
    );

    expect(headingRef.current).toBe(screen.getByRole('heading', { level: 1 }).element());
    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAttribute('tabindex', '-1');
  });

  it('offers to get in touch and to download the CV, with its format and weight', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByRole('link', { name: 'Me contacter' }))
      .toHaveAttribute('href', '/fr#contact');
    const cv = screen.getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' });
    await expect.element(cv).toHaveAttribute('href', '/cv/william-stoops-cv-fr.pdf');
    await expect.element(cv).toHaveAttribute('download');
  });

  it('shows the photo large, first, as the image the page is judged on', async () => {
    await page.viewport(1280, 800);
    const screen = await renderHero();

    const photo = screen.getByRole('img', { name: HERO_CONTENT.portraitAlt });
    await expect.element(photo).toBeVisible();
    await expect.element(photo).toHaveAttribute('loading', 'eager');
    await expect.element(photo).toHaveAttribute('fetchpriority', 'high');
    expect(photo.element().getBoundingClientRect().height).toBeGreaterThan(450);
  });

  it('keeps the photo clear of any card but the proof', async () => {
    const screen = await renderHero();

    await expect.element(screen.getByText(/Basé à Paris/)).not.toBeInTheDocument();
  });

  it('leads to the IT-Finance rework with its figure', async () => {
    const screen = await renderHero();

    const proof = screen.getByRole('link', { name: /Voir le calcul/ });
    await expect.element(proof).toHaveAttribute('href', '#it-finance-prorealtime');
    expect(proof.element().textContent).toContain('10 h → 5 min');
  });

  it('lists the keywords of the CV', async () => {
    const screen = await renderHero();

    expect(
      screen
        .getByRole('list', { name: 'Technologies' })
        .getByRole('listitem')
        .elements()
        .map((item) => item.textContent),
    ).toEqual(HERO_CONTENT.keywords);
  });

  it('speaks English on the English page', async () => {
    const screen = await renderHero(HERO_CONTENT_EN);

    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAccessibleName(`William Stoops: ${HERO_CONTENT_EN.headline}`);
    await expect.element(screen.getByRole('link', { name: 'Get in touch' })).toBeVisible();
    await expect
      .element(screen.getByRole('link', { name: 'Download my CV (PDF in French, 56 KB)' }))
      .toBeVisible();
    await expect.element(screen.getByRole('link', { name: /See the computation/ })).toBeVisible();
  });

  for (const [language, content] of [
    ['fr', HERO_CONTENT],
    ['en', HERO_CONTENT_EN],
  ] as const) {
    it.each([320, 375, 768, 1024, 1280, 1440])(
      `sets the ${language} headline on four whole lines at most, never wider than its column, at %i px`,
      async (width) => {
        await page.viewport(width, 900);
        const screen = await renderHero(content);
        await document.fonts.ready;

        const heading = screen.getByRole('heading', { level: 1 }).element();
        const lines = headlineLines(heading);
        expect(lines.length).toBeLessThanOrEqual(4);
        for (const line of lines) {
          expect(line).not.toMatch(LINE_ENDING_ON_A_SHORT_WORD);
        }
        expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth);
      },
    );
  }

  it('spaces the headline’s letters lightly, so they never touch', async () => {
    const screen = await renderHero();

    const style = getComputedStyle(screen.getByRole('heading', { level: 1 }).element());
    const tracking = Number.parseFloat(style.letterSpacing) / Number.parseFloat(style.fontSize);
    expect(tracking).toBeGreaterThanOrEqual(-0.026);
    expect(tracking).toBeLessThanOrEqual(0);
  });

  it.each([
    [390, 40],
    [1280, 68],
    [1440, 68],
  ])('sets the headline large, as a hero’s, at %i px: %i px at least', async (width, least) => {
    await page.viewport(width, 900);
    const screen = await renderHero();

    const heading = screen.getByRole('heading', { level: 1 }).element();
    expect(Number.parseFloat(getComputedStyle(heading).fontSize)).toBeGreaterThanOrEqual(least);
  });

  it.each([390, 1280])(
    'sets the proof astride the photo’s lower edge, clear of the face, at %i px',
    async (width) => {
      await page.viewport(width, 900);
      const screen = await renderHero();

      const photo = screen
        .getByRole('img', { name: HERO_CONTENT.portraitAlt })
        .element()
        .getBoundingClientRect();
      const proof = screen
        .getByRole('link', { name: /Voir le calcul/ })
        .element()
        .getBoundingClientRect();
      expect(proof.top).toBeLessThan(photo.bottom);
      expect(proof.bottom).toBeGreaterThan(photo.bottom);
      expect(proof.top).toBeGreaterThan(photo.top + photo.height / 2);
    },
  );

  it('blends the headline into the field, so its letters take the field’s hues', async () => {
    const screen = await renderHero();

    const heading = screen.getByRole('heading', { level: 1 }).element();
    expect(getComputedStyle(heading).mixBlendMode).toBe('hard-light');
  });

  it.each([375, 1024, 1280])(
    'lays the field under the whole text column, its slant never crossing a line, at %i px',
    async (width) => {
      await page.viewport(width, 800);
      const screen = await renderHero();
      await document.fonts.ready;

      const field = screen.container.querySelector<HTMLElement>('[data-flow-field]');
      const column = screen.getByRole('heading', { level: 1 }).element().parentElement;
      if (field === null || column === null) {
        throw new Error('The hero has no field or no text column');
      }
      for (const line of textLinesOf(column)) {
        expect(fieldEdgeAt(field, line.right)).toBeGreaterThan(line.bottom);
      }
    },
  );

  it('has no axe violations', async () => {
    const screen = await renderHero();

    await expectNoAxeViolations(screen.container);
  });
});
