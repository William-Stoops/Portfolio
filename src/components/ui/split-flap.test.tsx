import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { SplitFlap, SplitFlapTitle } from '@/components/ui/split-flap';
import { flapLine } from '@/utils/split-flap';

function cellsOf(container: Element) {
  return [...container.querySelectorAll('[data-flap-character]')].map((character) => {
    const strip = character.nextElementSibling;
    return {
      character: character.textContent,
      strip: strip?.textContent ?? '',
      steps: strip instanceof HTMLElement ? strip.style.getPropertyValue('--steps') : '',
      index: strip instanceof HTMLElement ? strip.style.getPropertyValue('--i') : '',
    };
  });
}

describe('SplitFlap', () => {
  it('draws one cell per character, its strip of glyphs ending on it', async () => {
    const screen = await render(
      <SplitFlap
        cells={flapLine('2025', { previous: '2024', flips: 3, key: 'test' })}
        motion="flap-board"
      />,
    );

    const cells = cellsOf(screen.container);
    expect(cells.map(({ character }) => character).join('')).toBe('2025');
    expect(cells.every(({ character, strip }) => strip.endsWith(character))).toBe(true);
    // Only the last digit turns: from 4, three glyphs, then 5.
    expect(cells.map(({ steps }) => steps)).toEqual(['0', '0', '0', '4']);
    expect(cells[3]?.strip.startsWith('4')).toBe(true);
  });

  it('staggers its cells from where its run starts in the line', async () => {
    const screen = await render(
      <SplitFlap
        cells={flapLine('INTM', { flips: 2, key: 'word' })}
        motion="flap-title"
        firstIndex={7}
      />,
    );

    expect(cellsOf(screen.container).map(({ index }) => index)).toEqual(['7', '8', '9', '10']);
  });

  it('is decoration: the text is said by its parent', async () => {
    const screen = await render(
      <SplitFlap cells={flapLine('Séoul', { flips: 2, key: 'city' })} motion="flap-title" />,
    );

    expect(screen.container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('turns in on its own as the page opens, and rests long before five seconds', async () => {
    const screen = await render(
      <SplitFlap cells={flapLine('404', { flips: 5, key: 'lost' })} motion="flap-enter" tiles />,
    );

    const animations = [...screen.container.querySelectorAll('[data-flap-character] + span')]
      .flatMap((strip) => strip.getAnimations())
      .filter((animation) => animation.timeline === document.timeline);
    const endTimes = animations.map((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime;
      return typeof endTime === 'number' ? endTime : Number.POSITIVE_INFINITY;
    });
    // On the clock, not on the scroll: one run per cell, all at rest well within 5 s.
    expect(animations).toHaveLength(3);
    expect(Math.max(...endTimes)).toBeLessThan(2000);
  });

  it('keeps each cell the width of its character, whatever it turns through', async () => {
    const screen = await render(
      <p style={{ fontSize: '40px' }}>
        <SplitFlap cells={flapLine('il', { flips: 4, key: 'narrow' })} motion="flap-title" />
        <span data-testid="plain">il</span>
      </p>,
    );

    const cells = [...screen.container.querySelectorAll('[data-flap-character]')].map(
      (character) => character.parentElement?.getBoundingClientRect().width ?? 0,
    );
    const plain = screen.getByTestId('plain').element().getBoundingClientRect().width;
    expect(cells.reduce((sum, width) => sum + width, 0)).toBeCloseTo(plain, 0);
  });
});

describe('SplitFlapTitle', () => {
  it('sets a title word by word, its cells turning in one after the other', async () => {
    const screen = await render(<SplitFlapTitle title="Retour en France" />);

    const words = [...screen.container.querySelectorAll('.whitespace-nowrap')];
    expect(
      words.map((word) =>
        cellsOf(word)
          .map(({ character }) => character)
          .join(''),
      ),
    ).toEqual(['Retour', 'en', 'France']);
    expect(cellsOf(screen.container).map(({ index }) => index)).toEqual(
      Array.from({ length: 14 }, (_, index) => String(index)),
    );
    expect(screen.container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });
});
