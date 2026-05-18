# CodeReview AI — Project Specification

## 1. 한 줄 요약

Anthropic Claude의 Haiku/Sonnet/Opus 3-tier 라우팅으로 비용을 절감하면서 리뷰 품질을 유지하는 AI 코드 리뷰 도구.

## 2. 문제 정의

- 코드 리뷰는 시간이 많이 들고, 시니어 개발자에게 부담이 집중됨
- 기존 AI 코드 리뷰 도구는 모든 요청에 동일한 (보통 가장 비싼) 모델을 사용 → 비용 비효율
- 단순 스타일 체크는 작은 모델로 충분, 아키텍처 분석은 큰 모델 필요 → **태스크 복잡도에 따른 라우팅**이 핵심

## 3. 타겟 사용자

- 개인 개발자 (사이드 프로젝트 코드 리뷰)
- 소규모 팀 (PR 1차 검토 자동화)

## 4. 핵심 기능 (MVP)

### 필수 (Week 4까지)

- [F1] 코드 입력: 직접 붙여넣기 (Week 4 필수). GitHub URL 입력은 OAuth 도입 후 Week 6+로 이동 (rate limit 회피)
- [F2] **태스크 분류 라우팅**: 코드 분석 → Haiku/Sonnet/Opus 자동 선택
- [F3] AI 리뷰 결과 스트리밍 표시
- [F4] 리뷰 결과를 카테고리별(버그/성능/스타일/보안)로 분류

### 중요 (Week 5-6)

- [F5] 코드 라인별 인라인 코멘트
- [F6] Before/After Diff 뷰어
- [F7] GitHub OAuth 로그인
- [F8] 리뷰 히스토리 저장 및 조회
- [F9] **비용 추적 대시보드**: 사용한 모델별 토큰/비용 시각화 (라우팅 효과 증명)

### Nice-to-have (Week 7+)

- [F10] 모바일 반응형
- [F11] 다크모드
- [F12] E2E 테스트
- [F13] 리뷰 결과 공유 링크

## 5. 라우팅 로직 명세 (핵심 차별화)

```typescript
type TaskType =
  | 'simple-style' // 포매팅, 네이밍, 컨벤션
  | 'general-review' // 일반적인 코드 리뷰
  | 'deep-analysis'; // 아키텍처, 보안, 성능 심층 분석

function detectTaskType(input: {
  code: string;
  fileCount: number;
  userIntent?: 'quick' | 'standard' | 'deep';
}): TaskType {
  // 1. 사용자가 명시적으로 깊이 지정 → 그대로
  if (input.userIntent === 'quick') return 'simple-style';
  if (input.userIntent === 'deep') return 'deep-analysis';

  // 2. 코드 길이 기반
  const lines = input.code.split('\n').length;
  if (lines < 50 && input.fileCount === 1) return 'simple-style';
  if (lines > 500 || input.fileCount > 5) return 'deep-analysis';

  // 3. 기본값
  return 'general-review';
}

const MODEL_MAP: Record<TaskType, string> = {
  'simple-style': 'claude-haiku-4-5',
  'general-review': 'claude-sonnet-4-6',
  'deep-analysis': 'claude-opus-4-7',
};
```

## 6. 기술 스택

### Frontend

- **Next.js 16** (App Router, RSC, Server Actions, Turbopack 빌드)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS `@theme` 기반 설정) + **자체 디자인 시스템** (Radix UI primitives 기반)
- **Monaco Editor** (코드 입력/Diff 전용, `next/dynamic` lazy load + `ssr:false`)
- **Shiki** (정적 표시용 syntax highlighting — 번들 부담 없음)
- **Storybook** (디자인 시스템 문서화) → Chromatic 배포

### Backend / Data

- **Vercel AI SDK** (`ai` + `@ai-sdk/anthropic`) — 스트리밍/통합 API 단독 사용 (직접 `@anthropic-ai/sdk` 호출은 지양)
- **Drizzle ORM** + **PostgreSQL** (Neon)
- **Auth.js** (GitHub OAuth)

### DevOps

- **Vercel** (배포)
- **GitHub Actions** (CI: lint, typecheck, test)
- **pnpm** (패키지 매니저)

## 7. 디자인 시스템 명세

### Design Tokens

```ts
colors: {
  // semantic
  bg: { default, subtle, muted, inverse },
  fg: { default, muted, subtle, inverse },
  border: { default, strong, subtle },
  accent: { default, hover, fg },
  success/warning/error/info: { default, fg, bg },
}
spacing: 4px scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
radius: { sm: 4, md: 6, lg: 8, xl: 12, full: 9999 }
typography: Inter + JetBrains Mono
```

### 컴포넌트 (핵심 18개 우선, 시간 남으면 추가)

**Layer 1 - Primitives (핵심 6)**: Button, Input, Textarea, Select, Label, Switch
**Layer 2 - Composite (핵심 7)**: Card, Badge, Tabs, Dialog, Tooltip, Toast, Skeleton
**Layer 3 - Domain (핵심 5)**: ReviewCard, IssueBadge, CodeBlock, ModelIndicator, CostMeter

**선택 (시간 남으면 추가)**: Checkbox, Radio, Avatar, Dropdown, Popover, DiffViewer

각 컴포넌트:

- TypeScript 타입 정의
- Storybook 스토리 (3개 이상 variant)
- 접근성 (ARIA, 키보드)
- 다크모드

## 8. 성능 목표

- Lighthouse: Performance 95+, Accessibility 100, Best Practices 100, SEO 100
- TTFB: 200ms 이하 (Vercel Edge)
- LCP: 1.5s 이하
- 번들 사이즈: 초기 로드 200KB 이하 (gzip)

## 9. 디렉토리 구조

```
codereview-ai/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # 랜딩 페이지
│   ├── (app)/              # 인증 후 메인
│   │   ├── review/         # 리뷰 생성/조회
│   │   └── dashboard/      # 비용 대시보드
│   ├── api/                # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                 # 디자인 시스템 (Layer 1-2)
│   └── domain/             # 도메인 컴포넌트 (Layer 3)
├── lib/
│   ├── ai/                 # 라우팅, 프롬프트
│   ├── db/                 # Drizzle 스키마, 쿼리
│   └── utils/
├── stories/                # Storybook
├── tests/                  # Playwright E2E
└── docs/
    ├── PROJECT.md          # 이 문서
    ├── ROADMAP.md
    ├── CLAUDE.md
    └── decisions/          # ADR (Architecture Decision Records)
```

## 10. 측정 가능한 성공 기준

- ✅ Vercel에 배포된 살아있는 URL
- ✅ Storybook이 Chromatic에 배포되어 있음
- ✅ README에 데모 GIF, 아키텍처 다이어그램, 라우팅 효과 그래프
- ✅ 기술 블로그 2편 작성
- ✅ Lighthouse 95+ 스크린샷
- ✅ 비용 추적 대시보드에 "라우팅으로 X% 절감" 실측 데이터 노출
