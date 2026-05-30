export type IssueSeverity = 'info' | 'warning' | 'error';

export type IssueCategory =
  | 'style'
  | 'readability'
  | 'bug'
  | 'performance'
  | 'security'
  | 'architecture';

export interface ReviewIssue {
  severity: IssueSeverity;
  category: IssueCategory;
  line: number | null;
  message: string;
  suggestion: string | null;
}

export interface ReviewResponse {
  summary: string;
  issues: ReviewIssue[];
}

export const OUTPUT_SCHEMA_INSTRUCTION = `
응답은 반드시 아래 JSON 스키마를 따르는 단일 JSON 객체로만 출력하세요.
설명, 마크다운 코드펜스, 머리말/꼬리말 텍스트를 절대 추가하지 마세요.

{
  "summary": string,              // 전체 리뷰 1~2문장 요약
  "issues": [
    {
      "severity": "info" | "warning" | "error",
      "category": "style" | "readability" | "bug" | "performance" | "security" | "architecture",
      "line": number | null,      // 해당 줄 번호(1-based). 특정 줄에 매핑 불가하면 null
      "message": string,          // 무엇이 문제인지 (한국어, 1~3문장)
      "suggestion": string | null // 어떻게 고칠지 (한국어). 명확한 제안이 없으면 null
    }
  ]
}

issues 배열은 발견된 문제가 없으면 빈 배열([])로 두세요.
`.trim();
