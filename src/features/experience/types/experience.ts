// "2024" (year precision) or "2025-09" (month precision), checked at compile time.
type PeriodPoint = `${number}` | `${number}-${number}`;

export type Period = {
  start: PeriodPoint;
  // Absent while the role is ongoing.
  end?: PeriodPoint;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  companyDescription?: string;
  period: Period;
  stack?: readonly string[];
  // CV wording; passages the CV sets in bold are wrapped in **double asterisks**.
  highlights: readonly string[];
};
