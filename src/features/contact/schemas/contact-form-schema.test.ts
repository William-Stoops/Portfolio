import { describe, expect, it } from 'vitest';

import { contactFormSchema } from '@/features/contact/schemas/contact-form-schema';

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Parlons de votre profil.',
};

function errorFor(values: Record<string, string>, field: string): string | undefined {
  const result = contactFormSchema.safeParse(values);
  return result.success
    ? undefined
    : result.error.issues.find(({ path }) => path[0] === field)?.message;
}

describe('contactFormSchema', () => {
  it('accepts a complete message and trims the fields', () => {
    const result = contactFormSchema.safeParse({ ...VALID, name: '  Ada Lovelace  ' });

    expect(result.success && result.data.name).toBe('Ada Lovelace');
  });

  it('requires a name', () => {
    expect(errorFor({ ...VALID, name: '   ' }, 'name')).toBe('Erreur : saisissez votre nom.');
  });

  it('requires a valid e-mail address and says how to fix it', () => {
    expect(errorFor({ ...VALID, email: 'ada@' }, 'email')).toBe(
      'Erreur : saisissez une adresse e-mail valide, par exemple nom@domaine.fr.',
    );
  });

  it('requires a message of at least 10 characters', () => {
    expect(errorFor({ ...VALID, message: 'Bonjour' }, 'message')).toBe(
      'Erreur : écrivez un message d’au moins 10 caractères.',
    );
  });

  it('caps the message so the e-mail link stays within what mail clients accept', () => {
    expect(errorFor({ ...VALID, message: 'a'.repeat(1501) }, 'message')).toBe(
      'Erreur : raccourcissez votre message à 1 500 caractères au plus.',
    );
  });
});
