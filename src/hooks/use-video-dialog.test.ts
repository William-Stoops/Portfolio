import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useVideoDialog } from '@/hooks/use-video-dialog';

afterEach(() => {
  document.body.replaceChildren();
});

// The hook drives elements its component renders: stand-ins, wired the same way.
async function renderVideoDialog() {
  const rendered = await renderHook(() => useVideoDialog());
  const poster = document.createElement('button');
  const dialog = document.createElement('dialog');
  document.body.append(poster, dialog);
  rendered.result.current.posterRef.current = poster;
  rendered.result.current.dialogRef.current = dialog;
  dialog.addEventListener('close', () => {
    rendered.result.current.handleClose();
  });
  return { ...rendered, poster, dialog };
}

describe('useVideoDialog', () => {
  it('names the poster for the morph while closed, and the stage while open', async () => {
    const { result, act, dialog } = await renderVideoDialog();
    const morphName = result.current.posterMorphName;
    expect(morphName).not.toBe('none');
    expect(result.current.stageMorphName).toBe('none');

    await act(() => {
      result.current.open();
    });

    await expect.poll(() => dialog.open).toBe(true);
    expect(result.current.isOpen).toBe(true);
    expect(result.current.posterMorphName).toBe('none');
    expect(result.current.stageMorphName).toBe(morphName);
  });

  it('reveals the player only once it has loaded, and forgets it when the video closes', async () => {
    const { result, act, dialog } = await renderVideoDialog();
    await act(() => {
      result.current.open();
    });
    await expect.poll(() => dialog.open).toBe(true);
    expect(result.current.isPlayerReady).toBe(false);

    await act(() => {
      result.current.handlePlayerLoad();
    });
    expect(result.current.isPlayerReady).toBe(true);

    await act(() => {
      result.current.close();
    });
    await expect.poll(() => dialog.open).toBe(false);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isPlayerReady).toBe(false);
  });

  it('closes on Escape through the same morph as the close button', async () => {
    const { result, act, dialog } = await renderVideoDialog();
    await act(() => {
      result.current.open();
    });
    await expect.poll(() => dialog.open).toBe(true);
    const cancel = new Event('cancel', { cancelable: true });

    await act(() => {
      result.current.handleCancel(cancel);
    });

    expect(cancel.defaultPrevented).toBe(true);
    await expect.poll(() => dialog.open).toBe(false);
  });

  it('gives the focus back to the play button once the video is closed', async () => {
    const { result, act, dialog, poster } = await renderVideoDialog();
    await act(() => {
      result.current.open();
    });
    await expect.poll(() => dialog.open).toBe(true);

    await act(() => {
      result.current.close();
    });

    await expect.poll(() => document.activeElement).toBe(poster);
  });
});
