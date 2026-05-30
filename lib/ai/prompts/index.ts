import type { TaskType } from '../router';
import { DEEP_ANALYSIS_PROMPT } from './deep-analysis';
import { GENERAL_REVIEW_PROMPT } from './general-review';
import { SIMPLE_STYLE_PROMPT } from './simple-style';

export { DEEP_ANALYSIS_PROMPT } from './deep-analysis';
export { GENERAL_REVIEW_PROMPT } from './general-review';
export { SIMPLE_STYLE_PROMPT } from './simple-style';
export {
  OUTPUT_SCHEMA_INSTRUCTION,
  type IssueCategory,
  type IssueSeverity,
  type ReviewIssue,
  type ReviewResponse,
} from './output-schema';

const PROMPTS: Record<TaskType, string> = {
  'simple-style': SIMPLE_STYLE_PROMPT,
  'general-review': GENERAL_REVIEW_PROMPT,
  'deep-analysis': DEEP_ANALYSIS_PROMPT,
};

export function getSystemPrompt(taskType: TaskType): string {
  return PROMPTS[taskType];
}
