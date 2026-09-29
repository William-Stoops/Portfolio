import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';

// Translation of ai-practice-content.fr.ts (ADR 0026): the same practices, nothing added.
export const AI_PRACTICE_CONTENT = {
  id: SECTION_IDS.en.aiPractice,
  title: 'Artificial intelligence',
  subtitle: 'Personal practice and academic work.',
  items: [
    {
      title: 'Agents and MCP',
      text: 'I use coding agents every day: task decomposition, agentic loops, repository conventions and guardrails. I connected MCP servers to automate my own workflows.',
    },
    {
      title: 'LLM integration',
      text: 'I call the OpenAI and Anthropic APIs from my code: function calling with declared functions, schema-constrained outputs, context and token management, cost / latency trade-offs between models.',
    },
  ],
} as const satisfies AiPracticeContent;
