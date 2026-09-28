// A measure as the browser gives it: a number once measured, 'pending' until then (and in
// the prerendered page, which no browser has measured), 'unsupported' where this browser
// does not record it.
export type Vital = number | 'pending' | 'unsupported';

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
