import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { KoreaChapter } from '@/features/korea/components/korea-chapter';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderSection() {
  return render(<KoreaChapter content={KOREA_CONTENT} />);
}

describe('KoreaChapter', () => {
  it('opens with the words of the year in Korean, drifting as decoration', async () => {
    const screen = await renderSection();

    const band = screen.container.querySelector('p[lang="ko"]')?.closest('[aria-hidden="true"]');
    expect(band?.textContent).toContain('고려대학교');
  });

  it('greets in Korean, read once and marked as Korean for assistive tech and fonts', async () => {
    const screen = await renderSection();

    const greetings = screen.getByText(KOREA_CONTENT.greeting.korean, { exact: true }).elements();
    expect(greetings.every((greeting) => greeting.getAttribute('lang') === 'ko')).toBe(true);
    expect(greetings.filter((greeting) => !greeting.closest('[aria-hidden="true"]'))).toHaveLength(
      1,
    );
    await expect.element(screen.getByText(KOREA_CONTENT.lead)).toBeVisible();
  });

  it('draws the flight and the flag as decoration only', async () => {
    const screen = await renderSection();

    for (const selector of ['[data-flight-route]', '[data-flag]']) {
      expect(screen.container.querySelector(selector)?.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('names the university and sums the year up in three figures', async () => {
    const screen = await renderSection();

    await expect.element(screen.getByText('Korea University', { exact: true })).toBeVisible();
    const figures = screen.getByRole('list', { name: 'L’année en chiffres' });
    expect(figures.getByRole('listitem').elements()).toHaveLength(3);
  });

  it('lists the models trained there, at level 4 under the Seoul stop', async () => {
    const screen = await renderSection();

    const models = screen.getByRole('list', { name: 'Modèles entraînés à Korea University' });
    expect(
      models
        .getByRole('listitem')
        .elements()
        .map((item) => item.querySelector('h4')?.textContent),
    ).toEqual(KOREA_CONTENT.models.map(({ name }) => name));
  });

  it('shows each photo whole, captioned in Korean and French, loaded lazily', async () => {
    const screen = await renderSection();

    for (const { picture, alt, caption, korean } of KOREA_CONTENT.photos) {
      const figure = screen.getByRole('figure', { name: new RegExp(caption) });
      const image = figure.getByRole('img', { name: alt }).element();
      expect(image.getAttribute('loading')).toBe('lazy');
      // Whole: framed at its own ratio, never cropped.
      const { width, height } = image.getBoundingClientRect();
      expect(width / height).toBeCloseTo(picture.width / picture.height, 2);
      expect(getComputedStyle(image).objectFit).not.toBe('cover');
      expect(figure.getByText(korean, { exact: true }).element().getAttribute('lang')).toBe('ko');
    }
  });

  it('has no axe violations', async () => {
    const screen = await renderSection();

    await expectNoAxeViolations(screen.container);
  });
});
