import * as z from 'zod/mini';

// mailto: links become unreliable past ~2 000 characters in some mail clients.
const MESSAGE_MAX_LENGTH = 1500;

export const contactFormSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(1, 'Erreur : saisissez votre nom.')),
  email: z
    .string()
    .check(
      z.trim(),
      z.email('Erreur : saisissez une adresse e-mail valide, par exemple nom@domaine.fr.'),
    ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(10, 'Erreur : écrivez un message d’au moins 10 caractères.'),
      z.maxLength(
        MESSAGE_MAX_LENGTH,
        'Erreur : raccourcissez votre message à 1 500 caractères au plus.',
      ),
    ),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.output<typeof contactFormSchema>;
