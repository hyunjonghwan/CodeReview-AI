import type { ReviewResponse } from './prompts/output-schema';

// 모델이 OUTPUT_SCHEMA_INSTRUCTION의 "코드펜스 금지" 지시를 무시하고 결과를
// ```json ... ``` 으로 감싸 반환하는 경우가 있다(Week 4.6에서 실측). 파싱 전에 벗긴다.
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return (fenced?.[1] ?? trimmed).trim();
}

function isReviewResponse(value: unknown): value is ReviewResponse {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.summary === 'string' && Array.isArray(obj.issues);
}

// 스트림 누적 텍스트 → ReviewResponse. 펜스/JSON 파싱 실패나 형태 불일치는 null.
// (Zod 미도입 결정에 따라 최상위 형태만 가드하고, 각 이슈 필드는 렌더 단계에서 방어한다.)
export function parseReview(raw: string): ReviewResponse | null {
  if (!raw.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(stripCodeFence(raw));
    return isReviewResponse(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
