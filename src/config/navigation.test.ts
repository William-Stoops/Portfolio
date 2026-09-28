import { describe, expect, it } from 'vitest';

import { FOOTER_LINKS, NAV_ITEMS } from '@/config/navigation';

describe('NAV_ITEMS', () => {
  it('links each home section in French, by its French anchor', () => {
    expect(NAV_ITEMS.fr).toEqual([
      { label: 'À propos', href: '/fr#a-propos' },
      { label: 'Parcours', href: '/fr#parcours' },
      { label: 'IA', href: '/fr#ia' },
      { label: 'Compétences', href: '/fr#competences' },
      { label: 'Contact', href: '/fr#contact' },
    ]);
  });

  it('links each home section in English, by its English anchor', () => {
    expect(NAV_ITEMS.en).toEqual([
      { label: 'About', href: '/en#about' },
      { label: 'Journey', href: '/en#journey' },
      { label: 'AI', href: '/en#ai' },
      { label: 'Skills', href: '/en#skills' },
      { label: 'Contact', href: '/en#contact' },
    ]);
  });
});

describe('FOOTER_LINKS', () => {
  it('links the pages outside the home page, in each language', () => {
    expect(FOOTER_LINKS).toEqual({
      fr: [
        { label: 'Accessibilité', path: '/fr/accessibilite' },
        { label: 'Mentions légales', path: '/fr/mentions-legales' },
        { label: 'Plan du site', path: '/fr/plan-du-site' },
      ],
      en: [
        { label: 'Accessibility', path: '/en/accessibility' },
        { label: 'Legal notice', path: '/en/legal-notice' },
        { label: 'Site map', path: '/en/site-map' },
      ],
    });
  });
});
