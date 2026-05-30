import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// 모델 배지는 와이어프레임 전반(랜딩 다이어그램·리스트·디테일)에서 동일하게 노출되는
// 도메인 컴포넌트다. 라우팅 결과가 곧 제품 차별점이라 절대 숨기지 않는다.
const indicatorVariants = cva(
  [
    'inline-flex items-center rounded-full border px-2 py-0.5',
    'font-mono text-xs font-medium whitespace-nowrap select-none',
  ],
  {
    variants: {
      // 티어가 올라갈수록 액센트를 강하게 — 라우팅의 "더 비싼 모델" 위계를 시각화.
      tier: {
        simple: 'border-transparent bg-bg-muted text-fg-default',
        standard: 'border-accent/30 bg-accent/10 text-accent',
        deep: 'border-transparent bg-accent text-accent-fg',
        unknown: 'border-border-strong bg-transparent text-fg-muted',
      },
    },
    defaultVariants: { tier: 'unknown' },
  },
);

type Tier = 'simple' | 'standard' | 'deep' | 'unknown';

const FAMILY_META: Record<string, { label: string; tier: Tier }> = {
  haiku: { label: 'Haiku', tier: 'simple' },
  sonnet: { label: 'Sonnet', tier: 'standard' },
  opus: { label: 'Opus', tier: 'deep' },
};

// 모델 id에서 family를 파싱해 라벨/티어를 끌어온다. 버전이 바뀌어도(`claude-haiku-4-5`
// → `...-4-6`) 동작하며, router.ts의 MODEL_MAP 전체를 중복 정의하지 않는다.
function parseModel(model: string): { label: string; tier: Tier } {
  const family = model.match(/claude-(haiku|sonnet|opus)/)?.[1];
  return (family && FAMILY_META[family]) || { label: model, tier: 'unknown' };
}

export interface ModelIndicatorProps {
  model: string;
  className?: string;
}

export function ModelIndicator({ model, className }: ModelIndicatorProps) {
  const { label, tier } = parseModel(model);
  return (
    <span className={cn(indicatorVariants({ tier }), className)} title={model}>
      {label}
    </span>
  );
}
