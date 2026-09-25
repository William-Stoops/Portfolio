import { type ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type FieldProps = {
  id: string;
  label: string;
  // French, actionable, starting with "Erreur :" (see the accessibility skill).
  error?: string | undefined;
};

const CONTROL_CLASS_NAME =
  'w-full rounded-md border-2 border-border-input bg-canvas px-3 py-2 text-fg aria-invalid:border-error';

function errorIdOf(id: string): string {
  return `${id}-erreur`;
}

// The error is referenced by aria-describedby: when focus moves to the invalid field after
// a failed submit, screen readers read the label, then the error.
function FieldError({ id, error }: { id: string; error: string | undefined }) {
  return error === undefined ? null : (
    <p id={errorIdOf(id)} className="text-small text-error">
      {error}
    </p>
  );
}

function describedControlProps(id: string, error: string | undefined) {
  return error === undefined ? {} : { 'aria-invalid': true, 'aria-describedby': errorIdOf(id) };
}

export function TextField({
  id,
  label,
  error,
  className,
  ...inputProps
}: FieldProps & Omit<ComponentProps<'input'>, 'id'>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <input
        id={id}
        className={cn(CONTROL_CLASS_NAME, 'min-h-11', className)}
        {...describedControlProps(id, error)}
        {...inputProps}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  className,
  ...textAreaProps
}: FieldProps & Omit<ComponentProps<'textarea'>, 'id'>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(CONTROL_CLASS_NAME, 'min-h-40', className)}
        {...describedControlProps(id, error)}
        {...textAreaProps}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}
