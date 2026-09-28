import { SECTION_IDS } from '@/config/paths';
import { type ContactContent } from '@/features/contact/types/contact-content';
import { NEW_TAB_HINT } from '@/i18n/common-messages';
import { formatNumber } from '@/utils/format-number';

// Translation of contact-content.fr.ts (ADR 0026).
export const CONTACT_CONTENT = {
  id: SECTION_IDS.en.contact,
  title: 'Contact',
  location: 'Paris, Lille or fully remote',
  invitation: 'A role, an assignment or a question? Write to me.',
  labels: {
    email: 'Email',
    copyEmail: 'Copy the email address',
    linkedIn: 'LinkedIn',
    newTab: NEW_TAB_HINT.en,
    location: 'Location',
  },
  copyAnnouncements: {
    copied: 'Email address copied',
    failed: 'Could not copy: select the address to copy it',
  },
  form: {
    help: 'All fields are required. The form prepares the email in your own mail app.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Prepare the email',
    sent: (email) =>
      `Your mail app opens with the message ready to send. If nothing opens, write to ${email}.`,
    mailSubject: (senderName) => `Contact from the portfolio – ${senderName}`,
    errors: {
      name: 'Error: enter your name.',
      email: 'Error: enter a valid email address, for example name@domain.com.',
      messageTooShort: (minimum) =>
        `Error: write a message of at least ${formatNumber(minimum, 'en')} characters.`,
      messageTooLong: (maximum) =>
        `Error: shorten your message to ${formatNumber(maximum, 'en')} characters at most.`,
    },
  },
} as const satisfies ContactContent;
