// Numbers shown as labels ("01", "02"…): sections, list items.
export function formatTwoDigits(value: number): string {
  return String(value).padStart(2, '0');
}
