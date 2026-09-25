import { describe, expect, it } from 'vitest';

import { CONTACT_CONTENT } from '@/features/contact/data/contact-content';

// Source: docs/content/cv-source.md (identity: e-mail, LinkedIn, location).
describe('contact content', () => {
  it('states where William can work, as in the CV', () => {
    expect(CONTACT_CONTENT.location).toBe('Paris, Lille ou full remote');
  });
});
