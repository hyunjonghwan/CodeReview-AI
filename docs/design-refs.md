# Design References

> Week 1.2 산출물. Week 2~3 디자인 시스템/레이아웃 작업의 기준점.
> 각 서비스에서 **CodeReview-AI에 가져올 만한 요소 1~3개**만 짧게 메모.

## 작성 가이드

- 스크린샷은 `docs/design-refs/` 하위에 저장하고 상대 경로로 임베드
  - 예: `![](./design-refs/linear-issue-list.png)`
- 메모는 한 줄 결론 위주
- 색/타이포/간격/모션 중에 **하나라도** 우리가 따라하고 싶은 게 있으면 적기

---

## 1. Linear (linear.app)

**왜 참고하는가**: 정보 밀도 높은 리스트, 키보드 우선 UX, 절제된 타이포

### 가져올 요소

- [x] **이슈 행 패턴**: 좌측 컬러 도트(6px) + 제목 한 줄 + 우측 메타(상태/담당자/시간) → `ReviewList` 페이지 행 디자인의 기준
- [x] **`Cmd+K` 글로벌 명령 팔레트**: 네비게이션/액션 통합 — 우리도 Week 3에서 도입 검토
- [x] **무채색 베이스 + 단일 액센트**: 90%는 회색 톤, 강조만 1색 → 디자인 토큰 `accent`를 단일 컬러로 좁힐 근거

### 스크린샷

<!-- ![Linear Issue List](./design-refs/linear-issue-list.png) -->

---

## 2. Vercel Dashboard (vercel.com/dashboard)

**왜 참고하는가**: 모노크롬 미니멀, 대시보드 카드 패턴, sparkline 메트릭 표현

### 가져올 요소

- [x] **배포 카드 status dot**: 좌측 상단 작은 원(녹/회/적) + 깃 브랜치/커밋 메시지/상대시간 → `ReviewCard`에 동일 패턴 적용
- [x] **Hover 시 1px 보더 컬러 변화**: 클릭 affordance를 그림자 없이 표현 — `--color-border` / `--color-border-strong` 토큰 분리 근거
- [x] **Sparkline 차트**: 그리드 없이 가는 라인만 → 비용 대시보드 Recharts 스타일 가이드

### 스크린샷

<!-- ![Vercel Dashboard](./design-refs/vercel-dashboard.png) -->

---

## 3. Cursor (cursor.com)

**왜 참고하는가**: AI + 코드 도구의 정답지. 코드 블록/diff/AI 응답 표현

### 가져올 요소

- [x] **좌(에디터) / 우(AI 채팅) 분할 레이아웃**: Review Detail 페이지의 기본 골격으로 채택
- [x] **인라인 diff 색 처리**: 추가 라인 연한 녹색 배경, 삭제 연한 적색 — `react-diff-viewer` 테마 토큰화
- [x] **AI 응답 내 코드 블록의 우상단 액션**: `Apply` / `Copy` 버튼 — IssueCard에 "이 수정 적용" 버튼으로 차용

### 스크린샷

<!-- ![Cursor UI](./design-refs/cursor.png) -->

---

## 4. v0 (v0.dev)

**왜 참고하는가**: AI 응답 스트리밍 UX, shadcn/ui 결의 컴포넌트, 채팅+결과 분할

### 가져올 요소

- [x] **스트리밍 커서 인디케이터**: 응답 중 깜빡이는 `▍` 글리프 → 우리 리뷰 스트리밍에도 동일하게
- [x] **결과/코드 탭 전환**: 상단 탭으로 프리뷰↔소스 토글 → 리뷰 결과를 "요약 / 상세 이슈 / 원본 코드" 탭으로 분리
- [x] **shadcn/ui 톤**: 모서리 6~8px radius, 얇은 보더, 약한 그림자 → 자체 디자인 시스템도 비슷한 결로

### 스크린샷

<!-- ![v0](./design-refs/v0.png) -->

---

## 5. Raycast (raycast.com)

**왜 참고하는가**: 인터랙션 디테일, 모션, 단축키 표시 컨벤션

### 가져올 요소

- [x] **단축키 배지**: `⌘K` 형태로 회색 배경 + 모노스페이스 글리프 → `Kbd` 컴포넌트 신설
- [x] **모달/팝오버 진입 모션**: 150~200ms `scale(0.96 → 1) + opacity(0 → 1)` 짧은 스프링 → 토큰 `motion-fast` 정의
- [x] **풍부한 empty state**: 큰 일러스트 + 한 줄 설명 + 액션 버튼 → "아직 리뷰가 없어요" 화면에 적용

### 스크린샷

<!-- ![Raycast](./design-refs/raycast.png) -->

---

## 종합 인사이트

### 공통점

- **무채색 90% + 액센트 10%** 컬러 전략
- **Inter 또는 시스템 산세리프**, 코드는 **JetBrains Mono / Geist Mono**
- **정보 밀도 우선**: 카드보다 행, 그림자보다 보더
- **키보드 단축키를 일급 시민으로** 노출

### CodeReview-AI만의 차이점

- 모든 화면이 "리뷰 결과 카드" 중심 → Linear의 리스트 + v0의 결과 분할을 결합한 구조
- 라우팅 결정(어떤 모델 썼는지)을 UI에 노출 → 다른 도구엔 없는 차별점, `ModelIndicator` 컴포넌트로 일관 처리
- 비용 메트릭(`CostMeter`)을 항상 보이게 → Vercel 대시보드의 sparkline 활용

### 디자인 토큰 결정 (PROJECT.md §7 보강)

- **색**:
  - 베이스: neutral 그레이 12단계 (배경/표면/보더/텍스트)
  - 액센트: 단일 컬러 1개로 시작 (Week 2 시작 시 결정 — 파랑/보라 후보)
  - Semantic: success(green) / warning(amber) / error(red) / info(blue) 각 4단계(default/fg/bg/border)
- **폰트**:
  - UI: Inter (가변 폰트, 100~900)
  - 코드/숫자: JetBrains Mono
- **간격/radius**: PROJECT.md §7 그대로 (4px scale; radius 4/6/8/12/full)
- **모션**:
  - `motion-fast`: 150ms (호버, 토글)
  - `motion-base`: 200ms (모달, 팝오버 진입)
  - easing: `cubic-bezier(0.16, 1, 0.3, 1)` (Raycast식 ease-out)
