import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { PageMetadata } from '@/components/layout/page-metadata';

describe('PageMetadata', () => {
  it('gives the document its title and its description, in the head', async () => {
    await render(<PageMetadata title="Mentions légales – William Stoops" description="Éditeur." />);

    await expect.poll(() => document.title).toBe('Mentions légales – William Stoops');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Éditeur.',
    );
  });
});
