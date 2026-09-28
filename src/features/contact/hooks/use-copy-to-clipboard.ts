import { useState } from 'react';

type CopyStatus = 'idle' | 'copied' | 'failed';

// The Clipboard API is refused outside secure contexts, without permission, or missing on
// old browsers: each case ends in a message, never in silence.
export function useCopyToClipboard(announcements: { copied: string; failed: string }): {
  status: CopyStatus;
  announcement: string;
  copy: (text: string) => Promise<void>;
} {
  const [status, setStatus] = useState<CopyStatus>('idle');

  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch (error) {
      if (!(error instanceof DOMException || error instanceof TypeError)) {
        throw error;
      }
      setStatus('failed');
    }
  }

  return { status, announcement: status === 'idle' ? '' : announcements[status], copy };
}
