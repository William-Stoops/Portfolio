import { ExternalLink } from 'lucide-react';

import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { CONTACT_EMAIL, LINKEDIN_URL } from '@/config/site';
import { ContactForm } from '@/features/contact/components/contact-form';
import { type ContactContent } from '@/features/contact/types/contact-content';
import { openInMailClient } from '@/features/contact/utils/open-in-mail-client';

type ContactSectionProps = {
  content: ContactContent;
  // Injected so tests can observe the prepared message without leaving the page.
  openMailto?: (url: string) => void;
};

export function ContactSection({ content, openMailto = openInMailClient }: ContactSectionProps) {
  return (
    <PageSection id={SECTION_IDS.contact} title="Contact">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-x-12 gap-y-10">
        <dl className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <dt className="text-small font-semibold text-fg-muted">E-mail</dt>
            <dd>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-6 items-center">
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small font-semibold text-fg-muted">LinkedIn</dt>
            <dd>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-6 items-center gap-1"
              >
                LinkedIn
                <span className="sr-only"> (nouvel onglet)</span>
                <ExternalLink
                  aria-hidden="true"
                  focusable="false"
                  className="size-4"
                  strokeWidth={1.75}
                />
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small font-semibold text-fg-muted">Localisation</dt>
            <dd>{content.location}</dd>
          </div>
        </dl>
        <ContactForm openMailto={openMailto} />
      </div>
    </PageSection>
  );
}
