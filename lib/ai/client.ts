import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';
import { getSystemPrompt } from './prompts';
import { detectTaskType, type RouterDecision, type RouterInput } from './router';

let _anthropic: ReturnType<typeof createAnthropic> | null = null;

function getAnthropic() {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and fill in a key from https://console.anthropic.com/settings/keys',
    );
  }
  _anthropic = createAnthropic({ apiKey });
  return _anthropic;
}

export interface ReviewPlan {
  decision: RouterDecision;
  model: LanguageModel;
  systemPrompt: string;
}

export function planReview(input: RouterInput): ReviewPlan {
  const decision = detectTaskType(input);
  const anthropic = getAnthropic();
  return {
    decision,
    model: anthropic(decision.model),
    systemPrompt: getSystemPrompt(decision.taskType),
  };
}
