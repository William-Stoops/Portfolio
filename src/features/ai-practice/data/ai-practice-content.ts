import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';

// Source: docs/content/cv-source.md, "IA : pratique personnelle et travaux académiques".
export const AI_PRACTICE_CONTENT = {
  // The CV's section title, under a title a reader takes in at once.
  title: 'Intelligence artificielle',
  subtitle: 'Pratique personnelle et travaux académiques.',
  items: [
    {
      title: 'Agents et MCP',
      text: 'J’utilise des agents de code tous les jours : décomposition de tâches, boucles agentiques, conventions de dépôt et garde-fous. J’ai branché des serveurs MCP (Pennylane, outils Google, Context7, 21st.dev) pour automatiser mes propres flux.',
    },
    {
      title: 'Intégration de LLM',
      text: 'J’appelle les API OpenAI et Anthropic depuis mon code : function calling avec fonctions déclarées, sorties contraintes par schéma, gestion du contexte et des tokens, arbitrage coût / latence entre modèles.',
    },
    {
      title: 'Modèles entraînés à Korea University',
      text: 'J’ai affiné un BERT (Hugging Face) pour de la classification de texte, entraîné un CNN reconnaissant l’état d’une partie d’échecs sur image du plateau, et déployé un détecteur de gestes temps réel de type YOLO sur flux webcam.',
    },
  ],
} as const satisfies AiPracticeContent;
