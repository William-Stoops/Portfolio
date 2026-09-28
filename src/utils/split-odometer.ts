type Odometer = { fixed: string; rolling: readonly string[] };

// An odometer of years: the leading digits all the years share stay still, the others
// roll from one year to the next. At least one digit always rolls.
export function splitOdometer(years: readonly number[]): Odometer {
  const labels = years.map(String);
  const shortest = Math.min(...labels.map((label) => label.length));
  let shared = 0;
  while (shared < shortest - 1 && labels.every((label) => label[shared] === labels[0]?.[shared])) {
    shared += 1;
  }
  return {
    fixed: labels[0]?.slice(0, shared) ?? '',
    rolling: labels.map((label) => label.slice(shared)),
  };
}
