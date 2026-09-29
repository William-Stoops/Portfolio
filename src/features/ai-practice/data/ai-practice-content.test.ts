import { describe, expect, it } from 'vitest';

import { AI_PRACTICE_CONTENT as AI_PRACTICE_CONTENT_EN } from '@/features/ai-practice/data/ai-practice-content.en';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content.fr';

// Expected values are copied from docs/content/cv-source.md ("IA : pratique personnelle et
// travaux académiques").
describe('AI practice content', () => {
  it('titles the section for a reader, the CV’s own title under it', () => {
    expect(AI_PRACTICE_CONTENT.title).toBe('Intelligence artificielle');
    expect(AI_PRACTICE_CONTENT.subtitle).toBe('Pratique personnelle et travaux académiques.');
  });

  it('quotes the CV on agents and LLMs, without naming each MCP server', () => {
    expect(AI_PRACTICE_CONTENT.items).toEqual([
      {
        title: 'Agents et MCP',
        text: 'J’utilise des agents de code tous les jours : décomposition de tâches, boucles agentiques, conventions de dépôt et garde-fous. J’ai branché des serveurs MCP pour automatiser mes propres flux.',
      },
      {
        title: 'Intégration de LLM',
        text: 'J’appelle les API OpenAI et Anthropic depuis mon code : function calling avec fonctions déclarées, sorties contraintes par schéma, gestion du contexte et des tokens, arbitrage coût / latence entre modèles.',
      },
    ]);
  });

  it('translates the two practices, under the English anchor', () => {
    expect(AI_PRACTICE_CONTENT_EN.id).toBe('ai');
    expect(AI_PRACTICE_CONTENT_EN.items.map(({ title }) => title)).toEqual([
      'Agents and MCP',
      'LLM integration',
    ]);
    expect(AI_PRACTICE_CONTENT_EN.items[0].text).toContain(
      'I connected MCP servers to automate my own workflows.',
    );
  });
});
