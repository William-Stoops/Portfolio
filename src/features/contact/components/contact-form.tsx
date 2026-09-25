import { Button } from '@/components/ui/button';
import { TextAreaField, TextField } from '@/components/ui/form-field';
import { CONTACT_EMAIL } from '@/config/site';
import { useContactForm } from '@/features/contact/hooks/use-contact-form';

type ContactFormProps = { openMailto: (url: string) => void };

export function ContactForm({ openMailto }: ContactFormProps) {
  const { register, errors, submit, status } = useContactForm(openMailto);

  return (
    <form
      noValidate
      aria-describedby="contact-formulaire-aide"
      onSubmit={submit}
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
    >
      <p id="contact-formulaire-aide" className="text-small text-fg-muted">
        Tous les champs sont obligatoires. Le formulaire prépare l’e-mail dans votre messagerie.
      </p>
      <TextField
        id="contact-nom"
        label="Nom"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextField
        id="contact-email"
        label="E-mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextAreaField
        id="contact-message"
        label="Message"
        error={errors.message?.message}
        {...register('message')}
      />
      <Button type="submit" variant="primary" className="self-start">
        Préparer l’e-mail
      </Button>
      {/* Mounted from the start so the confirmation is announced when it appears. */}
      <output aria-live="polite" className="text-small text-fg-muted">
        {status === 'mail-client-opened'
          ? `Votre messagerie s’ouvre avec le message prêt à envoyer. Si rien ne s’ouvre, écrivez à ${CONTACT_EMAIL}.`
          : null}
      </output>
    </form>
  );
}
