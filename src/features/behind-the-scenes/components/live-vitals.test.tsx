import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { LiveVitals } from '@/features/behind-the-scenes/components/live-vitals';
import { BEHIND_THE_SCENES } from '@/features/behind-the-scenes/data/behind-the-scenes.fr';

// What the tile of a measure says: its value, then the CI's threshold if it has one.
function tileOf(container: Element, label: string): string[] {
  const term = [...container.querySelectorAll('dt')].find(
    ({ textContent }) => textContent === label,
  );
  return [...(term?.parentElement?.querySelectorAll('dd') ?? [])].map(
    ({ textContent }) => textContent,
  );
}

async function renderVitals() {
  return render(
    <>
      {/* Something painted: a page that painted nothing has no first contentful paint. */}
      <p>Mesures de la page</p>
      <LiveVitals content={BEHIND_THE_SCENES.vitals} />
    </>,
  );
}

describe('LiveVitals', () => {
  it('lists the five measures of the visit, in reading order', async () => {
    const screen = await renderVitals();

    expect(
      [...screen.container.querySelectorAll('dt')].map(({ textContent }) => textContent),
    ).toEqual([
      'Premier affichage',
      'Plus grand élément affiché',
      'Décalage de la mise en page',
      'JavaScript téléchargé, compressé',
      'Fichiers demandés',
    ]);
  });

  it('fills each measure in as this browser takes it', async () => {
    const screen = await renderVitals();

    await expect
      .poll(() => tileOf(screen.container, 'Premier affichage')[0])
      .toMatch(/^[\d ]+ ms$/);
    await expect
      .poll(() => tileOf(screen.container, 'JavaScript téléchargé, compressé')[0])
      .toMatch(/^[\d ]+ Ko$/);
  });

  it('gives the threshold the CI holds a measure to, under it', async () => {
    const screen = await renderVitals();

    expect(tileOf(screen.container, 'Plus grand élément affiché')[1]).toBe(
      'Seuil de la CI : 2 000 ms',
    );
    expect(tileOf(screen.container, 'Premier affichage')).toHaveLength(1);
  });
});
