# 8-Week Roadmap

> 클로드 코드와 작업할 때: "Week N의 다음 미체크 항목 진행해줘" 식으로 지시.
> 매 주 끝날 때 `docs/decisions/wk{N}-retro.md`에 회고 작성.

---

## Week 1: 기획 & 셋업 (목표 10h)

- [x] 1.1 PROJECT.md 검토 후 필요시 수정
- [x] 1.2 디자인 레퍼런스 5개 수집 (Linear, Vercel, Cursor, v0, Raycast) → `docs/design-refs.md`
- [x] 1.3 핵심 화면 3개 와이어프레임 (Landing, Review List, Review Detail) → `docs/wireframes.md` (Figma 대신 ASCII 가이드)
- [x] 1.4 `pnpm create next-app` (TS, Tailwind, App Router, ESLint)
- [x] 1.5 ESLint + Prettier + Husky + lint-staged 설정
- [x] 1.6 `tsconfig.json` strict 모드 + paths 설정
- [x] 1.7 GitHub repo 생성, README 초안, Issues + Projects 보드 (Issues/Projects 보드는 수동 설정 권장)
- [x] 1.8 Vercel 프로젝트 연결, 첫 배포 확인 → https://code-review-ai-azure.vercel.app/
- [x] 1.9 회고 작성 → `docs/decisions/wk1-retro.md`

---

## Week 2: 디자인 시스템 기반 (목표 10h)

- [x] 2.1 `app/globals.css`의 `@theme` 블록에 디자인 토큰 적용 — 액센트는 indigo로 결정
- [x] 2.2 CSS 변수로 다크/라이트 테마 정의 — `.dark` class selector + `next-themes` Provider
- [x] 2.3 Inter, JetBrains Mono 폰트 로드 — `next/font/google`, `--font-sans`/`--font-mono`로 노출
- [x] 2.4 Radix UI 설치 — slot/dialog/tabs/tooltip/select + sonner + cva/clsx/tailwind-merge + `lib/utils/cn.ts`
- [x] 2.5 컴포넌트 작성: Button (5 variants), Input, Card, Badge, Dialog — `components/ui/` + Raycast식 모션 토큰
- [x] 2.6 Storybook 설치 및 설정 — `@storybook/nextjs-vite` + preview에 `globals.css` + next-themes 토글
- [x] 2.7 위 5개 컴포넌트 스토리 작성 (각 3+ variant) — `stories/*.stories.tsx`, wireframe(ReviewRow/Severity) 매핑 포함
- [x] 2.8 Chromatic 연동 및 배포 — baseline 등록 (23 stories), `.github/workflows/chromatic.yml`로 push/PR 자동 publish
- [ ] 2.9 회고 작성

---

## Week 3: 디자인 시스템 확장 + 레이아웃 (목표 10h)

- [ ] 3.1 컴포넌트 추가: Tabs, Tooltip, Toast, Select, Skeleton, Avatar
- [x] 3.2 `next-themes`로 다크모드 토글 — 2.2와 같이 처리 (토글 버튼 UI는 3.3 Header에서)
- [ ] 3.3 앱 레이아웃: Header (로고+nav+사용자), Sidebar, Main
- [ ] 3.4 랜딩 페이지: Hero + Features + CTA + Footer
- [ ] 3.5 로딩/에러 boundaries 추가
- [ ] 3.6 모든 신규 컴포넌트 Storybook 스토리
- [ ] 3.7 회고 작성

---

## Week 4: 코드 입력 & AI 라우팅 (목표 10h)

- [ ] 4.1 Monaco Editor 설치 및 통합
- [ ] 4.2 코드 입력 폼: 직접 붙여넣기 모드
- [ ] 4.3 GitHub URL 입력 모드 (Octokit으로 파일 fetch)
- [ ] 4.4 `lib/ai/router.ts`에 `detectTaskType()` 구현 (PROJECT.md §5)
- [ ] 4.5 모델별 프롬프트 분리 (`lib/ai/prompts/`)
- [ ] 4.6 Anthropic SDK + Vercel AI SDK 통합
- [ ] 4.7 `/api/review` Route Handler 작성 (스트리밍)
- [ ] 4.8 라우팅 결정 근거 UI 표시 (어떤 모델이 왜 선택됐는지)
- [ ] 4.9 회고 작성

---

## Week 5: 리뷰 결과 UI (목표 10h)

- [ ] 5.1 리뷰 응답 파싱 (구조화된 JSON 응답 파싱 또는 마크다운 렌더링)
- [ ] 5.2 IssueCard 컴포넌트: 심각도 배지, 카테고리, 라인 정보
- [ ] 5.3 코드 라인 하이라이트 (Monaco decorations)
- [ ] 5.4 Diff 뷰어 (react-diff-viewer-continued)
- [ ] 5.5 카테고리 필터 (버그/성능/스타일/보안)
- [ ] 5.6 인라인 코멘트 UI
- [ ] 5.7 빈 상태/로딩 상태 디자인
- [ ] 5.8 회고 작성

---

## Week 6: 히스토리 & 인증 (목표 10h)

- [ ] 6.1 Neon Postgres 프로젝트 생성, 환경변수 설정
- [ ] 6.2 Drizzle 스키마 정의: users, reviews, issues, usage_logs
- [ ] 6.3 마이그레이션 실행
- [ ] 6.4 Auth.js + GitHub Provider 설정
- [ ] 6.5 보호된 라우트 미들웨어
- [ ] 6.6 리뷰 히스토리 페이지 (페이지네이션)
- [ ] 6.7 리뷰 상세 페이지 (저장된 리뷰 다시 보기)
- [ ] 6.8 비용 대시보드: 모델별 사용량 차트 (Recharts)
- [ ] 6.9 "라우팅으로 X% 절감" 계산 로직 + 표시
- [ ] 6.10 회고 작성

---

## Week 7: 폴리싱 & 최적화 (목표 10h)

- [ ] 7.1 모든 페이지에 Skeleton 로더
- [ ] 7.2 에러 처리 통일 (ErrorBoundary + Toast)
- [ ] 7.3 모바일 반응형 (브레이크포인트별 점검)
- [ ] 7.4 Lighthouse 측정 → 95+ 미달 시 개선
- [ ] 7.5 `@next/bundle-analyzer`로 번들 점검
- [ ] 7.6 이미지 최적화 (next/image, AVIF/WebP)
- [ ] 7.7 키보드 네비게이션 전수 점검
- [ ] 7.8 ARIA 라벨, axe DevTools로 검증
- [ ] 7.9 Playwright E2E 테스트 1~2개 (로그인 → 리뷰 생성 플로우)
- [ ] 7.10 회고 작성

---

## Week 8: 문서화 & 홍보 (목표 10h)

- [ ] 8.1 README 완성: 배지, 데모 GIF, 아키텍처 다이어그램(Mermaid), 기술 의사결정
- [ ] 8.2 ADR 문서 3개 (`docs/decisions/`): 라우팅 전략, RSC vs Client, 디자인 시스템 결정
- [ ] 8.3 데모 영상 녹화 (Loom, 2~3분)
- [ ] 8.4 기술 블로그 글 1: "Claude Multi-Model 라우팅으로 AI 비용 70% 줄이기"
- [ ] 8.5 기술 블로그 글 2: "Next.js 15 RSC로 만든 디자인 시스템"
- [ ] 8.6 커스텀 도메인 연결 (선택)
- [ ] 8.7 이력서/포트폴리오 사이트에 추가
- [ ] 8.8 디스콰이엇/긱뉴스/X 공유 (선택)
- [ ] 8.9 최종 회고

---

## 진행 규칙

1. **체크박스를 PR/커밋 메시지에 명시**: `feat(week2): 2.5 Button component`
2. **MVP 라인은 Week 4까지** — 일정 밀리면 Week 5부터 잘라내기
3. **매주 일요일 30분 회고** — 무엇을 왜 결정했는가 기록
4. **Storybook 배포는 Week 2부터 무조건 살아있게 유지**
