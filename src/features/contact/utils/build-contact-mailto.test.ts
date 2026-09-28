import { describe, expect, it } from 'vitest';

import { CONTACT_CONTENT } from '@/features/contact/data/contact-content.fr';
import { buildContactMailto } from '@/features/contact/utils/build-contact-mailto';

const SUBJECT = CONTACT_CONTENT.form.mailSubject;

const VALUES = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Bonjour William,\nparlons de votre candidature.',
};

describe('buildContactMailto', () => {
  it('addresses the message to William', () => {
    expect(
      buildContactMailto(VALUES, SUBJECT).startsWith('mailto:william.stoops@epitech.eu?'),
    ).toBe(true);
  });

  it('prefills a subject naming the sender', () => {
    const url = new URL(buildContactMailto(VALUES, SUBJECT));

    expect(url.searchParams.get('subject')).toBe('Contact depuis le portfolio – Ada Lovelace');
  });

  it('puts the message, then the sender and their address, in the body with CRLF line breaks', () => {
    const url = new URL(buildContactMailto(VALUES, SUBJECT));

    expect(url.searchParams.get('body')).toBe(
      'Bonjour William,\r\nparlons de votre candidature.\r\n\r\nAda Lovelace\r\nada@example.com',
    );
  });

  it('percent-encodes spaces instead of using "+", which mail clients would show literally', () => {
    expect(buildContactMailto(VALUES, SUBJECT)).not.toContain('+');
    expect(buildContactMailto(VALUES, SUBJECT)).toContain('%20');
  });
});
