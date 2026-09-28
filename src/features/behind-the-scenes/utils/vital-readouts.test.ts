import { describe, expect, it } from 'vitest';

import { BEHIND_THE_SCENES as CONTENT_EN } from '@/features/behind-the-scenes/data/behind-the-scenes.en';
import { BEHIND_THE_SCENES } from '@/features/behind-the-scenes/data/behind-the-scenes.fr';
import { vitalReadouts } from '@/features/behind-the-scenes/utils/vital-readouts';

const MEASURED = {
  firstContentfulPaint: 412.4,
  largestContentfulPaint: 1203.7,
  cumulativeLayoutShift: 0.0021,
  javascriptBytes: 128_400,
  requests: 23,
} as const;

describe('vitalReadouts', () => {
  it('reads each measure in French, with the threshold the CI holds it to', () => {
    expect(vitalReadouts(MEASURED, BEHIND_THE_SCENES.vitals)).toEqual([
      { key: 'firstContentfulPaint', label: 'Premier affichage', value: '412 ms' },
      {
        key: 'largestContentfulPaint',
        label: 'Plus grand élément affiché',
        value: '1 204 ms',
        threshold: 'Seuil de la CI : 2 000 ms',
      },
      {
        key: 'cumulativeLayoutShift',
        label: 'Décalage de la mise en page',
        value: '0,002',
        threshold: 'Seuil de la CI : 0,050',
      },
      { key: 'javascriptBytes', label: 'JavaScript téléchargé, compressé', value: '128 Ko' },
      { key: 'requests', label: 'Fichiers demandés', value: '23' },
    ]);
  });

  it('reads them in English on the English page', () => {
    expect(
      vitalReadouts(MEASURED, CONTENT_EN.vitals).map(({ value, threshold }) => [value, threshold]),
    ).toEqual([
      ['412 ms', undefined],
      ['1,204 ms', 'CI threshold: 2,000 ms'],
      ['0.002', 'CI threshold: 0.050'],
      ['128 KB', undefined],
      ['23', undefined],
    ]);
  });

  it('says a paint was not measured when the page opened in the background', () => {
    const [firstPaint, largestPaint] = vitalReadouts(
      { ...MEASURED, firstContentfulPaint: 'background', largestContentfulPaint: 'background' },
      BEHIND_THE_SCENES.vitals,
    );

    expect(firstPaint?.value).toBe('Non mesuré\u202F: page ouverte en arrière-plan');
    expect(largestPaint?.value).toBe('Non mesuré\u202F: page ouverte en arrière-plan');
    expect(
      vitalReadouts({ ...MEASURED, firstContentfulPaint: 'background' }, CONTENT_EN.vitals)[0]
        ?.value,
    ).toBe('Not measured: page opened in the background');
  });

  it('says a measure is on its way, or that this browser does not take it', () => {
    const values = vitalReadouts(
      {
        firstContentfulPaint: 'pending',
        largestContentfulPaint: 'unsupported',
        cumulativeLayoutShift: 'unsupported',
        javascriptBytes: 'pending',
        requests: 'pending',
      },
      BEHIND_THE_SCENES.vitals,
    ).map(({ value }) => value);

    expect(values).toEqual([
      'Mesure en cours',
      'Non mesuré par ce navigateur',
      'Non mesuré par ce navigateur',
      'Mesure en cours',
      'Mesure en cours',
    ]);
  });
});
