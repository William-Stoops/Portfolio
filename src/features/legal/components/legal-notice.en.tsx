import { CONTACT_EMAIL, HOSTING_PROVIDER, SITE_OWNER } from '@/config/site';
import { LegalBlock } from '@/features/legal/components/legal-block';

// Translation of legal-notice.fr.tsx (ADR 0026), for the reader: the French notice is the
// one French law requires, and it prevails.
export function LegalNotice() {
  return (
    <>
      <LegalBlock title="Publisher">
        <p>
          This site is published in a personal capacity by <strong>{SITE_OWNER}</strong>, who is
          also its director of publication.
        </p>
        <p>
          Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalBlock>
      <LegalBlock title="Hosting">
        <p>
          <strong>{HOSTING_PROVIDER.name}</strong>
          <br />
          {HOSTING_PROVIDER.address.en}
          <br />
          Phone: {HOSTING_PROVIDER.phone}
          <br />
          <a href={HOSTING_PROVIDER.website}>{HOSTING_PROVIDER.website}</a>
        </p>
      </LegalBlock>
      <LegalBlock title="Personal data and cookies">
        <p>This site collects no personal data and sets no cookies.</p>
        <ul>
          <li>
            Your choice of theme (light, dark or system) and, if you change it, of language are
            stored in your browser’s local storage. They are sent to no one and are erased with the
            site’s data. When you switch languages, the place you were reading is kept just long
            enough to open the other version, then erased.
          </li>
          <li>
            The contact form sends nothing to a server: it prepares an email in your own mail app,
            which you choose to send or not.
          </li>
          <li>
            The YouTube video is only loaded, from youtube-nocookie.com, if you play it. YouTube’s
            own privacy policy then applies.
          </li>
          <li>
            The host may process technical logs (including the IP address) needed for the service to
            run and stay secure.
          </li>
        </ul>
      </LegalBlock>
      <LegalBlock title="Intellectual property">
        <p>The texts and photographs on this site may not be reproduced without permission.</p>
        <p>
          Inter Tight font under the SIL Open Font License, Lucide icons under the ISC license. The
          globe’s continents are drawn from Natural Earth, in the public domain.
        </p>
      </LegalBlock>
      <LegalBlock title="Language of this notice">
        <p>
          This notice translates the French <span lang="fr">mentions légales</span>, which French
          law requires and which prevail.
        </p>
      </LegalBlock>
    </>
  );
}
