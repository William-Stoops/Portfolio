import { type MouseEvent, type RefObject, useEffect, useRef, useState } from 'react';

// The dialog already covers the viewport; real fullscreen (no browser chrome) is a bonus
// that a browser may refuse: iPhone only allows it on <video>, an embedding frame may not
// delegate it. Anything else is a real error.
async function enterFullscreen(element: HTMLElement): Promise<void> {
  try {
    await element.requestFullscreen();
  } catch (error) {
    if (!(error instanceof TypeError || error instanceof DOMException)) {
      throw error;
    }
  }
}

// Chrome makes everything outside the fullscreen element inert: the opener can only take
// the focus back once fullscreen is over.
async function leaveFullscreenThenFocus(opener: HTMLElement | null): Promise<void> {
  if (document.fullscreenElement !== null) {
    await document.exitFullscreen();
  }
  opener?.focus();
}

// A modal <dialog> brings the focus trap, Escape and the inert page. Its content goes
// fullscreen when it can; leaving fullscreen closes it, so a single Escape always ends the
// video.
export function useFullscreenDialog(): {
  isOpen: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  open: (event: MouseEvent<HTMLElement>) => void;
  close: () => void;
  handleClose: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Browsers do not all give focus back to the opener when a dialog closes: do it here. The
  // opener comes from the event, not document.activeElement: Safari does not focus a
  // clicked button.
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    // The stage is rendered once isOpen is committed: request fullscreen from here. The
    // click's user activation is still valid (it lasts a few seconds).
    if (document.fullscreenEnabled && stageRef.current !== null) {
      void enterFullscreen(stageRef.current);
    }
    function handleFullscreenChange(): void {
      if (document.fullscreenElement === null) {
        dialogRef.current?.close();
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isOpen]);

  function open(event: MouseEvent<HTMLElement>): void {
    openerRef.current = event.currentTarget;
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function close(): void {
    dialogRef.current?.close();
  }

  // Runs for every way of closing (button, Escape, leaving fullscreen): unmounting the
  // player stops the video.
  function handleClose(): void {
    setIsOpen(false);
    void leaveFullscreenThenFocus(openerRef.current);
  }

  return { isOpen, dialogRef, stageRef, open, close, handleClose };
}
