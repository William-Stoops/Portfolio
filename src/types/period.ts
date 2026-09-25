// "2024" (year precision) or "2025-09" (month precision), checked at compile time.
type PeriodPoint = `${number}` | `${number}-${number}`;

export type Period = {
  start: PeriodPoint;
  // Absent while the activity is ongoing.
  end?: PeriodPoint;
};
