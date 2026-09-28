import { type RefObject, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { runViewTransition } from '@/lib/view-transition';

// motion.css names the two frames and times their morph for this type of transition only.
const VIDEO_MORPH = 'video-morph';

// The frame grows into a poster (the player's, or the button's on the way back): it must
// be decoded before the new state is captured, or the frame would open onto an empty box.
// A picture that fails to decode must not hold the video back.
async function whenPosterDecoded(frame: HTMLElement | null): Promise<void> {
  const poster = frame?.querySelector('img') ?? null;
  if (poster === null) {
    return;
  }
  try {
    await poster.decode();
  } catch (error) {
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }
}

// The poster grows into a modal <dialog> covering the viewport, and shrinks back into the
// page when it closes: the video opens where it was, never on a blank screen. The native
// dialog brings the focus trap, Escape and the inert page. The page's own fullscreen is
// not requested: the browser's animation into it cut the morph short, and the player
// keeps its fullscreen button.
export function useVideoDialog(): {
  isOpen: boolean;
  isPlayerReady: boolean;
  posterRef: RefObject<HTMLButtonElement | null>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  posterMorphName: string;
  stageMorphName: string;
  open: () => void;
  close: () => void;
  handleCancel: (event: { preventDefault: () => void }) => void;
  handleClose: () => void;
  handlePlayerLoad: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);
  // The player stays hidden over the poster until its page has loaded.
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const posterRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // One name, carried by whichever frame is on screen: the morph pairs them by it.
  const morphName = useId();

  function open(): void {
    runViewTransition(VIDEO_MORPH, async () => {
      flushSync(() => {
        setIsOpen(true);
      });
      dialogRef.current?.showModal();
      await whenPosterDecoded(stageRef.current);
    });
  }

  function close(): void {
    runViewTransition(VIDEO_MORPH, async () => {
      flushSync(() => {
        setIsOpen(false);
        setIsPlayerReady(false);
      });
      dialogRef.current?.close();
      await whenPosterDecoded(posterRef.current);
    });
  }

  // Escape would close the dialog at once: it goes back through the same morph.
  function handleCancel(event: { preventDefault: () => void }): void {
    event.preventDefault();
    close();
  }

  // Runs for every way of closing: unmounting the player stops the video. Browsers do not
  // all give the focus back to the opener when a dialog closes: do it here.
  function handleClose(): void {
    setIsOpen(false);
    setIsPlayerReady(false);
    posterRef.current?.focus();
  }

  function handlePlayerLoad(): void {
    setIsPlayerReady(true);
  }

  return {
    isOpen,
    isPlayerReady,
    posterRef,
    dialogRef,
    stageRef,
    posterMorphName: isOpen ? 'none' : morphName,
    stageMorphName: isOpen ? morphName : 'none',
    open,
    close,
    handleCancel,
    handleClose,
    handlePlayerLoad,
  };
}
