import { type ContactContent } from '@/features/contact/types/contact-content';

// Source: docs/content/cv-source.md (identity and "Formation": Paris, Lille ou full remote).
export const CONTACT_CONTENT = {
  location: 'Paris, Lille ou full remote',
  invitation: 'Une question, une proposition ? Écrivez-moi.',
} as const satisfies ContactContent;
