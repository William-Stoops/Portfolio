import { type ReactNode } from 'react';

type BadgeProps = { children: ReactNode };

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border bg-surface-raised px-2.5 py-1 text-small text-fg-muted">
      {children}
    </span>
  );
}
