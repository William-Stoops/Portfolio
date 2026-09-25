import { type ComponentProps } from 'react';

import {
  BUTTON_BASE_CLASS_NAME,
  BUTTON_VARIANT_CLASS_NAMES,
  type ButtonVariant,
} from '@/components/ui/button-variants';
import { cn } from '@/lib/cn';

type ButtonLinkProps = ComponentProps<'a'> & {
  variant: ButtonVariant;
  href: string;
};

// A link styled as a button: calls to action here navigate or download, they never run an
// action in place, so the element stays an <a> (a <button> would lie to assistive tech).
export function ButtonLink({ variant, href, className, children, ...linkProps }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(BUTTON_BASE_CLASS_NAME, BUTTON_VARIANT_CLASS_NAMES[variant], className)}
      {...linkProps}
    >
      {children}
    </a>
  );
}
