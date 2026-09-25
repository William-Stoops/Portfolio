import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { EmphasizedText } from '@/components/ui/emphasized-text';

describe('EmphasizedText', () => {
  it('renders **marked** passages as strong text and the rest as plain text', async () => {
    const screen = await render(
      <p>
        <EmphasizedText text="J’ai **dirigé les deux autres développeurs** du projet." />
      </p>,
    );

    await expect.element(screen.getByText('dirigé les deux autres développeurs')).toBeVisible();
    expect(screen.container.querySelector('strong')?.textContent).toBe(
      'dirigé les deux autres développeurs',
    );
    expect(screen.container.textContent).toBe(
      'J’ai dirigé les deux autres développeurs du projet.',
    );
  });
});
