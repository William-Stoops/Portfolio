import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';

// Source: docs/content/cv-source.md, "IA : pratique personnelle et travaux académiques",
// less what William cut on 2026-09-28: the MCP servers' names, and the models trained at
// Korea University, told in the Korea chapter.
export const AI_PRACTICE_CONTENT = {
  id: SECTION_IDS.fr.aiPractice,
  // The CV's section title, under a title a reader takes in at once.
  title: 'Intelligence artificielle',
  subtitle: 'Pratique personnelle et travaux académiques.',
  items: [
    {
      title: 'Agents et MCP',
      text: 'J’utilise des agents de code tous les jours : décomposition de tâches, boucles agentiques, conventions de dépôt et garde-fous. J’ai branché des serveurs MCP pour automatiser mes propres flux.',
    },
    {
      title: 'Intégration de LLM',
      text: 'J’appelle les API OpenAI et Anthropic depuis mon code : function calling avec fonctions déclarées, sorties contraintes par schéma, gestion du contexte et des tokens, arbitrage coût / latence entre modèles.',
    },
  ],
} as const satisfies AiPracticeContent;
