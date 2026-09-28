import {
  BASEBALL_STADIUM_PICTURE,
  HANOK_CAFE_PICTURE,
  NIGHT_PAVILION_PICTURE,
} from '@/features/korea/data/korea-pictures';
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
      picture: BASEBALL_STADIUM_PICTURE,
      alt: 'William Stoops, seen from behind in a Korea University jacket, waves a flag in the stands of a baseball stadium',
      korean: '야구장',
      caption: 'At the ballpark, in Korea University colors.',
    },
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
