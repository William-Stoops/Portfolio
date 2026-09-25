import { type ComponentProps } from 'react';

import {
  BUTTON_BASE_CLASS_NAME,
  BUTTON_VARIANT_CLASS_NAMES,
  type ButtonVariant,
} from '@/components/ui/button-variants';
import { cn } from '@/lib/cn';

type ButtonProps = ComponentProps<'button'> & {
  variant: ButtonVariant;
  // Required: a <button> defaults to "submit", which silently submits enclosing forms.
  type: 'button' | 'submit';
};

export function Button({ variant, type, className, children, ...buttonProps }: ButtonProps) {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={cn(BUTTON_BASE_CLASS_NAME, BUTTON_VARIANT_CLASS_NAMES[variant], className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
