type JourneyStop = {
  // Anchor of the stop in the page, in the page's language.
  id: string;
  // What the stop holds is chosen by its year: the same in every language.
  year: number;
  // The school year at Epitech, or what the year stands for.
  label: string;
  title: string;
  // What happened, when no card of another section tells it.
  note?: string;
};

export type JourneyContent = {
  // Anchor of the section, in the page's language.
  id: string;
  title: string;
  stops: readonly JourneyStop[];
};
