# Wireframes

> Week 1.3 산출물. 핵심 화면 3개의 ASCII 와이어프레임.
> 이 문서는 **레이아웃 의도와 정보 위계**를 정의하고, Week 2~5 구현 시 참조점이 됨.
> Figma로 옮길 경우 이 구조를 그대로 따른다.

레이아웃 가정:

- 최대 너비 `1280px`, 좌우 패딩 `24px`
- 다크모드 우선이지만 라이트도 동등 지원 ([[design-refs]])
- 데스크탑 기준. 모바일 변형은 Week 7.3에서 다룸

---

## 1. Landing 페이지 (`/`)

**목적**: 처음 방문자에게 "이 도구가 무엇인지, 왜 다른지(라우팅)"를 30초 안에 전달 → CTA로 리뷰 페이지 진입.

**핵심 정보 위계**: Hero 카피 > 라우팅 차별화 시각화 > 기능 3개 > Footer

```
┌────────────────────────────────────────────────────────────────────────┐
│ [logo] CodeReview AI         Docs   Pricing   GitHub  │ [Sign in] [→] │
└────────────────────────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────────────────────┐
         │                                                      │
         │     AI code review that picks the right model         │
         │     ─────────────────────────────────────────         │
         │     Haiku for style. Sonnet for review.               │
         │     Opus for deep analysis. You pay only for what     │
         │     the task actually needs.                          │
         │                                                      │
         │     [ Start a review → ]   [ See how routing works ]  │
         │                                                      │
         │     ★ 70% lower cost vs always-Opus on real PRs       │
         │                                                      │
         └──────────────────────────────────────────────────────┘


  ┌────────────────────────────────────────────────────────────┐
  │  Routing visualization (live mini-demo OR static diagram)  │
  │                                                            │
  │    [code snippet] ──► [detectTaskType()] ──► [Haiku    ]   │
  │      50 LOC                                               │
  │                                                            │
  │    [code snippet] ──► [detectTaskType()] ──► [Sonnet   ]   │
  │      300 LOC                                              │
  │                                                            │
  │    [code snippet] ──► [detectTaskType()] ──► [Opus     ]   │
  │      8 files, 2k LOC                                      │
  └────────────────────────────────────────────────────────────┘


  ─── 3-column feature grid ───────────────────────────────────

  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │ icon         │   │ icon         │   │ icon         │
  │              │   │              │   │              │
  │ Smart        │   │ Inline       │   │ Cost         │
  │ Routing      │   │ Reviews      │   │ Dashboard    │
  │              │   │              │   │              │
  │ 3-tier model │   │ Line-level   │   │ Track every  │
  │ selection by │   │ comments +   │   │ token, prove │
  │ complexity.  │   │ diff viewer. │   │ the savings. │
  └──────────────┘   └──────────────┘   └──────────────┘


              ┌─────────────────────────────────┐
              │   Ready to review your code?    │
              │                                 │
              │   [ Start free →  no signup ]   │
              └─────────────────────────────────┘


  ──────────────────────────────────────────────────────────────
   © 2026  CodeReview AI    GitHub · Docs · Privacy · Contact
  ──────────────────────────────────────────────────────────────
```

### 주요 결정

- **Hero 단 한 문장 + 비주얼**: Linear/Vercel 톤. 마케팅 카피 길게 깔지 않음
- **라우팅 시각화가 곧 가치 제안**: 다른 AI 리뷰 도구와의 차별점이 이 한 다이어그램에 압축돼야 함
- **"no signup" 강조**: F1(붙여넣기 모드)이 Week 4에 먼저 나오므로 가입 없이 체험 가능 → 전환율 핵심
- **Footer는 한 줄**: 사이드 프로젝트답게 최소화

### 컴포넌트 매핑

| 영역            | 컴포넌트 (PROJECT.md §7)                  |
| --------------- | ----------------------------------------- |
| Top nav         | `Header` (Week 3.3)                       |
| Primary CTA     | `Button` variant=`primary` (Week 2.5)     |
| Routing diagram | 도메인 `ModelIndicator` 3개 배치 (Week 3) |
| Feature card    | `Card` + 아이콘 (Week 2.5)                |

---

## 2. Review List 페이지 (`/reviews`)

**목적**: 지금까지 만든 리뷰들을 빠르게 훑고 필요한 걸 찾기. Linear 이슈 리스트 + Vercel 배포 카드의 결합 ([[design-refs]]).

**핵심 정보 위계**: 새 리뷰 만들기 CTA > 필터 > 리스트 행 > 페이지네이션

```
┌────────────────────────────────────────────────────────────────────────┐
│ [logo] CodeReview AI    Reviews  Dashboard  Docs         [@avatar ▾]   │
└────────────────────────────────────────────────────────────────────────┘

  Reviews                                          [ + New review ]
  ────────────────────────────────────────────────────────────────

  ┌─ Filters ─────────────────────────────────────────────────────┐
  │  Model:  [All ▾]   Category: [All ▾]   Sort: [Newest ▾]      │
  │  Search: [ ⌕  Find a review...                   ]   ⌘K       │
  └───────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────────┐
  │ ● auth/login.ts                              [Opus]   2m ago   │
  │   3 issues · 1 critical                          ▲ Bug ▲ Sec   │
  ├────────────────────────────────────────────────────────────────┤
  │ ● components/Form.tsx                        [Sonnet] 1h ago   │
  │   7 issues · 0 critical                          Perf  Style   │
  ├────────────────────────────────────────────────────────────────┤
  │ ○ utils/formatDate.ts                        [Haiku]  3h ago   │
  │   1 issue · 0 critical                              Style      │
  ├────────────────────────────────────────────────────────────────┤
  │ ● services/payment/                          [Opus]   yest.    │
  │   12 issues · 3 critical                     Bug Sec Perf      │
  ├────────────────────────────────────────────────────────────────┤
  │ ○ README.md                                  [Haiku]  2d ago   │
  │   0 issues                                                     │
  └────────────────────────────────────────────────────────────────┘

                            < 1  2  3  4  >


  ─── Empty state (when 0 reviews) ─────────────────────────────────

         ┌──────────────────────────────────────┐
         │                                       │
         │            ╭─────╮                    │
         │            │ 📝  │   illustration     │
         │            ╰─────╯                    │
         │                                       │
         │     No reviews yet                    │
         │     Paste some code and let the       │
         │     router pick the right model.      │
         │                                       │
         │       [ Start your first review → ]   │
         │                                       │
         └──────────────────────────────────────┘
```

### 주요 결정

- **행 좌측 컬러 도트**: `●` = 미확인 / `○` = 확인됨 (Linear 패턴, [[design-refs]] Linear 항목)
- **모델 배지를 항상 노출**: `ModelIndicator` 컴포넌트로 일관 처리. 라우팅 결과가 곧 차별점이므로 절대 숨기지 않음
- **카테고리 태그는 우측 끝**: 정보 밀도를 위해 한 줄에 압축. 4종(Bug/Perf/Style/Sec)만 사용
- **`⌘K` 검색**: Raycast/Linear식 단축키 표시. `Kbd` 컴포넌트 ([[design-refs]] Raycast)
- **Empty state는 친근하게**: Raycast식 일러스트 + 한 줄 + 액션 ([[design-refs]])

### 컴포넌트 매핑

| 영역          | 컴포넌트                        |
| ------------- | ------------------------------- |
| 행            | `ReviewCard` (도메인, Week 3)   |
| 모델 배지     | `ModelIndicator`                |
| 카테고리 태그 | `IssueBadge`                    |
| 필터 드롭다운 | `Select` (Layer 1)              |
| 검색          | `Input` + `Kbd`                 |
| Empty state   | `EmptyState` (Week 7 도입 검토) |

---

## 3. Review Detail 페이지 (`/reviews/[id]`)

**목적**: 한 리뷰의 전체 결과를 코드와 함께 본다. Cursor 좌/우 분할 + v0 탭 전환 결합 ([[design-refs]]).

**핵심 정보 위계**: 메타 헤더(모델/비용/시간) > 탭(요약/이슈/원본) > 좌측 코드 + 우측 이슈 패널

````
┌────────────────────────────────────────────────────────────────────────┐
│ [logo] CodeReview AI    Reviews  Dashboard  Docs         [@avatar ▾]   │
└────────────────────────────────────────────────────────────────────────┘

  ← Back to reviews
  ┌──────────────────────────────────────────────────────────────────┐
  │  auth/login.ts                                                   │
  │  ─────────────────                                               │
  │  [Opus] reviewed · 142 LOC · 3 issues (1 critical)               │
  │  Cost: $0.018  ·  vs always-Opus: same  ·  2 minutes ago         │
  │                                                                  │
  │  [ Summary ]  [ Issues (3) ]  [ Source ]    [ Re-review ▾ ]      │
  └──────────────────────────────────────────────────────────────────┘

  ─── Tab: Issues (default) ─────────────────────────────────────────

  ┌─ Code (Monaco) ─────────────────────┐ ┌─ Issues panel ──────────┐
  │  1 │ export async function login(  │ │ Filter: [All ▾]         │
  │  2 │   email: string,              │ │                          │
  │  3 │   password: string            │ │ ┌──────────────────────┐ │
  │  4 │ ) {                           │ │ │ ▲ Critical · Security│ │
  │  5 │   const user = await db        │ │ │ Line 12              │ │
  │  6 │     .select()                 │ │ │                      │ │
  │  7 │     .from(users)              │ │ │ Password is logged   │ │
  │  8 │     .where(eq(email))         │ │ │ in plaintext on auth │ │
  │  9 │     .limit(1)                 │ │ │ failure.             │ │
  │ 10 │                               │ │ │                      │ │
  │ 11 │   if (!user) {                │ │ │ Suggested fix:       │ │
  │ 12 │■    console.log(password)     │◄┤ │ ```                  │ │
  │ 13 │     throw new Error(...)      │ │ │ logger.warn('failed')│ │
  │ 14 │   }                           │ │ │ ```                  │ │
  │ 15 │                               │ │ │ [Apply] [Copy] [Skip]│ │
  │ 16 │   return user                 │ │ └──────────────────────┘ │
  │ 17 │ }                             │ │                          │
  │    │                                │ │ ┌──────────────────────┐ │
  │    │                                │ │ │ ◆ Major · Performance│ │
  │    │                                │ │ │ Line 5-9             │ │
  │    │                                │ │ │ Missing index hint...│ │
  │    │                                │ │ └──────────────────────┘ │
  │    │                                │ │                          │
  │    │                                │ │ ┌──────────────────────┐ │
  │    │                                │ │ │ ○ Minor · Style      │ │
  │    │                                │ │ │ Line 1               │ │
  │    │                                │ │ │ Missing JSDoc...     │ │
  │    │                                │ │ └──────────────────────┘ │
  └─────────────────────────────────────┘ └──────────────────────────┘
       (gutter highlight on line 12)         (active card highlighted)


  ─── Tab: Summary ──────────────────────────────────────────────────

  ┌──────────────────────────────────────────────────────────────────┐
  │  Overview                                                        │
  │  ────────                                                        │
  │  This auth flow has one critical security issue (plaintext       │
  │  password logging) and two minor improvements...                 │
  │                                                                  │
  │  Issues by category:                                             │
  │    Security  ████████░░  1                                       │
  │    Perf      ████░░░░░░  1                                       │
  │    Style     ██░░░░░░░░  1                                       │
  │    Bug       ░░░░░░░░░░  0                                       │
  │                                                                  │
  │  Why this model? (routing rationale)                             │
  │  ────────────────                                                │
  │  Detected: deep-analysis  →  claude-opus-4-7                     │
  │  Reason: file involves auth/credentials, security-sensitive      │
  │          patterns matched in static analysis.                    │
  └──────────────────────────────────────────────────────────────────┘

  ─── Tab: Source ───────────────────────────────────────────────────
  (Monaco editor full-width, read-only, syntax highlighted)
````

### 주요 결정

- **메타 헤더에 비용을 항상 표시**: 라우팅의 효과를 항상 노출 (F9 비용 추적 대시보드와 일관)
- **탭 3개**: v0 패턴 (Summary / Issues / Source). 기본은 Issues (가장 자주 보는 화면)
- **좌/우 분할 + 코드 라인 ↔ 이슈 카드 연동**: Monaco decoration으로 라인 하이라이트, 클릭 시 우측 이슈 카드 활성화 ([[design-refs]] Cursor)
- **이슈 카드의 [Apply] 버튼**: Cursor식 "이 수정 적용" — 본 MVP에서는 클립보드 복사로 시작, Week 5.6에서 인라인 적용 검토
- **"Why this model?"**: 라우팅 근거를 항상 노출. F2 핵심 가치
- **심각도 글리프 통일**: `▲ Critical` / `◆ Major` / `○ Minor`. `IssueBadge` 컴포넌트로 일관 처리

### 컴포넌트 매핑

| 영역            | 컴포넌트                               |
| --------------- | -------------------------------------- |
| 메타 헤더       | `ReviewHeader` (도메인, Week 5)        |
| 탭              | `Tabs` (Layer 2, Week 3.1)             |
| 좌측 코드       | `Monaco Editor` lazy import (Week 4.1) |
| 우측 이슈 카드  | `IssueCard` (도메인, Week 5.2)         |
| Apply/Copy 버튼 | `Button` variant=`ghost`/`secondary`   |
| 비용 sparkline  | `CostMeter` (도메인)                   |

---

## 종합: 화면 간 상태 흐름

```
   Landing (/)
       │
       │  "Start a review →"
       ▼
   Review Detail (/reviews/new)
   (코드 입력 → 라우팅 → 스트리밍 결과)
       │
       │  스트리밍 완료
       ▼
   Review Detail (/reviews/[id])
       │
       │  좌측 nav "Reviews"
       ▼
   Review List (/reviews)
       │
       │  행 클릭
       ▼
   Review Detail (/reviews/[id])
```

### 디자인 일관성 체크리스트 (Week 2~5 작업 시 참조)

- [ ] 모델 배지는 항상 동일한 위치/스타일 (`ModelIndicator`)
- [ ] 비용 표시는 항상 동일한 포맷 (`$0.018` 소수점 3자리)
- [ ] 심각도는 항상 3단계 (`▲ ◆ ○`) + 동일 색
- [ ] 카테고리는 항상 4종 (Bug/Perf/Style/Sec) 외 추가 금지
- [ ] 모든 빈 상태는 일러스트 + 한 줄 + 액션 버튼 패턴 ([[design-refs]] Raycast)
- [ ] 키보드 단축키는 항상 `Kbd` 컴포넌트로 표시
