import { CONTACT_EMAIL, SITE_OWNER } from '@/config/site';
import { LegalBlock } from '@/features/legal/components/legal-block';

// Translation of accessibility-statement.fr.tsx (ADR 0026). Honest by construction: no
// conformance rate is claimed until a full RGAA audit exists, and manual screen-reader
// tests are listed as still to do.
export function AccessibilityStatement() {
  return (
    <>
      <p className="max-w-prose text-lead text-fg-muted">
        {SITE_OWNER} is committed to making this site accessible. As a personal site, it is not
        subject to the accessibility obligation of article 47 of French law no. 2005-102, but it
        targets WCAG 2.2 level AA and follows the method of the RGAA 4.1.2, the French accessibility
        framework.
      </p>
      <LegalBlock title="Conformance status">
        <p>No full RGAA audit has been carried out yet: no conformance rate is claimed.</p>
      </LegalBlock>
      <LegalBlock title="Checks carried out">
        <ul>
          <li>
            Automated axe-core tests on every page, in the light and dark themes, on five device
            profiles (phones, tablet, computers).
          </li>
          <li>
            Contrast computed for every pair of colors on the site, in both themes: 4.5:1 for text,
            3:1 for components.
          </li>
          <li>
            Keyboard journeys tested: skip link, tab order, focus always visible and never entirely
            hidden, mobile menu, contact form.
          </li>
          <li>
            No horizontal scrolling from 320 to 2,560 pixels wide, pages readable without
            JavaScript.
          </li>
        </ul>
        <p>
          Still to do: tests with the NVDA (Windows) and VoiceOver (macOS and iOS) screen readers,
          and a 400% zoom checked by hand.
        </p>
      </LegalBlock>
      <LegalBlock title="Non-accessible content">
        <p>
          The YouTube video player is third-party content: its accessibility does not depend on this
          site. The video also remains available through a direct link to YouTube.
        </p>
      </LegalBlock>
      <LegalBlock title="Preparation of this statement">
        <p>Statement prepared on September 25, 2026, updated on September 27, 2026.</p>
        <ul>
          <li>Technologies: HTML, CSS, JavaScript (React), WAI-ARIA.</li>
          <li>
            Tools: axe-core, Playwright (Chromium and WebKit), Vitest, Lighthouse, WCAG contrast
            computation.
          </li>
          <li>
            Pages covered: home, accessibility statement, legal notice, site map, 404 error page, in
            French and in English.
          </li>
        </ul>
      </LegalBlock>
      <LegalBlock title="Feedback and contact">
        <p>
          If you have difficulty accessing any content, write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>: an accessible alternative will be
          offered to you.
        </p>
      </LegalBlock>
      <LegalBlock title="Remedies">
        <p>
          If you do not get a satisfactory answer, you can refer the matter to the{' '}
          <a href="https://www.defenseurdesdroits.fr" hrefLang="fr" lang="fr">
            Défenseur des droits
          </a>
          , the French rights ombudsman.
        </p>
      </LegalBlock>
    </>
  );
}
