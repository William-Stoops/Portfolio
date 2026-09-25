import { type RefObject, useEffect, useRef, useState } from 'react';

// Non-modal disclosure for the header navigation on small screens (no focus trap: the rest
// of the page stays reachable). Escape closes it and returns focus to its button.
export function useMobileMenu(): {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
} {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return {
    isOpen,
    toggle: () => {
      setIsOpen((wasOpen) => !wasOpen);
    },
    close: () => {
      setIsOpen(false);
    },
    buttonRef,
  };
}
