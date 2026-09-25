import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { DocumentPage } from '@/components/layout/document-page';

describe('DocumentPage', () => {
  it('titles the page with a focusable h1 wired to route focus management', async () => {
    const headingRef = createRef<HTMLHeadingElement>();
    const screen = await render(
      <DocumentPage title="Mentions légales" headingRef={headingRef}>
        <p>Contenu</p>
      </DocumentPage>,
    );

    const heading = screen.getByRole('heading', { level: 1, name: 'Mentions légales' });
    await expect.element(heading).toHaveAttribute('tabindex', '-1');
    expect(headingRef.current).toBe(heading.element());
    await expect.element(screen.getByText('Contenu')).toBeVisible();
  });
});
