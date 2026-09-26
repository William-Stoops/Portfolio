import { type ReactNode } from 'react';

type BadgeProps = { children: ReactNode };

export function Badge({ children }: BadgeProps) {
  return (
    // A little lift on hover, like a sticker being picked up.
    <span className="inline-flex items-center rounded-sm border border-border bg-surface-raised px-2.5 py-1 text-small text-fg-muted transition-[translate,rotate,border-color] duration-250 ease-out hover:-translate-y-0.5 hover:-rotate-2 hover:border-accent">
      {children}
    </span>
  );
}
