export type JourneyStop = {
  // Anchor of the stop in the page.
  id: string;
  year: number;
  // The school year at Epitech, or what the year stands for.
  label: string;
  title: string;
  // What happened, when no card of another section tells it.
  note?: string;
};
