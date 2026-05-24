# Week 1 회고

> 1.9에서 마무리. 트러블슈팅은 발생 시점에 누적.

## 한 일

- **1.1** PROJECT.md 검수 — Next.js 15 → 16, Tailwind v3 → v4(@theme 기반) 표기 정정
- **1.2** 디자인 레퍼런스 5개 분석 (`docs/design-refs.md`) — Linear/Vercel/Cursor/v0/Raycast. 각 서비스에서 "가져올 요소" 3개씩 + 종합 디자인 토큰 결정
- **1.3** 핵심 화면 와이어프레임 3종 (`docs/wireframes.md`) — Landing / Review List / Review Detail. Figma 대신 ASCII로 정보 위계와 컴포넌트 매핑까지 정의
- **1.4** `pnpm create next-app` (Next.js 16.2.6, TS, Tailwind v4, App Router, ESLint)
- **1.5** ESLint + Prettier + Husky + lint-staged 셋업, pre-commit에서 자동 lint/format
- **1.6** `tsconfig.json` strict + `noUncheckedIndexedAccess` / `noImplicitOverride` / `noFallthroughCasesInSwitch`
- **1.7** GitHub repo 생성 + README 초안 + 첫 push (`hyunjonghwan/CodeReview-AI`)
- **1.8** Vercel 첫 배포 — 프로젝트: https://vercel.com/hyunjonghwans-projects/code-review-ai (라이브 URL은 Vercel 대시보드의 Domains 섹션 참조)

## 트러블슈팅 노트

### 1. bash 셸에서 pnpm 미인식

- **증상**: 클로드 코드의 bash 도구에서 `pnpm -v` 실행 시 `command not found`. PowerShell에서는 정상 동작 (`pnpm 11.0.9`).
- **원인**: 이 환경은 두 개의 다른 셸이 공존.
  - PowerShell: 사용자 시스템 PATH → nvm-windows 경로(`C:\Users\hyun\AppData\Local\nvm\v22.22.2\`)에 설치된 pnpm 사용.
  - IntelliJ 내장 bash: 자체 PATH(IntelliJ 런타임 Node v24 기반) → nvm 경로 미포함.
- **해결**: 패키지 매니저(pnpm/npm) 명령은 PowerShell에서 직접 실행. 클로드 코드 bash 도구로 호출하면 PATH 불일치 + Node 버전 엇갈림 위험.
- **교훈**: Windows + nvm + IntelliJ 조합에서 셸 환경마다 PATH가 분리될 수 있다. 다른 프로젝트에서도 재발 가능.

---

### 2. `pnpm create next-app .` — `CLAUDE.md` 충돌

- **증상**: `The directory codereview-ai contains files that could conflict: CLAUDE.md` 메시지로 설치 거부.
- **원인**: create-next-app은 일부 알려진 파일/디렉토리(`.gitignore`, `docs`, `LICENSE` 등)만 통과시키고, 임의의 마크다운 파일은 충돌로 판단.
- **해결**: 설치 전 `CLAUDE.md`를 부모 디렉토리(`CodeReview-AI/`)로 임시 이동(`CLAUDE.md.bak`) → 설치 완료 후 원위치 복원. `docs/`는 통과해서 그대로 둠.
- **교훈**: 기존 디렉토리 안에 `create-next-app .`을 돌리려면 비표준 파일을 미리 비키게 하기.

---

### 3. `ERR_PNPM_IGNORED_BUILDS` — `sharp`, `unrs-resolver`

- **증상**: `pnpm dev`가 시작도 못 하고 exit 1. 로그: `Ignored build scripts: sharp@0.34.5, unrs-resolver@1.11.1`.
- **원인**: pnpm 11+의 보안 정책 — 외부 패키지의 postinstall 같은 lifecycle 스크립트는 명시 승인된 패키지에서만 실행. pnpm 11은 `dev` 등 스크립트 실행 전 자동 install 검증(`runDepsStatusCheck`)을 돌리는데, 이 단계가 ignored builds를 **fatal error**로 격상시켜 dev 시작 자체를 차단.
- **해결**: `pnpm-workspace.yaml`에서 두 패키지의 빌드를 허용. (#4 참조)

---

### 4. `pnpm-workspace.yaml`의 자동 생성 차단 목록 우선순위

- **증상**: `package.json`에 다음을 추가했지만 여전히 빌드 차단됨:
  ```json
  "pnpm": { "onlyBuiltDependencies": ["sharp", "unrs-resolver"] }
  ```
- **원인**: pnpm 11이 자동 생성한 `pnpm-workspace.yaml`에 두 패키지가 `ignoredBuiltDependencies`(차단 목록)로 등록돼 있고, `allowBuilds` 섹션은 placeholder(`"set this to true or false"`) 상태로 비활성. **workspace 파일이 우선**되어 package.json 설정이 무시됨.
- **해결**:
  1. `pnpm-workspace.yaml` 내용 교체:
     ```yaml
     allowBuilds:
       sharp: true
       unrs-resolver: true
     ```
  2. `package.json`의 `pnpm.onlyBuiltDependencies` 제거 (중복 방지, workspace에서 일원화).
  3. lockfile up-to-date 상태에서는 일반 `pnpm install`이 lifecycle 스크립트를 다시 안 돌리므로 `pnpm rebuild`로 강제 실행.
- **교훈**: pnpm 11+에서 빌드 스크립트 정책은 `pnpm-workspace.yaml`에서 관리. 기본 생성 파일은 **차단 모드**로 시작하므로 필요한 패키지를 직접 활성화해야 함.

---

## 배운 것

- **pnpm 11+의 보안 정책이 빡세짐** — postinstall 같은 lifecycle 스크립트는 명시 승인된 패키지만 실행. `pnpm-workspace.yaml`이 `package.json`보다 우선. 다음 프로젝트에서도 `sharp`/`unrs-resolver` 같은 native 의존성을 만나면 같은 패턴으로 막힐 것.
- **Windows + nvm + IntelliJ는 셸마다 PATH가 다르다** — Claude Code bash 도구로 pnpm 실행하면 Node 버전이 엇갈릴 수 있음. 패키지 매니저 명령은 PowerShell, git/파일 조작은 bash로 역할 분리.
- **PowerShell ExecutionPolicy 기본값(Restricted)은 pnpm.ps1을 막는다** — `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`로 해결. 보안 트레이드오프 인식.
- **Tailwind v4는 설정 파일이 거의 사라졌다** — `tailwind.config.ts` 대신 `app/globals.css`의 `@theme` 블록. ROADMAP 2.1을 이에 맞춰 수정해둠.
- **Figma 없어도 ASCII 와이어프레임이 충분히 강력하다** — 정보 위계와 컴포넌트 매핑을 같이 적으면 오히려 Figma보다 구현 가이드로서 명확. Week 2~5에 이 문서가 일급 참조점이 될 것.
- **첫 커밋은 큰 단위로 가도 OK** — Week 1 산출물을 한 번에 묶는 게 자연스러움. lint-staged가 prettier로 마크다운 테이블을 정렬해줘서 자동 보정 효과까지 봄.

## 다음 주 우선순위 (Week 2)

1. **2.1 디자인 토큰 (`@theme`)** — design-refs.md에서 결정한 neutral grey 12단계 + 단일 액센트 컬러 픽 + semantic 4종. 액센트는 **파랑 vs 보라** 둘 중 결정 필요.
2. **2.4–2.5 Radix 설치 + 핵심 5개 컴포넌트** — Button(5 variants), Input, Card, Badge, Dialog. Layer 1-2 우선.
3. **2.6–2.8 Storybook + Chromatic** — 살아있는 디자인 시스템 배포가 Week 2의 가시적 산출물. 이걸 Week 2 끝에 무조건 살려둘 것 (ROADMAP 진행 규칙 4).
4. (선택) 2.2 다크/라이트 CSS 변수, 2.3 폰트 로드 — 토큰 정의와 같이 가는 게 효율적.

**리스크**: Storybook 8 → 9 마이그레이션 이슈, Chromatic 무료 플랜 빌드 시간 한도. 시간 모자라면 Chromatic은 Week 3로 미루기.

## 의사결정

- **왜 pnpm?** → 디스크 효율(content-addressable store), 모노레포 호환성, npm/yarn 대비 install 속도. 사이드 프로젝트라도 lockfile 정합성이 강한 게 향후 협업 시 유리.
- **왜 Turbopack?** → Next.js 16에서 production build 기본값 진입. dev/build 양쪽에서 Webpack 대비 명백히 빠르고, Vercel과 결이 맞음. 안정성 리스크는 Next 16에서 stable로 격상돼 충분히 낮음.
- **Next.js 버전**: ROADMAP은 Next 15 가정. 실제 설치 시점(2026-05)에 Next 16.2.6이 최신 안정판이라 그대로 채택. App Router/RSC 등 핵심 가정은 동일.
- **Tailwind v4 채택**: 문서 작성 시점에 가장 많이 쓰이는 v3 대신 v4 채택. 이유는 (1) Next 16 + React 19 조합과의 결을 맞춤, (2) CSS-first 설정이 디자인 토큰을 다루기 더 직관적, (3) 학습 의도가 강한 사이드 프로젝트라 최신 API에 익숙해지는 가치가 큼. 트레이드오프: 일부 v3 기준 튜토리얼/스니펫이 안 맞을 수 있음.
- **Figma 대신 ASCII 와이어프레임**: 디자인 도구 학습 비용을 회피하고 정보 위계 정의에 집중. 와이어프레임 문서에 컴포넌트 매핑까지 같이 적어 Week 2~5 구현 시 단일 참조점이 되도록 함.
- **GitHub repo 단일 큰 첫 커밋**: 29 files, 5871 insertions의 root-commit. 사이드 프로젝트라 PR/리뷰 흐름이 없고, Week 1 산출물 전체가 한 단위로 의미가 있어 분리 비용이 더 큼.
