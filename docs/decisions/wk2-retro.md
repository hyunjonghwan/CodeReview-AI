# Week 2 회고

> 2.9에서 마무리. 디자인 시스템 기반(토큰 + 5 컴포넌트 + Storybook + Chromatic)을 한 주에 끝낸 회고.

## 한 일

- **2.1** `app/globals.css`의 `@theme` 블록에 디자인 토큰 적용 — neutral 12단계 + **indigo 액센트** + semantic 4종(success/warning/error/info) + radius 5단계 + motion 토큰
- **2.2 + 3.2** CSS 변수 기반 다크/라이트 정의 + `next-themes` Provider(`attribute="class"` + `suppressHydrationWarning`)로 SSR 깜빡임 없이 토글
- **2.3** `next/font/google`로 Inter + JetBrains Mono 로드, `--font-sans`/`--font-mono` 변수로 노출 → Tailwind 유틸리티가 그대로 사용
- **2.4** Radix UI primitives(slot/dialog/tabs/tooltip/select) + sonner + cva/clsx/tailwind-merge 설치, `lib/utils/cn.ts` 작성
- **2.5** UI primitives 5개 — Button(5 variants × 4 sizes, asChild), Input, Card(6 슬롯), Badge(7 variants), Dialog(Radix 래핑 + Raycast식 진입 모션을 토큰으로 정의)
- **2.6** Storybook 10 + `@storybook/nextjs-vite` 셋업, `.storybook/preview.tsx`에 `app/globals.css` import + toolbar의 theme 글로벌을 `next-themes`로 전파
- **2.6 후속** `storybook init`이 묶어 깔아준 잉여 deps(vitest/playwright/addon-vitest/addon-mcp/addon-a11y) 즉시 가지치기 — ROADMAP에 없는 것은 도입 보류
- **2.7** 5개 컴포넌트 × 각 3+ variant 스토리 — wireframe(ReviewRow, Severity ▲◆○)을 그대로 데모로 옮겨 디자인 시스템과 도메인 의도를 연결
- **2.8** Chromatic 연동 — 첫 publish로 baseline 23 snapshot 등록, `chromatic` CLI dev dep로 pin, `.github/workflows/chromatic.yml`로 push/PR 자동 publish 자동화 (Storybook 라이브: https://6a12e67cc8dfc60b4510bf4b-dlgqkfcfsj.chromatic.com/)

## 트러블슈팅 노트

### 1. `pnpm-workspace.yaml`의 placeholder 재발

- **증상**: `storybook init` 직후 `pnpm-workspace.yaml`에 `esbuild: set this to true or false` 라는 placeholder 문자열이 들어옴.
- **원인**: Week 1 트러블슈팅 #4와 동일 — pnpm 11+가 자동으로 workspace에 lifecycle script 정책을 기록하는데, 비대화 모드(`--yes`)에서 esbuild처럼 새로 등장한 native dep는 placeholder로 남긴다.
- **해결**: `esbuild: true`로 교체. Storybook framework가 `@storybook/nextjs-vite`(Vite 기반)라 esbuild가 transitive로 들어왔고, 빌드를 허용해야 정상 동작.
- **교훈**: 새 framework/native dep 도입 시 `pnpm-workspace.yaml`을 항상 확인. placeholder 자동 정정 PR 같은 게 없으면 사람이 잡아야 함.

---

### 2. Storybook init이 ROADMAP에 없는 deps를 끼워 깔음

- **증상**: `storybook@latest init --yes`가 vitest, playwright, @vitest/browser-playwright, @vitest/coverage-v8, @storybook/addon-vitest, @storybook/addon-mcp, @storybook/addon-a11y를 함께 설치.
- **원인**: Storybook 10의 권장 셋업이 컴포넌트 테스트(addon-vitest)와 a11y addon을 기본 옵트인 시킴. `--yes` 모드는 사용자 컨펌 없이 다 깐다.
- **해결**: 별도 `chore` 커밋(`11951b9`)으로 잉여 deps 7개를 제거. 유지한 건 `@storybook/addon-docs`(필수), `@chromatic-com/storybook`(2.8 Chromatic 연결), `eslint-plugin-storybook`(저비용)뿐.
- **교훈**: CLI init은 항상 "권장"으로 부풀려 깐다. CLAUDE.md "Simplicity First" 원칙에 맞춰 ROADMAP에 없는 건 즉시 가지치기. Week 7.7-7.9에서 a11y/Playwright는 재도입 예정.

---

### 3. `npx chromatic`이 Windows 셸에서 인식 안 됨

- **증상**: `npx chromatic --project-token=...` 실행 시 cp949 인코딩으로 "'chroma'은(는) 내부 또는 외부 명령…" 메시지(=Windows의 표준 "command not found").
- **원인**: 이 환경의 Claude Code bash 도구가 npx 호출 시 binary 해석에 실패. Week 1 트러블슈팅 #1과 같은 셸 PATH/Node 분리 이슈의 변형.
- **해결**: `pnpm dlx chromatic …`로 우회. pnpm은 자체 npm registry mirror + bin shim 경로를 가지고 있어 PATH에 덜 의존.
- **교훈**: Windows + Claude Code 환경에선 임시 binary 실행도 `npx`보다 `pnpm dlx`가 안전. CI(ubuntu-latest)에서는 `chromaui/action`이 직접 chromatic을 호출하므로 무관.

---

### 4. ESLint flat config가 `storybook-static/`을 무시하지 않아 lint 폭주

- **증상**: chromatic publish 후 `pnpm lint`가 갑자기 **11,256 problems (404 errors, 10852 warnings)**.
- **원인**: ESLint 9 flat config는 `.gitignore`를 **자동 적용하지 않는다**. `eslint.config.mjs`의 `globalIgnores`에 `.next/**`, `out/**`, `build/**`만 있었고 `storybook-static/**`은 빠져 있어 압축된 번들 JS까지 전부 lint 대상이 됨.
- **해결**: `globalIgnores`에 `storybook-static/**` 추가.
- **교훈**: ESLint 9 flat config 도입 시 `.gitignore`와 별도로 ignore 패턴을 직접 관리해야 함. **빌드 산출물 디렉토리는 등장 즉시 추가**하지 않으면 다음 lint에서 터진다.

---

## 배운 것

- **Tailwind v4의 `@theme` + `@theme inline` 패턴이 디자인 시스템과 정말 잘 맞는다** — raw 토큰(`--color-neutral-50`)과 시맨틱 토큰(`--color-bg-default`)을 두 단계로 분리하면 컴포넌트는 시맨틱만 보고, 다크모드 전환은 `:root` vs `.dark`의 시맨틱 매핑만 바꾸면 끝. 코드는 그대로다.
- **cva + Radix Slot(`asChild`)가 shadcn 결의 핵심** — Button의 5 variants × 4 sizes를 cva 한 번에 정의하고, `asChild`로 Link/router 컴포넌트와 합성. 컴포넌트 코드가 50줄을 안 넘는다.
- **Storybook의 next-themes 통합은 토큰 검증의 결정적 도구** — preview에 `globals.css`를 직접 import하면 토큰이 그대로 살아 동작하고, toolbar로 라이트/다크 토글하면 색이 같은 컴포넌트에 동시 적용됨. "다크모드까지 자동으로 검증되는 디자인 시스템"이 이 패턴으로 무료로 굴러간다.
- **Chromatic baseline 등록은 첫 publish 1회로 끝** — `auto-accepted`로 23 snapshot이 그대로 기준이 됨. 이후 CI는 diff만 보면 되고, 사람이 OK한 변경만 baseline에 흡수. 무료 플랜(5000 snapshot/month)로 사이드 프로젝트 규모는 충분.
- **wireframe → 스토리 직결의 효과** — Card 스토리 중 `ReviewRow`는 `docs/wireframes.md` §2 Review List 행을 그대로 옮긴 것. 디자인 시스템이 "추상 컴포넌트 카탈로그"가 아니라 "실제 화면 조각"으로 시연되니 다음 주 화면 구현 시 그대로 가져다 쓸 수 있다.
- **2주 차에 Vercel + Chromatic 두 라이브 URL 확보** — README 배지 두 개가 곧 포트폴리오. Week 1의 "라이브 URL이 있다"보다 "라이브 + 디자인 시스템 라이브"가 훨씬 강한 신호.

## 다음 주 우선순위 (Week 3)

1. **3.1 컴포넌트 확장** — Tabs/Tooltip/Toast/Select/Skeleton/Avatar. Radix는 이미 깔려 있어 cva 패턴 그대로 재사용 가능.
2. **3.3 앱 레이아웃** — Header(로고+nav+사용자) / Sidebar / Main. wireframe의 모든 화면이 공유하는 구조라 일찍 짜야 4주 차 MVP 진입이 쉬워짐.
3. **3.4 랜딩 페이지** — Hero + Features + CTA + Footer. wireframe §1 그대로 구현. 라우팅 시각화는 정적 다이어그램으로 시작 (live mini-demo는 Week 4 이후).
4. **3.5 로딩/에러 boundaries** — Next.js App Router의 `loading.tsx`/`error.tsx`. 정확히 어디에 둘지 3.3 레이아웃 직후에 결정.
5. **3.6 신규 컴포넌트 스토리** — 2.7과 동일 패턴. 6개 × 3+ variant.

**리스크**: Week 3는 컴포넌트 6개 + 레이아웃 + 랜딩 + 스토리 6개로 양이 가장 많은 주. 시간 부족 시 **3.4 랜딩 페이지를 Hero+CTA만 우선 구현**하고 Features/Footer를 Week 4와 병행하는 식으로 분할.

## 의사결정

- **액센트는 indigo (`#6366f1` 베이스)** — design-refs.md 종합에서 후보였던 "파랑 vs 보라" 중 indigo는 둘의 중간이라 어디서나 안전. Linear/v0/Cursor 어떤 톤과도 충돌하지 않음.
- **다크/라이트는 `next-themes` 채택, 직접 짜지 않음** — SSR 깜빡임 처리 + system 감지 + localStorage 동기화를 직접 구현할 가치가 없음. 라이브러리 7KB 추가가 합리적 비용.
- **시맨틱 토큰 두 계층 (`raw` → `inline`)** — `--color-neutral-50` 같은 raw를 `--color-bg-default`로 한 번 더 매핑. 다크 전환이 시맨틱 토큰의 alias만 바꾸는 한 줄 작업이 됨. Tailwind v4 `@theme inline`이 정확히 이 용도.
- **Storybook framework는 `nextjs-vite`(Vite) 선택** — `@storybook/nextjs`(webpack)도 가능하지만 dev/build 속도 차이가 크고(manager 281ms, preview 877ms), Next 16 + Tailwind v4 조합에서 Vite plugin이 안정적. Webpack 의존성을 RSC와 분리할 수 있는 부가 이득.
- **Storybook addon은 최소만 — `addon-docs` + `chromatic-com/storybook`만 유지** — init이 권장한 vitest/playwright/mcp/a11y는 ROADMAP의 다른 주에서 필요해질 때 도입. 지금 깔아두는 비용(번들 사이즈, mental model)이 더 크다.
- **Dialog 진입 모션을 CSS 토큰화 (`--animate-content-in` 등)** — Raycast식 `scale(0.96 → 1) + opacity` 200ms를 `@theme`의 `--animate-*` + `@keyframes`로 정의. Tailwind v4가 `animate-*` 유틸리티로 자동 노출. 향후 Popover/Sheet 등에 그대로 재사용 가능.
- **`storybook-static/`을 ESLint ignore에 추가** — `.gitignore`에 있어도 ESLint 9 flat config는 자동 적용하지 않으므로 따로 등록 필수. 이번 lint 폭주는 한 번의 학습 비용으로 모든 빌드 산출물 디렉토리에 같은 규칙 적용 결정.
- **Chromatic 첫 publish는 로컬 + token 직접 전달** — CI(GitHub Secret) 설정 전에 baseline을 빠르게 만들기 위함. CI는 토큰 등록 후 자동 동작하도록 워크플로우 미리 작성.
- **회고는 한 주 단위 + 한 PR에 묶기** — Week 1과 동일. 다음 주 시작 전에 ROADMAP의 다음 미체크 항목과 함께 한 번에 보이는 게 의사결정 흐름을 유지하기 쉬움.
