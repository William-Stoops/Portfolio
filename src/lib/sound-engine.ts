import type { SoundName } from '@/lib/play-sound';

type Note = {
  // In hertz.
  frequency: number;
  // When it starts and how long it rings, in seconds from the sound's start.
  at: number;
  length: number;
  // Its loudest, on a 0 to 1 scale: quiet, under the page's own sounds, if any.
  peak: number;
  wave: OscillatorType;
};

// Each sound as a short score of plain tones: no file to fetch, a few bytes each.
const SCORES = {
  tap: [{ frequency: 1568, at: 0, length: 0.05, peak: 0.04, wave: 'triangle' }],
  open: [
    { frequency: 880, at: 0, length: 0.08, peak: 0.035, wave: 'sine' },
    { frequency: 1318.5, at: 0.05, length: 0.1, peak: 0.035, wave: 'sine' },
  ],
  // The two-tone chime of an airliner's cabin: high, then low.
  chime: [
    { frequency: 659.25, at: 0, length: 1.1, peak: 0.06, wave: 'sine' },
    { frequency: 523.25, at: 0.5, length: 1.4, peak: 0.06, wave: 'sine' },
  ],
} as const satisfies Readonly<Record<SoundName, readonly Note[]>>;

// Silence, for the envelope: an exponential ramp cannot reach zero.
const SILENCE = 0.0001;
const ATTACK = 0.008;

// One audio context for the visit, made on the first sound: a gesture has happened by then.
let context: AudioContext | undefined;

export function play(name: SoundName): void {
  context ??= new AudioContext();
  if (context.state === 'suspended') {
    void context.resume();
  }
  const start = context.currentTime;
  for (const { frequency, at, length, peak, wave } of SCORES[name]) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(SILENCE, start + at);
    envelope.gain.exponentialRampToValueAtTime(peak, start + at + ATTACK);
    envelope.gain.exponentialRampToValueAtTime(SILENCE, start + at + length);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(start + at);
    oscillator.stop(start + at + length);
  }
}
