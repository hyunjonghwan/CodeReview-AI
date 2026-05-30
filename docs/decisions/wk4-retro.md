# Week 4 회고

> 4.8에서 마무리. MVP 라인(코드 입력 → 라우팅 → 스트리밍 결과 → 근거 노출)을 한 주에 완성한 회고.
> 4.1~4.5는 앞선 세션에서, 4.6(Route Handler 스트리밍)·4.7(라우팅 근거 UI)은 이번 세션에서 처리.
> GitHub URL 입력 모드(구 4.3)는 계획대로 Week 6.6a로 이관 — OAuth 도입 후 rate limit 회피 목적.

## 한 일

- **4.1** Monaco Editor 통합 — `@monaco-editor/react` + `monaco-editor`, `components/code/code-editor.tsx`. `next/dynamic` `ssr:false`로 lazy import(번들 큼), next-themes와 `vs`/`vs-dark` 동기화.
- **4.2** 코드 입력 폼(paste 모드) — `/reviews/new` 서버 페이지 + `new-review-form.tsx` 클라이언트. 제출은 4.6 도착 전까지 sonner toast 임시 처리.
- **4.3** `lib/ai/router.ts` `detectTaskType()` — `RouterDecision`(taskType+model+reason) 반환. 크기/파일수 임계값(50줄·500줄·5파일)으로 simple-style/general-review/deep-analysis 분기, userIntent override 지원.
- **4.4** 모델별 프롬프트 분리(`lib/ai/prompts/`) — 한국어 system prompt, JSON 출력 키만 영어. 공통 `output-schema.ts`로 타입+스키마 지시문 공유.
- **4.5** Anthropic SDK + Vercel AI SDK 통합 — `lib/ai/client.ts`의 `planReview()`가 router 결정 + `LanguageModel` + system prompt를 묶어 반환. 이게 4.6의 직접 입력원이 됨.
- **4.6** `/api/review` Route Handler(스트리밍) — `streamText` + `toTextStreamResponse`. `planReview()`가 반환하는 `LanguageModel`을 그대로 사용. 라우팅 결정은 `X-Review-Model/-Task/-Reason` 헤더로 동봉. 폼은 toast 스텁을 제거하고 fetch + 스트림 리더로 배선, 결과는 임시 `<pre>` 패널(Week 5에서 IssueCard로 교체). curl로 400 2종·헤더·실제 스트리밍 출력까지 검증.
- **4.7** 라우팅 근거 UI — 도메인 컴포넌트 `components/review/model-indicator.tsx` 신규(model id → Haiku/Sonnet/Opus 라벨 + 티어별 액센트). 폼의 임시 뱃지를 `Detected: {taskType} → [ModelIndicator]` + "Why this model? {reason}" 블록으로 교체. wireframes.md §3 Summary 탭의 "Why this model?" 포맷을 라이브 화면에 선반영.

## 트러블슈팅 노트

### 1. API 키는 유효한데 크레딧 잔액 0 → 200 + 빈 본문

- **증상**: 실제 스트리밍 호출 시 HTTP 200 + 라우팅 헤더는 정상인데 본문이 비어서 옴. 클라이언트는 "리뷰 생성 중…" 뒤 아무것도 안 뜸.
- **원인**: Anthropic 계정 크레딧 부족(`invalid_request_error: Your credit balance is too low`). `toTextStreamResponse`는 200 헤더를 **먼저** 흘려보낸 뒤 본문을 스트리밍하므로, 모델 호출이 거기서 실패하면 상태코드로는 못 알리고 서버 로그로만 남는다.
- **해결**: 크레딧 충전 후 실제 출력 확인. 동시에 이 구멍을 막기 위해 (a) 서버 `streamText({ onError })`로 실패를 간결히 로깅, (b) 클라이언트는 "스트림 done인데 누적 본문이 비면 에러로 간주" 가드 추가.
- **교훈**: 스트리밍 엔드포인트는 happy-path 200이 성공을 보장하지 않는다. 헤더가 먼저 나가는 구조라 본문 단계 실패를 클라이언트가 별도 신호(빈 본문/스트림 에러 파트)로 감지해야 한다. 본격 통일은 Week 7.2.

### 2. 라우팅 reason이 한국어 → HTTP 헤더(ASCII)에 직접 못 넣음

- **증상**: 리뷰 본문은 텍스트 스트림이라, 라우팅 결정(모델·이유)을 함께 보내려면 별도 채널이 필요. 헤더에 한국어 reason을 넣으니 문제.
- **원인**: HTTP 헤더 값은 ASCII/latin-1. "단일 파일 · 6줄(<50)로…" 같은 한국어가 그대로 못 들어감.
- **해결**: 서버에서 `encodeURIComponent(reason)`, 클라이언트에서 `decodeURIComponent`. model/taskType은 ASCII라 그대로.
- **교훈**: 사이드밴드 메타데이터를 헤더로 보낼 땐 인코딩 전제. 메타가 더 커지면 헤더 대신 AI SDK data stream(`toUIMessageStreamResponse`)으로 옮기는 게 자연스럽다.

### 3. 모델이 "코드펜스 금지" 지시를 무시하고 ```json으로 감쌈

- **증상**: 출력 JSON이 ` ```json … ``` ` 펜스로 감싸여 옴. `OUTPUT_SCHEMA_INSTRUCTION`에 "마크다운 코드펜스 절대 추가 금지"라고 명시했는데도.
- **원인**: 프롬프트 지시만으로는 포맷을 강제할 수 없음(특히 Haiku). 4.6은 raw 텍스트를 `<pre>`로만 보여줘 당장은 무해하나, Week 5.1에서 `JSON.parse`하면 깨진다.
- **해결**: 당장은 기록만. 메모리에 영구 노트(`project_review_json_codefence.md`) + ROADMAP 4.6/5.1에 주의 명시.
- **교훈**: 구조화 출력은 프롬프트 지시가 아니라 **스키마 강제**로 풀어야 한다. Week 5.1에서 펜스 스트립 또는 `streamObject` + Zod 전환이 정공법.

### 4. `noUncheckedIndexedAccess`가 ModelIndicator의 맵 인덱싱을 잡음

- **증상**: `FAMILY_META[family]`가 `{…} | undefined`로 추론돼 tsc TS2322.
- **원인**: tsconfig strict + `noUncheckedIndexedAccess`. 정규식이 세 family만 캡처해도 TS는 `family`를 `string`으로 보므로 인덱스 결과가 옵셔널.
- **해결**: `(family && FAMILY_META[family]) || { label: model, tier: 'unknown' }`로 폴백 좁히기. 알 수 없는 모델 id는 원문 그대로 표시.
- **교훈**: 이 프로젝트의 엄격 설정에선 "키가 항상 있다"는 사람 지식이 타입으로 안 넘어간다. 맵 조회는 항상 폴백을 코드로 명시.

## 배운 것

- **`planReview()`가 AI SDK용으로 설계돼 있어 4.6이 거의 배선만으로 끝났다** — `model: anthropic(id)`를 미리 `LanguageModel`로 반환해둔 덕에 `streamText({ model })`에 그대로 꽂힘. 4.5에서 추상화를 한 단계 맞춰둔 게 4.6의 마찰을 0으로 만들었다.
- **streamText vs raw Anthropic SDK는 "프로바이더 중립 + Next/React 헬퍼" vs "Claude 전용 최대 제어"의 트레이드오프** — usage 통계·`toTextStreamResponse`·향후 `useObject`까지 한 추상화로 이어지는 게 이 프로젝트엔 이득. raw SDK의 강점(prompt caching 헤더 등)은 비용 최적화가 필요한 Week 6 이후 부분 차용.
- **스트리밍은 에러 표면이 둘이다** — 연결 전 실패(상태코드로 표현 가능)와 본문 중 실패(헤더 이미 나감). 후자를 위해 클라이언트에 별도 감지 로직이 필수. curl `-N -D -`로 헤더와 본문을 갈라 보는 게 진단에 결정적이었다.
- **도메인 컴포넌트의 첫 타자(ModelIndicator)를 `components/review/`에 둠** — model id에서 family를 파싱해 라벨/티어를 끌어, router의 MODEL_MAP을 재정의하지 않음. 버전이 올라가도(`-4-5` → `-4-6`) 그대로 동작.

## 다음 주 우선순위 (Week 5: 리뷰 결과 UI)

1. **5.1 응답 파싱** — ```json 펜스 스트립부터. 더 견고하게는 `streamObject` + Zod로 전환해 부분 JSON 스트리밍 렌더까지 노림(트러블슈팅 #3 직결).
2. **5.2 IssueCard** — 심각도 글리프(▲◆○) + 카테고리 + 라인. 임시 `<pre>` 패널을 대체.
3. **5.3 Monaco decorations** — 이슈 라인 하이라이트, 카드 ↔ 코드 라인 연동(wireframe §3).
4. **5.5 카테고리 필터** — Bug/Perf/Style/Sec 4종(+ readability/architecture는 표시 매핑 정리 필요).

**리스크**: output-schema는 category 6종(style/readability/bug/performance/security/architecture)인데 wireframe은 4종(Bug/Perf/Style/Sec)으로 압축. 5.2/5.5 진입 전 6종 → 4종 표시 매핑을 먼저 정해야 카드/필터가 흔들리지 않는다.

## 의사결정

- **4.6은 `streamText`(텍스트 → 파싱)로, raw Anthropic SDK 아님** — `planReview()`의 `LanguageModel`을 그대로 쓰고, 4.7 근거 UI·6.8 usage 대시보드까지 같은 추상화로 잇기 위함. 구조화 출력의 실시간 부분 렌더(`streamObject` + Zod)는 Week 5.1로 미룸 — 지금은 raw 텍스트 표시라 불필요.
- **라우팅 결정은 응답 헤더(`X-Review-*`)로 전달** — 본문은 리뷰 텍스트 스트림이므로 사이드밴드가 필요. 한국어 reason은 `encodeURIComponent`. 메타가 커지면 data stream으로 이전.
- **에러 처리는 지금 최소만(서버 onError + 클라 빈본문 가드), 통일은 Week 7.2** — "조용한 빈 화면"만 막고, ErrorBoundary+Toast 통합은 폴리싱 주차로.
- **ModelIndicator를 도메인 컴포넌트로 신설, 단 랜딩 다이어그램은 이번에 손대지 않음** — 4.7 범위는 "리뷰의 라우팅 근거 노출"이지 랜딩 리팩터가 아님. 랜딩 라우팅 다이어그램의 ModelIndicator 통일은 wireframe 일관성 항목으로 남겨 추후 처리(surgical change 원칙).
- **결과 패널은 임시 `<pre>`로 시작** — 구조화 IssueCard는 Week 5.2. 4.6/4.7 단계에선 "스트리밍과 라우팅 근거가 실제로 흐르는지"를 먼저 증명하는 게 목적.
- **GitHub URL 모드는 Week 6.6a 유지** — OAuth 토큰으로 인증된 fetch(rate limit 회피). Week 4는 paste 모드만으로 MVP 라인 완성, wk3 회고에서 준비한 분기를 그대로 실행.
