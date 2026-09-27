type AiPracticeItem = { title: string; text: string };

export type AiPracticeContent = {
  // Anchor of the section, in the page's language.
  id: string;
  title: string;
  subtitle: string;
  items: readonly AiPracticeItem[];
};
