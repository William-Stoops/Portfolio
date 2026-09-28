type AiPracticeItem = { title: string; text: string };

export type AiPracticeContent = {
  title: string;
  subtitle: string;
  items: readonly AiPracticeItem[];
};
