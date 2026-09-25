import { describe, expect, it } from 'vitest';

import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content';

// Expected values are copied from docs/content/cv-source.md ("IA : pratique personnelle et
// travaux académiques").
describe('AI practice content', () => {
  it('uses the CV section title', () => {
    expect(AI_PRACTICE_CONTENT.title).toBe('IA : pratique personnelle et travaux académiques');
  });

  it('quotes the three items of the CV word for word', () => {
    expect(AI_PRACTICE_CONTENT.items).toEqual([
      {
        title: 'Agents et MCP',
        text: 'J’utilise des agents de code tous les jours : décomposition de tâches, boucles agentiques, conventions de dépôt et garde-fous. J’ai branché des serveurs MCP (Pennylane, outils Google, Context7, 21st.dev) pour automatiser mes propres flux.',
      },
      {
        title: 'Intégration de LLM',
        text: 'J’appelle les API OpenAI et Anthropic depuis mon code : function calling avec fonctions déclarées, sorties contraintes par schéma, gestion du contexte et des tokens, arbitrage coût / latence entre modèles.',
      },
      {
        title: 'Modèles entraînés à Korea University (61e mondiale, QS)',
        text: 'J’ai affiné un BERT (Hugging Face) pour de la classification de texte, entraîné un CNN reconnaissant l’état d’une partie d’échecs sur image du plateau, et déployé un détecteur de gestes temps réel de type YOLO sur flux webcam.',
      },
    ]);
  });
});
