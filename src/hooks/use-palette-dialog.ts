import { type RefObject, useEffect, useRef } from 'react';

// Escape closes the quick search, and only it: the page's own listeners never hear it (the
// mobile menu under the palette would close too, and take the focus away).
function keepEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.stopPropagation();
  }
}

// The quick search opens as a modal dialog as soon as it is mounted (the host mounts it
// only while open): the page behind turns inert, Escape closes it, and the focus goes to
// its search field.
export function usePaletteDialog(): {
  dialogRef: RefObject<HTMLDialogElement | null>;
  fieldRef: RefObject<HTMLInputElement | null>;
} {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return undefined;
    }
    if (!dialog.open) {
      dialog.showModal();
    }
    fieldRef.current?.focus();
    dialog.addEventListener('keydown', keepEscape);
    return () => {
      dialog.removeEventListener('keydown', keepEscape);
    };
  }, []);

  return { dialogRef, fieldRef };
}
