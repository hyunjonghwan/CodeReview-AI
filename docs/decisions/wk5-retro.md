# Week 5 회고

> 5.8에서 마무리. 스트리밍 텍스트만 보여주던 결과 화면을 구조화된 리뷰 UI로 끌어올린 주.
> 핵심은 "파싱(5.1) → IssueCard(5.2) → 코드 연동(5.3/5.6) → 필터·상태(5.5/5.7)"를 하루에 묶어 완성.
> 시작 전 두 갈림길(파싱 방식, 카테고리 6→4 매핑)을 먼저 정하고 들어간 게 흔들림을 줄였다.

## 한 일

- **5.1** 응답 파싱 — `lib/ai/parse-review.ts`. ```json 펜스 스트립(정규식) + `JSON.parse` + 최상위 형태 가드(summary:string, issues:array). 실제 스트리밍 출력으로 파싱 통과 검증(line 1/2/4 이슈 3건 추출).
- **5.2** IssueCard — `components/review/issue-card.tsx`. 심각도 글리프(▲◆○) + 기존 Badge variant(error/warning/info) 재사용, 카테고리(6→4 그룹), Line N, suggestion은 코드블록. 공유 매핑은 `issue-meta.ts`로 분리.
- **5.3** Monaco 라인 하이라이트 — `code-editor.tsx`에 `onMount`로 editor/monaco 인스턴스 확보 + `createDecorationsCollection`. 이슈 라인에 gutter 바 + 라인 배경(`globals.css`의 `.cr-issue-*`, accent-500 기반).
- **5.4** Diff 뷰어 — **이연.** 단일 붙여넣기엔 before/after가 없어 full diff가 부적합. suggestion을 IssueCard 코드블록으로 갈음하고, `react-diff-viewer-continued`는 실제 diff가 있는 6.6a(GitHub PR 모드)로 미룸.
- **5.5** 카테고리 필터 — `review-result.tsx`의 필터 칩(All + 결과에 존재하는 그룹만). 6종→4종(Bug/Perf/Style/Sec) 매핑.
- **5.6** 인라인 연동 — 카드 클릭 → `activeLine` 상태 → 에디터 `revealLineInCenter` + active 데코 강조. 카드↔코드 양방향 시각 연결.
- **5.7** 빈/로딩/실패 상태 — 이슈 0건 빈 상태("발견된 이슈가 없습니다"), 스트리밍 중 로딩, 파싱 실패 시 원문 폴백, 에러 메시지.

## 트러블슈팅 노트

### 1. 펜스 래핑 실측 재확인 → 파싱 단계에서 흡수

- **증상**: Week 4.6에서 기록한 ```json 래핑이 5.1 파싱의 직접 위협.
- **해결**: `stripCodeFence()` 정규식(`^```(?:json)?\s*\n?([\s\S]*?)\n?```$`)으로 벗긴 뒤 파싱. 실제 출력으로 PARSE OK 확인.
- **교훈**: 프롬프트 지시로 못 막은 포맷은 파싱 레이어에서 방어하는 게 현실적. 단, 근본 해결(streamObject+Zod)은 별개로 남아 있음(아래 의사결정).

### 2. `noUncheckedIndexedAccess`가 또 등장 (카테고리/심각도 맵)

- **증상**: `CATEGORY_GROUP[category]`, `SEVERITY_GLYPH[severity]` 인덱싱이 `| undefined`로 잡힘. 게다가 파싱 단계에서 카테고리/심각도 값을 검증하지 않으므로 런타임에 스키마 밖 값이 올 가능성도 실재.
- **해결**: `categoryGroup()`/`severityGlyph()`/`severityVariant()` 폴백 헬퍼로 감싸 타입 안전 + 런타임 안전 동시 확보(`(MAP as Record<string, …>)[k] ?? fallback`).
- **교훈**: wk4의 교훈 재확인 — 이 프로젝트 엄격 설정에선 맵 조회에 항상 폴백. 특히 "검증 안 한 외부 데이터(LLM 출력)"를 키로 쓸 땐 폴백이 곧 크래시 방지.

### 3. PowerShell cwd가 프로젝트 폴더로 이동해 `pnpm -C` 중첩

- **증상**: `pnpm -C codereview-ai exec tsc`가 `...\codereview-ai\codereview-ai` ENOENT로 실패.
- **원인**: 세션 중 PowerShell 작업 디렉토리가 프로젝트 폴더로 옮겨져 상대 경로 `-C codereview-ai`가 한 번 더 붙음.
- **해결**: `-C`에 절대 경로 사용. (프로젝트 자체 이슈 아님, 세션 운용 노트)

## 배운 것

- **도메인 컴포넌트 폴더(`components/review/`)가 자리잡음** — 4.7 ModelIndicator에 이어 issue-card / issue-meta / review-result 합류. UI 프리미티브(`components/ui/`)와 도메인 컴포넌트의 경계가 명확해짐.
- **카테고리 6→4는 "데이터 보존 + 표시 그룹핑"으로 풀면 정보 손실이 없다** — output-schema의 6종은 그대로 두고, 표시·필터에서만 4종으로 묶음. wireframe 제약(4종)과 스키마(6종)를 둘 다 만족.
- **Monaco는 `createDecorationsCollection`(modern API)으로** — deprecated `deltaDecorations` 대신. CSS는 Monaco 내부 DOM이라 전역 클래스로 정의해야 적용됨(Tailwind scoped 클래스 안 먹음).
- **parse-on-done은 단순하지만 "라이브감"이 없다** — 스트리밍이 끝나야 카드가 한 번에 뜬다. streamText를 고른 대가. 제품의 스트리밍 서사를 살리려면 결국 streamObject 전환이 정답(Week 6+).

## 다음 주 우선순위 (Week 6 — 분할 권장)

새 도구가 5개(Neon/Drizzle/Auth.js/Octokit/Recharts)라 10h를 넘길 가능성이 커, **2주로 쪼개는 걸 권장**:

1. **6a (데이터 + 인증, 6.1–6.5)** — Neon Postgres + Drizzle 스키마(users/reviews/issues/usage_logs) + 마이그레이션 + Auth.js GitHub 로그인 + 보호 라우트.
2. **6b (히스토리 + 가치, 6.6–6.9)** — 히스토리/상세 페이지 + **6.6a GitHub URL 모드(Octokit)** + 비용 대시보드(Recharts) + "라우팅 X% 절감" 계산.

**리스크**: 6.8/6.9 비용 절감 시각화가 제품 헤드라인 가치인데, 이건 usage_logs(6.2)에 데이터가 쌓여야 의미가 있음 → DB 스키마를 짤 때 usage(모델·토큰·비용) 기록을 처음부터 정확히 설계해야 뒤가 편하다. 6.6a 들어갈 때 5.4 full diff 뷰어도 함께 도입(이연분 회수).

## 의사결정

- **streamText 유지 + 펜스 스트립(streamObject 보류)** — Week 5는 "결과 UI를 보기 좋게"가 목표라 파싱은 최소 경로로. 펜스 문제는 `parseReview`에서 흡수. 실시간 부분 렌더가 필요해지는 시점(또는 파싱이 더 깨지면) streamObject+Zod로 전환.
- **카테고리 6종 데이터 유지 + 표시 4종 그룹핑(wireframe-first)** — `bug·architecture→Bug`, `performance→Perf`, `security→Sec`, `style·readability→Style`. wireframe의 "4종 외 추가 금지" 제약을 표시 레이어에서 충족하되 원본 분류는 보존.
- **5.4 full diff 뷰어 → 6.6a로 이연** — 단일 붙여넣기엔 비교 대상이 없음. suggestion은 카드 코드블록으로 충분. 실제 before/after가 생기는 GitHub PR 모드에서 도입.
- **도메인 컴포넌트는 `components/review/`에 집약** — issue-card / issue-meta / review-result / model-indicator. 페이지(`new-review-form`)는 상태 오케스트레이션만 담당.
- **결과 렌더는 parse-on-done(완료 시 일괄)** — 스트리밍 중에는 원문을 muted로 흘리고, done 시 파싱해 카드로 교체. 실시간 카드 채움은 streamObject 전환 과제로.
