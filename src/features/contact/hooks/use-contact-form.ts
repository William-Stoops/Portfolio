import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitEvent, useState } from 'react';
import { type FieldErrors, useForm, type UseFormRegister } from 'react-hook-form';

import {
  type ContactFormInput,
  type ContactFormValues,
  createContactFormSchema,
} from '@/features/contact/schemas/contact-form-schema';
import { type ContactFormContent } from '@/features/contact/types/contact-content';
import { buildContactMailto } from '@/features/contact/utils/build-contact-mailto';

type ContactFormStatus = 'idle' | 'mail-client-opened';

export function useContactForm(
  openMailto: (url: string) => void,
  content: ContactFormContent,
): {
  register: UseFormRegister<ContactFormInput>;
  errors: FieldErrors<ContactFormInput>;
  submit: (event: SubmitEvent<HTMLFormElement>) => void;
  status: ContactFormStatus;
} {
  const { register, handleSubmit, formState } = useForm<
    ContactFormInput,
    undefined,
    ContactFormValues
  >({
    resolver: zodResolver(createContactFormSchema(content.errors)),
    // No red fields while typing the first time; re-validate on change once touched.
    mode: 'onTouched',
    defaultValues: { name: '', email: '', message: '' },
    // Invalid submit moves focus to the first invalid field (WCAG 3.3.1).
    shouldFocusError: true,
  });
  const [status, setStatus] = useState<ContactFormStatus>('idle');

  const submitValidForm = handleSubmit((values) => {
    openMailto(buildContactMailto(values, content.mailSubject));
    setStatus('mail-client-opened');
  });

  return {
    register,
    errors: formState.errors,
    submit: (event) => {
      void submitValidForm(event);
    },
    status,
  };
}
