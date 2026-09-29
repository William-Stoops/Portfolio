import { type ContactFormErrors } from '@/features/contact/schemas/contact-form-schema';

export type ContactFormContent = {
  help: string;
  name: string;
  email: string;
  message: string;
  submit: string;
  // Said once the mail client is opened, with the address to use if nothing opens.
  sent: (email: string) => string;
  mailSubject: (senderName: string) => string;
  errors: ContactFormErrors;
};

export type ContactContent = {
  // Anchor of the section, in the page's language.
  id: string;
  title: string;
  location: string;
  // The line that opens the section: an invitation, no claim about William.
  invitation: string;
  labels: {
    email: string;
    copyEmail: string;
    linkedIn: string;
    newTab: string;
    location: string;
  };
  copyAnnouncements: { copied: string; failed: string };
  form: ContactFormContent;
};
