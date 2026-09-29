import { type RefObject, useRef, useState } from 'react';

// The site menu, a modal <dialog> opened by its round button: the native dialog brings the
// focus trap, Escape and the inert page behind. Browsers do not all give the focus back to
// the opener when a dialog closes (Safari does not focus a button it clicks): the close
// handler does it, unless the visitor left for somewhere else (a section, the quick
// search), which then owns the focus.
export function useMenuDialog(): {
  isOpen: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  leave: () => void;
  handleClose: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const givesFocusBack = useRef(true);

  function open(): void {
    givesFocusBack.current = true;
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function close(): void {
    dialogRef.current?.close();
  }

  function leave(): void {
    givesFocusBack.current = false;
    dialogRef.current?.close();
  }

  // Runs for every way of closing, Escape included.
  function handleClose(): void {
    setIsOpen(false);
    if (givesFocusBack.current) {
      buttonRef.current?.focus();
    }
  }

  return { isOpen, buttonRef, dialogRef, open, close, leave, handleClose };
}
