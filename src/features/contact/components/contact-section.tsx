import { Check, Copy, ExternalLink } from 'lucide-react';

import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { CONTACT_EMAIL, LINKEDIN_URL } from '@/config/site';
import { ContactForm } from '@/features/contact/components/contact-form';
import { useCopyToClipboard } from '@/features/contact/hooks/use-copy-to-clipboard';
import { type ContactContent } from '@/features/contact/types/contact-content';
import { openInMailClient } from '@/features/contact/utils/open-in-mail-client';

type ContactSectionProps = {
  content: ContactContent;
  // Injected so tests can observe the prepared message without leaving the page.
  openMailto?: (url: string) => void;
};

export function ContactSection({ content, openMailto = openInMailClient }: ContactSectionProps) {
  const { status, announcement, copy } = useCopyToClipboard();

  return (
    <PageSection id={SECTION_IDS.contact} title="Contact">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-x-12 gap-y-10">
        <dl className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <dt className="text-small font-semibold text-fg-muted">E-mail</dt>
            {/* The address is the point of the section: set large, and copied in one click. */}
            <dd className="flex flex-col items-start gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor="Écrire"
                className="inline-flex min-h-11 items-center font-display text-h3 font-semibold [overflow-wrap:anywhere] decoration-2 transition-[text-underline-offset] duration-250 ease-out hover:underline-offset-8"
              >
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                onClick={() => {
                  void copy(CONTACT_EMAIL);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-border-input px-4 font-semibold transition-colors duration-150 hover:bg-surface-raised"
              >
                {status === 'copied' ? (
                  <Check
                    aria-hidden="true"
                    focusable="false"
                    className="size-5 enter-pop text-success"
                    strokeWidth={1.75}
                  />
                ) : (
                  <Copy
                    aria-hidden="true"
                    focusable="false"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                )}
                Copier l’adresse e-mail
              </button>
              {/* aria-live is implicit on <output>, but not every screen reader honours it. */}
              <output aria-live="polite" className="text-small text-fg-muted">
                {announcement}
              </output>
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
