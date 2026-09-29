// A measure as the browser gives it: a number once measured, 'pending' until then (and in
// the prerendered page, which no browser has measured), 'unsupported' where this browser
// does not record it, 'background' for a paint that waited for a hidden page to be shown.
export type Vital = number | 'pending' | 'unsupported' | 'background';

export type PageVitals = {
  // In milliseconds from the start of the navigation.
  firstContentfulPaint: Vital;
  largestContentfulPaint: Vital;
  cumulativeLayoutShift: Vital;
  // The JavaScript fetched, compressed, in bytes.
  javascriptBytes: Vital;
  // The files fetched, the page itself included.
  requests: Vital;
};
