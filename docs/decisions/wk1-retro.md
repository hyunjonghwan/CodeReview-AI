# Week 1 회고

> 1.9에서 마무리. 트러블슈팅은 발생 시점에 누적.

## 한 일

- (1.9 작성 시 ROADMAP에서 체크된 항목 옮겨 적기)

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

- (1.9 작성 시 채우기)

## 다음 주 우선순위

- (1.9 작성 시 채우기)

## 의사결정

- **왜 pnpm을 골랐나?** → (작성 시 채우기)
- **왜 Turbopack?** → (작성 시 채우기)
- **Next.js 버전**: ROADMAP은 Next 15 가정. 실제 설치 시점(2026-05)에 Next 16.2.6이 최신 안정판이라 그대로 채택. App Router/RSC 등 핵심 가정은 동일.
