import { useSyncExternalStore } from 'react';

import { type PageVitals } from '@/features/behind-the-scenes/types/page-vitals';
import { cumulativeLayoutShift, scriptBytes } from '@/features/behind-the-scenes/utils/page-vitals';

const PENDING: PageVitals = {
  firstContentfulPaint: 'pending',
  largestContentfulPaint: 'pending',
  cumulativeLayoutShift: 'pending',
  javascriptBytes: 'pending',
  requests: 'pending',
};

type LayoutShift = { value: number; startTime: number; hadRecentInput: boolean };

// One store for the page, fed by the browser's performance timeline while someone reads it.
let vitals = PENDING;
let shifts: readonly LayoutShift[] = [];
let observers: readonly PerformanceObserver[] = [];
const listeners = new Set<() => void>();

function publish(change: Partial<PageVitals>): void {
  vitals = { ...vitals, ...change };
  for (const listener of listeners) {
    listener();
  }
}

// The DOM has no type for layout-shift entries yet: read their fields where they are.
function layoutShiftsOf(entry: PerformanceEntry): LayoutShift[] {
  return 'value' in entry &&
    typeof entry.value === 'number' &&
    'hadRecentInput' in entry &&
    typeof entry.hadRecentInput === 'boolean'
    ? [{ value: entry.value, startTime: entry.startTime, hadRecentInput: entry.hadRecentInput }]
    : [];
}

// Watches one kind of entry, those recorded before the page asked included (buffered).
// Returns whether this browser records it at all.
function watch(type: string, onEntries: (entries: PerformanceEntryList) => void): boolean {
  if (!PerformanceObserver.supportedEntryTypes.includes(type)) {
    return false;
  }
  const observer = new PerformanceObserver((list) => {
    onEntries(list.getEntries());
  });
  observer.observe({ type, buffered: true });
  observers = [...observers, observer];
  return true;
}

function readResources(): void {
  const resources = performance
    .getEntriesByType('resource')
    .filter((entry) => entry instanceof PerformanceResourceTiming);
  publish({ javascriptBytes: scriptBytes(resources), requests: resources.length + 1 });
}

function start(): void {
  const paints = watch('paint', (entries) => {
    const firstContentfulPaint = entries.find(({ name }) => name === 'first-contentful-paint');
    if (firstContentfulPaint !== undefined) {
      publish({ firstContentfulPaint: firstContentfulPaint.startTime });
    }
  });
  const largestPaints = watch('largest-contentful-paint', (entries) => {
    const latest = entries.at(-1);
    if (latest !== undefined) {
      publish({ largestContentfulPaint: latest.startTime });
    }
  });
  const layoutShifts = watch('layout-shift', (entries) => {
    shifts = [...shifts, ...entries.flatMap((entry) => layoutShiftsOf(entry))];
    publish({ cumulativeLayoutShift: cumulativeLayoutShift(shifts) });
  });
  const resources = watch('resource', readResources);
  publish({
    ...(paints ? {} : { firstContentfulPaint: 'unsupported' }),
    ...(largestPaints ? {} : { largestContentfulPaint: 'unsupported' }),
    // Nothing has moved until a shift says so.
    cumulativeLayoutShift: layoutShifts ? cumulativeLayoutShift(shifts) : 'unsupported',
    ...(resources ? {} : { javascriptBytes: 'unsupported', requests: 'unsupported' }),
  });
}

function stop(): void {
  for (const observer of observers) {
    observer.disconnect();
  }
  observers = [];
  shifts = [];
  vitals = PENDING;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (listeners.size === 1) {
    start();
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      stop();
    }
  };
}

// The vitals of this visit, as the visitor's own browser measures them: the page that loaded
// first, then whatever it fetched since.
export function usePageVitals(): PageVitals {
  return useSyncExternalStore(
    subscribe,
    () => vitals,
    () => PENDING,
  );
}
