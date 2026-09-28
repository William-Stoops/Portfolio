import { Volume2, VolumeX } from 'lucide-react';

import { useSoundPreference } from '@/hooks/use-sound-preference';
import { useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { playSound } from '@/lib/play-sound';

const SOUND_TOGGLE_MESSAGES: Localized<{ label: string }> = {
  fr: { label: 'Sons' },
  en: { label: 'Sounds' },
};

// The site's few sounds, off until the visitor turns them on (ADR 0035): a toggle button,
// its state said by aria-pressed and shown by its icon. Turned on, it plays a tap, so the
// visitor hears what they chose.
export function SoundToggle() {
  const { isSoundOn, setSoundOn } = useSoundPreference();
  const messages = useLocalized(SOUND_TOGGLE_MESSAGES);

  return (
    <button
      type="button"
      aria-pressed={isSoundOn}
      onClick={() => {
        setSoundOn(!isSoundOn);
        playSound('tap');
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-md text-small text-fg-muted transition-colors duration-150 hover:text-fg aria-pressed:text-fg"
    >
      {isSoundOn ? (
        <Volume2 aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-4" />
      ) : (
        <VolumeX aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-4" />
      )}
      {messages.label}
    </button>
  );
}
