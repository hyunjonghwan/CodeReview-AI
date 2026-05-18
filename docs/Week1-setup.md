# Week 1 — 시작 가이드

> 이 문서를 클로드 코드에게 보여주면서 "Week 1부터 진행해줘" 하면 됩니다.

## 사전 준비 (사용자가 직접)

1. Node.js 20 LTS 이상 설치 확인: `node -v`
2. pnpm 설치: `npm i -g pnpm`
3. GitHub 계정 (이미 있을 것)
4. Vercel 계정 (없으면 GitHub으로 가입)
5. Anthropic API 키 발급: console.anthropic.com → API Keys

## Step 1.4: Next.js 프로젝트 생성

```bash
pnpm create next-app@latest codereview-ai \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir=false \
  --import-alias="@/*"

cd codereview-ai
```

선택지가 나오면:

- Turbopack? **Yes**
- App Router? **Yes (이미 위에서 지정됨)**

## Step 1.5: ESLint + Prettier + Husky

```bash
pnpm add -D prettier prettier-plugin-tailwindcss \
  eslint-config-prettier \
  husky lint-staged
```

`.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`package.json`에 추가:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

```bash
pnpm dlx husky init
echo "pnpm lint-staged" > .husky/pre-commit
```

## Step 1.6: tsconfig.json strict

`tsconfig.json` compilerOptions에 추가/확인:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "noFallthroughCasesInSwitch": true
}
```

## Step 1.7: GitHub 셋업

```bash
git init
git add .
git commit -m "chore(week1): initial Next.js 15 setup"

# GitHub에서 빈 repo 생성 후
git remote add origin git@github.com:현/codereview-ai.git
git branch -M main
git push -u origin main
```

GitHub repo에서:

- Issues 활성화
- Projects 보드 생성 (Kanban: Todo / In Progress / Done)
- ROADMAP의 항목들을 Issue로 생성 (또는 한 번에 큰 Issue 8개)

## Step 1.8: Vercel 연결

1. vercel.com → New Project → GitHub repo 선택
2. 환경변수는 일단 없음 (Week 4에 추가)
3. Deploy 클릭 → 첫 배포 URL 확인

## Step 1.1-1.3: 기획 문서

`docs/` 폴더 만들고:

- `PROJECT.md` 복사
- `ROADMAP.md` 복사
- `CLAUDE.md`는 **루트에 위치** (클로드 코드 자동 인식)
- `docs/design-refs.md` 작성 — Linear, Vercel, Cursor, v0, Raycast 스크린샷+메모

Figma는 시간 부족하면 와이어프레임 수준으로만 — 핵심은 화면 구조를 머릿속에 정리하는 것.

## Step 1.9: 회고

`docs/decisions/wk1-retro.md`:

```markdown
# Week 1 회고

## 한 일

- [체크된 항목들 옮겨 적기]

## 배운 것

- ...

## 다음 주 우선순위

- ...

## 의사결정

- 왜 pnpm을 골랐나? → ...
- 왜 Turbopack? → ...
```

## 완료 체크

Week 1이 끝났을 때:

- [ ] `pnpm dev` 실행하면 localhost:3000에 Next.js 기본 화면
- [ ] `git push` 시 Vercel에 자동 배포
- [ ] `git commit` 시 lint-staged 동작
- [ ] `docs/` 폴더에 PROJECT, ROADMAP, design-refs, wk1-retro 4개 파일

여기까지 되면 **Week 2: 디자인 시스템**으로 진입.

## 클로드 코드 사용 팁

```bash
# 프로젝트 루트에서
claude

# 첫 메시지 예시
> CLAUDE.md와 docs/ROADMAP.md를 읽고, Week 2의 첫 번째 미체크 항목부터 진행해줘.
> 토큰 정의(2.1)부터 시작하면 될 거야.
```

매 주 시작할 때:

```bash
> ROADMAP에서 Week N의 다음 미체크 항목을 진행해줘. 작업 시작 전에 무엇을 할지 한 줄로 알려줘.
```

막힐 때:

```bash
> 이번 작업에서 X 결정이 필요해. 옵션 2~3개랑 추천 알려줘.
```
