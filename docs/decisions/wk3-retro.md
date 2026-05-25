# Week 3 회고

> 3.7에서 마무리. 디자인 시스템 확장(6 컴포넌트) + 랜딩 페이지 + 레이아웃 추출 + boundaries + 스토리 6개를 한 주에 마친 회고.
> Week 3 시작 직전에 Chromatic CI가 푸시 시점부터 깨져 있어, 작업 절반은 그 트러블을 잡는 데 들어갔다.

## 한 일

- **3.1** UI primitives 6개 추가 — Tabs/Tooltip/Select(Radix 래핑) · Toaster(sonner + next-themes 연동) · Skeleton(`bg-bg-muted animate-pulse`) · Avatar(@radix-ui/react-avatar). 토큰(bg-bg-subtle / border-border-default / duration-fast / ease-out-spring) 일관성 유지. Select chevron은 인라인 SVG로 처리해 아이콘 라이브러리 의존성을 만들지 않음.
- **3.2** Week 2.2에서 이미 처리 — `next-themes` Provider + `.dark` class selector. 별도 작업 없음.
- **3.3** `app/page.tsx`에 인라인으로 두었던 SiteHeader/SiteFooter를 `components/layout/`으로 추출. 양쪽 모두에서 쓰는 LogoMark/ArrowRight는 `components/icons.tsx`로 공용 분리. **Sidebar는 wireframe(landing/list/detail 모두 좌측 nav 없음)과 어긋나 보류**, ROADMAP에 그 의사결정을 명시.
- **3.4** 랜딩 페이지 구현 (`app/page.tsx` 단일 파일, 섹션별 함수 분리) — Hero / RoutingDiagram(3-tier lane) / FeatureGrid(3-column Card) / FinalCta / SiteHeader+SiteFooter. wireframes.md §1 그대로 반영. 라우팅 시각화는 정적 다이어그램으로 시작 (live mini-demo는 Week 4 이후).
- **3.5** `app/loading.tsx` (Skeleton 4줄로 hero placeholder) + `app/error.tsx` (`'use client'` boundary, Card + Try again 버튼, digest 노출). Root 한 단계에 두어 모든 라우트가 fallback을 받게 함.
- **3.6** 6 컴포넌트 × 3+ variant 스토리 — wireframe Review Detail/List를 데모로 옮긴 `Tabs.ReviewDetail`, `Select.Filter`, `Skeleton.ReviewRow`, `Avatar.Group`(reviewer stack)이 핵심.

## 트러블슈팅 노트

### 1. Vercel 배포가 'no pnpm version is specified' 로 실패

- **증상**: Vercel/Chromatic 빌드 환경이 `package.json`에서 pnpm 버전을 못 찾아 즉시 fail.
- **원인**: `packageManager` 필드 미설정. Corepack/Vercel은 이 필드를 source of truth로 씀.
- **해결**: `"packageManager": "pnpm@11.0.9"` 추가 (로컬과 동일 버전 명시) — 커밋 `873189b`.
- **교훈**: pnpm 사용 프로젝트는 `packageManager` 필드 없으면 CI/배포에서 거의 무조건 깨진다. Week 1에 이미 박아뒀어야 함.

---

### 2. Chromatic CI가 `node:sqlite` 빌트인 모듈을 못 찾아 폭주

- **증상**: GitHub Actions `chromatic.yml`이 pnpm store path 호출에서 `Error [ERR_UNKNOWN_BUILTIN_MODULE]: No such built-in module: node:sqlite`로 즉사. pnpm 자체가 경고 출력: "This version of pnpm requires at least Node.js v22.13".
- **원인**: 워크플로우의 `actions/setup-node@v4`가 Node 20을 깔았는데 pnpm 11은 Node 22.13+ 의 `node:sqlite` 빌트인을 import함.
- **해결**: 워크플로우의 `node-version: 20 → 22` — 커밋 `b03cc50`.
- **교훈**: `packageManager`로 pnpm 버전을 박으면 그에 맞는 Node 버전도 CI에 강제해야 함. 둘은 짝.

---

### 3. Storybook 빌드가 Linux CI에서 `staticDirs` 디렉토리를 못 찾음

- **증상**: Chromatic이 Storybook을 빌드하다가 `Failed to load static files, no such directory: ./.storybook/..\public` 로 실패. 경로의 백슬래시가 그대로 보인다.
- **원인**: `.storybook/main.ts`에 `staticDirs: ['..\\public']`. Windows IDE(intelliJ/VSCode)가 자동완성하면서 들어간 백슬래시. Windows는 양쪽 다 인식하지만 Linux는 백슬래시를 디렉토리 구분자로 안 봄.
- **해결**: `['../public']`로 교체 — 커밋 `0e8a6e0`. 메모리에도 영구 규칙으로 기록 (`feedback_path_separator.md`): 설정 파일 경로는 **항상 forward slash**.
- **교훈**: cross-platform 프로젝트(Windows dev + Linux CI)에서는 IDE가 자동 생성하는 경로조차 신뢰 못함. lint나 typecheck가 잡아주지 않으니 첫 CI 실패 때 학습 비용으로 흡수.

---

### 4. ROADMAP과 wireframe이 어긋남 (3.3 Sidebar)

- **증상**: ROADMAP 3.3은 "Header + **Sidebar** + Main"인데, wireframes.md의 세 화면 모두 Sidebar 없이 Header만 있음.
- **원인**: ROADMAP 작성 시점(Week 1)과 wireframe 확정 시점(Week 1.3) 사이의 진화 — 와이어프레임 작업 중 "Linear 같은 사이드바보다 Vercel 같은 상단 nav가 이 도구에 더 맞다"로 의사결정이 갔지만 ROADMAP 문구가 갱신 안 됨.
- **해결**: 사용자 컨펌 받고 "Sidebar 보류, 인증 도입 시 재검토"를 ROADMAP에 명시. 코드 차원에선 SiteHeader/SiteFooter 추출만 진행.
- **교훈**: ROADMAP은 산출물 트래커지 설계서가 아님. 와이어프레임이 더 신선한 의사결정. 충돌 시 와이어프레임 우선 + ROADMAP에 사유 적어 흔적 남기기.

---

## 배운 것

- **pnpm 버전을 박는 한 줄(`packageManager`)이 CI 전체의 안정성을 좌우** — 이 한 필드가 없으면 Vercel/GitHub Actions/Chromatic이 전부 다른 pnpm을 깔고, 일부는 Node 호환성에서 깨진다. Week 1 셋업 체크리스트에 영구 추가할 항목.
- **Storybook 스토리는 컴포넌트 카탈로그가 아니라 화면 조립 도구** — Week 2.7에 이어 이번 주도 wireframe의 실제 영역(Review row, filter bar, tab header, reviewer stack)을 그대로 스토리로 떴다. Week 5 진입 시 "스토리에서 발췌해 페이지에 붙이면" 끝나는 구조가 되어가는 중.
- **shadcn 패턴은 sonner Toaster에서도 똑같이 작동** — Radix 외 라이브러리(sonner)도 `useTheme()` + `classNames` 매핑만 해주면 디자인 토큰 안으로 흡수된다. 직접 Toast를 짜는 것보다 훨씬 적은 코드.
- **Next.js의 `loading.tsx` / `error.tsx` 파일 컨벤션은 boundary 코드를 강제로 isolate시킨다** — `error.tsx`는 무조건 `'use client'`라 server 컴포넌트와 자연스럽게 분리. 어디서 무엇이 실행되는지 한 눈에 보이는 게 RSC의 진짜 효용.
- **인라인 SVG > 아이콘 라이브러리(이 프로젝트 스케일에서)** — 랜딩에서 9개 아이콘 썼는데 모두 인라인. lucide-react 같은 걸 깔지 않아 번들 사이즈가 그대로. 100개 넘어가면 라이브러리가 이김, 그 전까진 인라인이 단순.

## 다음 주 우선순위 (Week 4)

1. **4.1 Monaco Editor 통합** — lazy import 필수(번들 큼). 다크모드 토큰 매핑까지 같이.
2. **4.2 + 4.3 코드 입력 폼** — paste 모드를 먼저, GitHub URL 모드는 Octokit 도입.
3. **4.4 + 4.5 라우터** — `detectTaskType()` + 모델별 프롬프트. PROJECT.md §5 그대로.
4. **4.6 + 4.7 Anthropic SDK + Route Handler 스트리밍** — `lib/ai/` 디렉토리부터 만들고 시작.
5. **4.8 라우팅 근거 UI** — 어떤 모델이 왜 선택됐는지 화면에 노출. 차별점.

**리스크**: Week 4가 MVP 라인. 4.1 Monaco가 번들 사이즈와 SSR 호환성에서 까다로움(`'use client'` + dynamic import 강제), 그리고 4.7 스트리밍 + 라우팅 결정 UI를 같이 굴려야 함. 시간 부족 시 **4.3 GitHub URL 모드를 5주차로 미루고 4.2 paste만으로 MVP 완성**하는 분기 준비.

## 의사결정

- **`packageManager` 필드를 pnpm 11.0.9로 박음** — 로컬과 정확히 동일. Vercel/Chromatic이 corepack 경유로 같은 버전을 깔게 강제. 차후 pnpm 업그레이드는 이 필드와 워크플로우 Node 버전을 함께 갱신.
- **CI Node를 22로 통일** — pnpm 11 요구 + Next 16 권장 + LTS. Node 20을 유지할 이유가 없음.
- **Storybook 설정 경로는 항상 `/`** — Windows IDE 자동완성에서 들어가는 `\\` 절대 금지. 메모리에 영구 규칙으로 기록(`feedback_path_separator.md`).
- **Sidebar 도입 보류** — wireframe 일관성 우선. 인증/대시보드가 들어오는 Week 6에 재검토. 그 전엔 Header만으로 충분(Linear도 메인 nav는 결국 상단).
- **랜딩 페이지는 단일 파일에 섹션 함수로 분리** — `app/page.tsx` 안에서 Hero/RoutingDiagram/FeatureGrid/FinalCta를 로컬 함수로 둠. 외부 파일로 빼지 않은 이유: 다른 페이지에서 재사용 안 함, "single-use code는 추상화하지 않는다" 원칙. Header/Footer는 다른 페이지에서도 쓰니까 분리.
- **공용 아이콘은 `components/icons.tsx` 단일 파일, 페이지 전용은 page 안에 둠** — LogoMark/ArrowRight는 Header+Hero+CTA에서 공유라 추출, Star/RouteIcon/CommentIcon/ChartIcon/Arrow는 page에서만 쓰니까 그 자리에 유지. 추후 다른 페이지에서 쓰게 되면 그때 옮긴다.
- **`loading.tsx`/`error.tsx`는 root 한 단계에만** — 모든 라우트가 fallback 받음. 페이지별로 더 정교한 placeholder가 필요해지면 (예: `/reviews/loading.tsx`로 ReviewRow Skeleton 행렬) 그 라우트가 생길 때 추가.
- **Toast는 sonner + next-themes 연동만, 자체 구현 안 함** — 7KB짜리 라이브러리가 cancel/action/promise/queue까지 다 처리. 직접 짜면 200줄+ 그리고 a11y 처리(role="status" 등)도 다시 검증해야 함. 표준 라이브러리 채택이 합리적 비용.
- **회고는 한 주 단위 + 한 PR에 묶기** — Week 1/2와 동일 규칙 유지.
