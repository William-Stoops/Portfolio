import { type ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type ButtonLinkProps = ComponentProps<'a'> & {
  variant: 'primary' | 'secondary';
  href: string;
};

// A link styled as a button: calls to action here navigate or download, they never run an
// action in place, so the element stays an <a> (a <button> would lie to assistive tech).
const VARIANT_CLASS_NAMES: Readonly<Record<ButtonLinkProps['variant'], string>> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border-2 border-border-input text-fg hover:bg-surface-raised',
};

export function ButtonLink({ variant, href, className, children, ...linkProps }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 font-semibold no-underline transition-colors duration-150',
        VARIANT_CLASS_NAMES[variant],
        className,
      )}
      {...linkProps}
    >
      {children}
    </a>
  );
}
