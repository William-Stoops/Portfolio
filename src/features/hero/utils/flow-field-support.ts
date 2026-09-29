const MOTION_WELCOME = '(prefers-reduced-motion: no-preference)';

// The field only moves: where motion is unwelcome or data is being saved, the still
// gradient of the same tokens is the whole of it (ADR 0037).
export function canRunFlowField(
  matches: (query: string) => boolean,
  isDataSaved: boolean,
): boolean {
  return matches(MOTION_WELCOME) && !isDataSaved;
}
