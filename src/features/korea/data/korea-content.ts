import {
  BASEBALL_STADIUM_PICTURE,
  HANOK_CAFE_PICTURE,
  NIGHT_PAVILION_PICTURE,
} from '@/features/korea/data/korea-pictures';
import { type KoreaContent } from '@/features/korea/types/korea-content';

// Source: docs/content/cv-source.md ("IA", "Formation"). The photos, and the Korean words
// that frame them, come from William (see the same file).
export const KOREA_CONTENT = {
  greeting: { korean: '안녕하세요', french: 'bonjour' },
  lead: 'Une année à Séoul, à Korea University, suivie en anglais : deep learning et computer vision.',
  route: { from: 'France', to: { korean: '서울', french: 'Séoul' } },
  university: { korean: '고려대학교', name: 'Korea University' },
  figures: [
    { value: '61e', label: 'université mondiale, classement QS' },
    { value: '1 an', label: 'suivi en anglais' },
    { value: '3', label: 'modèles entraînés' },
  ],
  models: [
    { name: 'BERT affiné', detail: 'Classification de texte, avec Hugging Face.' },
    { name: 'CNN', detail: 'L’état d’une partie d’échecs, reconnu sur l’image du plateau.' },
    { name: 'Détecteur de gestes', detail: 'En temps réel, de type YOLO, sur flux webcam.' },
  ],
  band: {
    korean: ['고려대학교', '서울', '딥러닝', '컴퓨터 비전'],
    translation: ['Korea University', 'Séoul', 'Deep learning', 'Computer vision'],
  },
  photos: [
    {
      picture: BASEBALL_STADIUM_PICTURE,
      alt: 'William Stoops, de dos, en blouson de Korea University, agite un drapeau dans les tribunes d’un stade de baseball de Séoul',
      korean: '야구장',
      caption: 'Au stade, aux couleurs de Korea University.',
    },
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
      caption: 'Un pavillon qui se reflète dans l’eau, la nuit.',
    },
  ],
} as const satisfies KoreaContent;
