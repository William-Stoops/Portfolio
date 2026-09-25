import { CONTACT_EMAIL } from '@/config/site';
import { type ContactFormValues } from '@/features/contact/schemas/contact-form-schema';

// RFC 6068: line breaks are CRLF, spaces are %20 (encodeURIComponent, never "+").
const LINE_BREAK = '\r\n';

export function buildContactMailto({ name, email, message }: ContactFormValues): string {
  const subject = `Contact depuis le portfolio – ${name}`;
  const body = [message.replaceAll(/\r?\n/g, LINE_BREAK), '', name, email].join(LINE_BREAK);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
