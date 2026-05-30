export type TaskType = 'simple-style' | 'general-review' | 'deep-analysis';

export type UserIntent = 'quick' | 'standard' | 'deep';

export interface RouterInput {
  code: string;
  fileCount: number;
  userIntent?: UserIntent;
}

export interface RouterDecision {
  taskType: TaskType;
  model: string;
  reason: string;
}

export const MODEL_MAP: Record<TaskType, string> = {
  'simple-style': 'claude-haiku-4-5',
  'general-review': 'claude-sonnet-4-6',
  'deep-analysis': 'claude-opus-4-7',
};

const SIMPLE_LINE_THRESHOLD = 50;
const DEEP_LINE_THRESHOLD = 500;
const DEEP_FILE_THRESHOLD = 5;

export function detectTaskType(input: RouterInput): RouterDecision {
  if (input.userIntent === 'quick') {
    return decide('simple-style', '사용자가 quick 모드를 선택했습니다.');
  }
  if (input.userIntent === 'deep') {
    return decide('deep-analysis', '사용자가 deep 모드를 선택했습니다.');
  }

  const lines = input.code === '' ? 0 : input.code.split('\n').length;

  if (lines < SIMPLE_LINE_THRESHOLD && input.fileCount === 1) {
    return decide(
      'simple-style',
      `단일 파일 · ${lines}줄(<${SIMPLE_LINE_THRESHOLD})로 짧아 간단 리뷰로 충분합니다.`,
    );
  }

  if (lines > DEEP_LINE_THRESHOLD || input.fileCount > DEEP_FILE_THRESHOLD) {
    return decide(
      'deep-analysis',
      `${lines}줄 · 파일 ${input.fileCount}개로 규모가 커 심층 분석이 필요합니다.`,
    );
  }

  return decide('general-review', `${lines}줄 · 파일 ${input.fileCount}개로 표준 리뷰 범위입니다.`);
}

function decide(taskType: TaskType, reason: string): RouterDecision {
  return { taskType, model: MODEL_MAP[taskType], reason };
}
