# CodeReview AI

> Claude **Haiku / Sonnet / Opus** 3-tier 라우팅으로 비용을 줄이면서 리뷰 품질은 유지하는 AI 코드 리뷰 도구.

[![Status](https://img.shields.io/badge/status-WIP-yellow)](#로드맵)
[![Live Demo](https://img.shields.io/badge/Live-code--review--ai.vercel.app-000000?logo=vercel)](https://code-review-ai-azure.vercel.app/)
[![Storybook](https://img.shields.io/badge/Storybook-Chromatic-FF4785?logo=storybook)](https://6a12e67cc8dfc60b4510bf4b-dlgqkfcfsj.chromatic.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> 🚧 **개발 중 (Week 2/8)**
>
> - 앱: https://code-review-ai-azure.vercel.app/
> - 디자인 시스템: https://6a12e67cc8dfc60b4510bf4b-dlgqkfcfsj.chromatic.com/
> - 데모 GIF는 Week 4 MVP 완성 이후 추가 예정.

---

## 핵심 아이디어

기존 AI 코드 리뷰 도구는 모든 요청에 **항상 같은 (보통 가장 비싼) 모델**을 사용합니다.
하지만 실제 작업은:

- **포매팅/네이밍 체크** ← Haiku로 충분
- **일반적인 코드 리뷰** ← Sonnet 적당
- **아키텍처/보안 심층 분석** ← Opus 필요

CodeReview AI는 **태스크 복잡도를 자동 감지**해 적합한 모델을 고릅니다.

```ts
// lib/ai/router.ts
function detectTaskType({ code, fileCount, userIntent }) {
  if (userIntent === 'quick') return 'simple-style'; // → Haiku
  if (userIntent === 'deep') return 'deep-analysis'; // → Opus
  if (lines < 50 && fileCount === 1) return 'simple-style';
  if (lines > 500 || fileCount > 5) return 'deep-analysis';
  return 'general-review'; // → Sonnet
}
```

비용 대시보드에서 **"라우팅으로 N% 절감"** 실측을 노출하는 것이 차별점입니다.

---

## 기술 스택

| 레이어    | 사용 기술                                                                      |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, RSC, Server Actions, Turbopack)                        |
| UI        | Tailwind CSS v4 (CSS `@theme`) + 자체 디자인 시스템 (Radix UI primitives 기반) |
| Type      | TypeScript strict + `noUncheckedIndexedAccess`                                 |
| AI        | Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)                                     |
| Editor    | Monaco Editor (lazy load) + Shiki (정적 표시)                                  |
| DB        | PostgreSQL (Neon) + Drizzle ORM                                                |
| Auth      | Auth.js + GitHub OAuth                                                         |
| Test      | Playwright (E2E)                                                               |
| Tooling   | pnpm · ESLint · Prettier · Husky · lint-staged                                 |
| Deploy    | Vercel                                                                         |

상세 사양: [`docs/PROJECT.md`](./docs/PROJECT.md)

---

## 시작하기

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` 접속.

### 스크립트

| 명령                   | 동작                                 |
| ---------------------- | ------------------------------------ |
| `pnpm dev`             | 개발 서버 (Turbopack)                |
| `pnpm build`           | 프로덕션 빌드                        |
| `pnpm start`           | 프로덕션 서버                        |
| `pnpm lint`            | ESLint 실행                          |
| `pnpm format`          | Prettier 포매팅                      |
| `pnpm format:check`    | 포매팅 검사 (CI용)                   |
| `pnpm storybook`       | Storybook (port 6006)                |
| `pnpm build-storybook` | Storybook 정적 빌드                  |
| `pnpm chromatic`       | Chromatic publish (CI에서 자동 실행) |

커밋 시 `husky` + `lint-staged`로 자동 lint/format 실행.

---

## 디렉토리 구조

```
codereview-ai/
├── app/                 # Next.js App Router
├── components/
│   ├── ui/              # 디자인 시스템 (Layer 1-2)
│   └── domain/          # 도메인 컴포넌트 (Layer 3)
├── lib/
│   ├── ai/              # 라우팅, 프롬프트
│   ├── db/              # Drizzle 스키마/쿼리
│   └── utils/
├── stories/             # Storybook
├── tests/               # Playwright E2E
└── docs/
    ├── PROJECT.md       # 프로젝트 사양
    ├── ROADMAP.md       # 8주 로드맵
    ├── design-refs.md   # 디자인 레퍼런스
    ├── wireframes.md    # 핵심 화면 와이어프레임
    └── decisions/       # ADR (Architecture Decision Records)
```

---

## 로드맵

8주 일정으로 진행 중. 상세: [`docs/ROADMAP.md`](./docs/ROADMAP.md)

| Week | 목표                            | 상태    |
| ---- | ------------------------------- | ------- |
| 1    | 기획 & 셋업                     | ✅ 완료 |
| 2    | 디자인 시스템 기반              | ⚪      |
| 3    | 디자인 시스템 확장 + 레이아웃   | ⚪      |
| 4    | **MVP**: 코드 입력 + AI 라우팅  | ⚪      |
| 5    | 리뷰 결과 UI                    | ⚪      |
| 6    | 히스토리 + 인증 + 비용 대시보드 | ⚪      |
| 7    | 폴리싱 + 최적화                 | ⚪      |
| 8    | 문서화 + 홍보                   | ⚪      |

---

## 문서

- 📋 [PROJECT.md](./docs/PROJECT.md) — 프로젝트 사양 (기능/스택/디자인 토큰)
- 🗓 [ROADMAP.md](./docs/ROADMAP.md) — 8주 일정과 체크리스트
- 🎨 [design-refs.md](./docs/design-refs.md) — Linear/Vercel/Cursor/v0/Raycast 분석
- 📐 [wireframes.md](./docs/wireframes.md) — 핵심 3개 화면 와이어프레임
- 📁 [docs/decisions/](./docs/decisions/) — ADR (Week 8 작성 예정)

---

## 라이선스

MIT (예정)
