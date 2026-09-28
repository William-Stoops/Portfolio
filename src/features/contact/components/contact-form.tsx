import { Button } from '@/components/ui/button';
import { TextAreaField, TextField } from '@/components/ui/form-field';
import { CONTACT_EMAIL } from '@/config/site';
import { useContactForm } from '@/features/contact/hooks/use-contact-form';
import { type ContactFormContent } from '@/features/contact/types/contact-content';

type ContactFormProps = { content: ContactFormContent; openMailto: (url: string) => void };

export function ContactForm({ content, openMailto }: ContactFormProps) {
  const { register, errors, submit, status } = useContactForm(openMailto, content);

  return (
    <form
      noValidate
      aria-describedby="contact-formulaire-aide"
      onSubmit={submit}
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
    >
      <p id="contact-formulaire-aide" className="text-small text-fg-muted">
        {content.help}
      </p>
      <TextField
        id="contact-nom"
        label={content.name}
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextField
        id="contact-email"
        label={content.email}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextAreaField
        id="contact-message"
        label={content.message}
        error={errors.message?.message}
        {...register('message')}
      />
      <Button type="submit" variant="primary" className="self-start">
        {content.submit}
      </Button>
      {/* Mounted from the start so the confirmation is announced when it appears. */}
      <output aria-live="polite" className="text-small text-fg-muted">
        {status === 'mail-client-opened' ? content.sent(CONTACT_EMAIL) : null}
      </output>
    </form>
  );
}
