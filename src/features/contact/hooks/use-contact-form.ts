import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitEvent, useState } from 'react';
import { type FieldErrors, useForm, type UseFormRegister } from 'react-hook-form';

import {
  type ContactFormInput,
  type ContactFormValues,
  contactFormSchema,
} from '@/features/contact/schemas/contact-form-schema';
import { buildContactMailto } from '@/features/contact/utils/build-contact-mailto';

type ContactFormStatus = 'idle' | 'mail-client-opened';

export function useContactForm(openMailto: (url: string) => void): {
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
    resolver: zodResolver(contactFormSchema),
    // No red fields while typing the first time; re-validate on change once touched.
    mode: 'onTouched',
    defaultValues: { name: '', email: '', message: '' },
    // Invalid submit moves focus to the first invalid field (WCAG 3.3.1).
    shouldFocusError: true,
  });
  const [status, setStatus] = useState<ContactFormStatus>('idle');

  const submitValidForm = handleSubmit((values) => {
    openMailto(buildContactMailto(values));
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
