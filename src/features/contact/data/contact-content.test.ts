import { describe, expect, it } from 'vitest';

import { CONTACT_CONTENT as CONTACT_CONTENT_EN } from '@/features/contact/data/contact-content.en';
import { CONTACT_CONTENT } from '@/features/contact/data/contact-content.fr';

// Source: docs/content/cv-source.md (identity: e-mail, LinkedIn, location).
describe('contact content', () => {
  it('states where William can work, as in the CV', () => {
    expect(CONTACT_CONTENT.location).toBe('Paris, Lille ou full remote');
  });

  it('invites the visitor to write, without claiming anything the CV does not say', () => {
    expect(CONTACT_CONTENT.invitation).toBe('Un poste, une mission ou une question ? Écrivez-moi.');
  });

  it('translates the location and the invitation, under the same anchor', () => {
    expect(CONTACT_CONTENT_EN.location).toBe('Paris, Lille or fully remote');
    expect(CONTACT_CONTENT_EN.invitation).toBe('A role, an assignment or a question? Write to me.');
    expect(CONTACT_CONTENT_EN.id).toBe(CONTACT_CONTENT.id);
  });

  it('writes the mail subject in the page’s language, around the sender’s name', () => {
    expect(CONTACT_CONTENT.form.mailSubject('Ada')).toBe('Contact depuis le portfolio – Ada');
    expect(CONTACT_CONTENT_EN.form.mailSubject('Ada')).toBe('Contact from the portfolio – Ada');
  });
});
