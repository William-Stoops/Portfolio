import * as z from 'zod/mini';

const MESSAGE_MIN_LENGTH = 10;
// mailto: links become unreliable past ~2 000 characters in some mail clients.
const MESSAGE_MAX_LENGTH = 1500;

// What the form says when a field is wrong, in the page's language: how to fix it, the
// limits given by the schema itself.
export type ContactFormErrors = {
  name: string;
  email: string;
  messageTooShort: (minimum: number) => string;
  messageTooLong: (maximum: number) => string;
};

export function createContactFormSchema(errors: ContactFormErrors) {
  return z.object({
    name: z.string().check(z.trim(), z.minLength(1, errors.name)),
    email: z.string().check(z.trim(), z.email(errors.email)),
    message: z
      .string()
      .check(
        z.trim(),
        z.minLength(MESSAGE_MIN_LENGTH, errors.messageTooShort(MESSAGE_MIN_LENGTH)),
        z.maxLength(MESSAGE_MAX_LENGTH, errors.messageTooLong(MESSAGE_MAX_LENGTH)),
      ),
  });
}

type ContactFormSchema = ReturnType<typeof createContactFormSchema>;

export type ContactFormInput = z.input<ContactFormSchema>;
export type ContactFormValues = z.output<ContactFormSchema>;
