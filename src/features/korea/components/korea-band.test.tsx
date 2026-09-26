import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { KoreaBand } from '@/features/korea/components/korea-band';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content';

describe('KoreaBand', () => {
  it('sets the Korean line and its translation, hidden from assistive tech', async () => {
    const screen = await render(<KoreaBand band={KOREA_CONTENT.band} />);

    const band = screen.container.firstElementChild;
    expect(band?.getAttribute('aria-hidden')).toBe('true');
    const [korean, translation] = band?.querySelectorAll('p') ?? [];
    expect(korean?.getAttribute('lang')).toBe('ko');
    expect(korean?.textContent).toContain('고려대학교');
    expect(translation?.textContent).toContain('Korea University');
  });
});
