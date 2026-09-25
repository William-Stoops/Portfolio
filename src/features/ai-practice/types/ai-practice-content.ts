type AiPracticeItem = { title: string; text: string };

export type AiPracticeContent = {
  title: string;
  items: readonly AiPracticeItem[];
};
