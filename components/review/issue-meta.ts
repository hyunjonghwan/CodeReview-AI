import type { IssueCategory, IssueSeverity } from '@/lib/ai/prompts/output-schema';

// output-schema는 카테고리 6종이지만 wireframe 필터는 4종(Bug/Perf/Style/Sec)으로 못박혀 있다.
// wireframe-first 원칙에 따라 표시는 4종으로 그룹핑한다. (충돌 사유는 wk5 회고에 기록)
export type CategoryGroup = 'Bug' | 'Perf' | 'Style' | 'Sec';

export const CATEGORY_GROUPS: CategoryGroup[] = ['Bug', 'Perf', 'Style', 'Sec'];

const CATEGORY_GROUP: Record<IssueCategory, CategoryGroup> = {
  bug: 'Bug',
  architecture: 'Bug',
  performance: 'Perf',
  security: 'Sec',
  style: 'Style',
  readability: 'Style',
};

// 모델이 스키마 밖 카테고리를 내도(파싱 단계에서 검증 안 함) 깨지지 않게 폴백한다.
export function categoryGroup(category: string): CategoryGroup {
  return (CATEGORY_GROUP as Record<string, CategoryGroup>)[category] ?? 'Style';
}

// 심각도 글리프(wireframe 일관성 체크리스트: ▲◆○) + 기존 Badge variant 재사용.
export const SEVERITY_GLYPH: Record<IssueSeverity, string> = {
  error: '▲',
  warning: '◆',
  info: '○',
};

export const SEVERITY_VARIANT: Record<IssueSeverity, 'error' | 'warning' | 'info'> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export function severityGlyph(severity: string): string {
  return (SEVERITY_GLYPH as Record<string, string>)[severity] ?? '○';
}

export function severityVariant(severity: string): 'error' | 'warning' | 'info' {
  return (SEVERITY_VARIANT as Record<string, 'error' | 'warning' | 'info'>)[severity] ?? 'info';
}
