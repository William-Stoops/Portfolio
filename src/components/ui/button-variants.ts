export type ButtonVariant = 'primary' | 'secondary';

// Shared by <Button> (actions) and <ButtonLink> (navigation): same look, right element.
export const BUTTON_BASE_CLASS_NAME =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 font-semibold no-underline transition-colors duration-150';

export const BUTTON_VARIANT_CLASS_NAMES: Readonly<Record<ButtonVariant, string>> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border-2 border-border-input text-fg hover:bg-surface-raised',
};
