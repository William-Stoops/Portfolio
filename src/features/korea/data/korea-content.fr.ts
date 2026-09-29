import { HANOK_CAFE_PICTURE, NIGHT_PAVILION_PICTURE } from '@/features/korea/data/korea-pictures';
import { type KoreaContent } from '@/features/korea/types/korea-content';

// Source: docs/content/cv-source.md ("IA", "Formation"). The photos, and the Korean words
// that frame them, come from William (see the same file).
export const KOREA_CONTENT = {
  greeting: { korean: '안녕하세요', translation: 'bonjour' },
  lead: 'Une année à Korea University, en Corée du Sud, suivie en anglais : deep learning et computer vision.',
  route: { origin: { name: 'France' }, destination: { name: 'Corée du Sud', korean: '한국' } },
  homecoming: {
    farewell: { korean: '안녕히 계세요', translation: 'au revoir' },
    // The page's own language: no `lang`, no translation.
    greeting: { text: 'Bonjour.' },
  },
  university: { korean: '고려대학교', name: 'Korea University' },
  figures: [
    { value: '61e', label: 'au classement mondial QS' },
    { value: '1 an', label: 'de cours en anglais' },
    { value: '3', label: 'modèles entraînés' },
  ],
  models: [
    { name: 'BERT affiné', detail: 'Classification de texte, avec Hugging Face.' },
    { name: 'CNN', detail: 'L’état d’une partie d’échecs, reconnu sur l’image du plateau.' },
    { name: 'Détecteur de gestes', detail: 'En temps réel, de type YOLO, sur flux webcam.' },
  ],
  band: {
    korean: ['고려대학교', '한국', '딥러닝', '컴퓨터 비전'],
    translation: ['Korea University', 'Corée du Sud', 'Deep learning', 'Computer vision'],
  },
  photos: [
    {
      picture: HANOK_CAFE_PICTURE,
      alt: 'Un ordinateur portable ouvert sur du code, dans un café aux poutres de bois traditionnelles, face aux montagnes',
      korean: '카페',
      caption: 'Du code, face aux montagnes.',
    },
    {
      picture: NIGHT_PAVILION_PICTURE,
      alt: 'Un pavillon traditionnel coréen illuminé se reflète dans un étang, de nuit',
      korean: '밤',
      caption: 'Un pavillon illuminé, reflété dans l’eau.',
    },
  ],
  labels: {
    yearFigures: 'L’année en chiffres',
    models: 'Modèles entraînés',
    modelsList: 'Modèles entraînés à Korea University',
  },
} as const satisfies KoreaContent;
