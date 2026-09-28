import { HANOK_CAFE_PICTURE, NIGHT_PAVILION_PICTURE } from '@/features/korea/data/korea-pictures';
import { type KoreaContent } from '@/features/korea/types/korea-content';

// Translation of korea-content.fr.ts (ADR 0026): the same year, words and photos. Coming
// home, the greeting stays French, marked as such and translated.
export const KOREA_CONTENT = {
  greeting: { korean: '안녕하세요', translation: 'hello' },
  lead: 'A year at Korea University, in South Korea, taught in English: deep learning and computer vision.',
  route: { origin: { name: 'France' }, destination: { name: 'South Korea', korean: '한국' } },
  homecoming: {
    farewell: { korean: '안녕히 계세요', translation: 'goodbye' },
    greeting: { text: 'Bonjour.', lang: 'fr', translation: 'hello' },
  },
  university: { korean: '고려대학교', name: 'Korea University' },
  figures: [
    { value: '61st', label: 'in the QS World University Rankings' },
    { value: '1 year', label: 'of courses in English' },
    { value: '3', label: 'models trained' },
  ],
  coursework: {
    title: 'What I learned there',
    lead: 'A year to go from using models to building them: the mathematics first, then how a network learns, computation by computation, and the architectures that came of it.',
    mathematics: {
      title: 'The mathematics',
      course: 'Linear algebra',
      source: 'On Gilbert Strang’s textbook, Introduction to Linear Algebra',
      topics: [
        'Matrices and factorizations',
        'Vector spaces',
        'Orthogonality and least squares',
        'Eigenvalues',
        'SVD',
        'Backpropagation and stochastic gradient descent',
      ],
    },
    learning: {
      title: 'Learning',
      topics: [
        {
          name: 'Forward and backward propagation',
          detail:
            'Computed step by step: the output layer by layer, then the error’s gradient carried back by the chain rule.',
        },
        {
          name: 'Supervised learning',
          detail:
            'Learning from labelled examples, narrowing the gap between prediction and truth.',
        },
        {
          name: 'Reinforcement learning',
          detail: 'Learning by acting: an agent, an environment, a reward to maximize.',
        },
      ],
    },
    architectures: {
      title: 'The architectures',
      lineage: [
        { name: 'MLP', role: 'Dense layers: the basic network.' },
        { name: 'CNN', role: 'Convolutions, for images.' },
        { name: 'RNN', role: 'A memory, for sequences.' },
        { name: 'LSTM', role: 'A long memory, keeping what matters.' },
        { name: 'Transformer', role: 'Attention, at the heart of LLMs.' },
      ],
    },
    propagation: {
      forward: 'Forward propagation: the input crosses the network to the prediction.',
      backward: 'Backpropagation: the error flows back, layer by layer, to correct every weight.',
    },
  },
  models: [
    { name: 'Fine-tuned BERT', detail: 'Text classification, with Hugging Face.' },
    { name: 'CNN', detail: 'The state of a chess game, recognized from an image of the board.' },
    { name: 'Gesture detector', detail: 'In real time, YOLO-style, on a webcam feed.' },
  ],
  band: {
    korean: ['고려대학교', '한국', '딥러닝', '컴퓨터 비전'],
    translation: ['Korea University', 'South Korea', 'Deep learning', 'Computer vision'],
  },
  photos: [
    {
      picture: HANOK_CAFE_PICTURE,
      alt: 'An open laptop showing code, in a café with traditional wooden beams, facing the mountains',
      korean: '카페',
      caption: 'Code, facing the mountains.',
    },
    {
      picture: NIGHT_PAVILION_PICTURE,
      alt: 'A traditional Korean pavilion, lit up at night, reflected in a pond',
      korean: '밤',
      caption: 'A lit pavilion, reflected in the water.',
    },
  ],
  labels: {
    yearFigures: 'The year in figures',
    models: 'Models trained',
    modelsList: 'Models trained at Korea University',
  },
} as const satisfies KoreaContent;
