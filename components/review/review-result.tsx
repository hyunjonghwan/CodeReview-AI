'use client';

import { useMemo, useState } from 'react';
import type { ReviewResponse } from '@/lib/ai/prompts/output-schema';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/utils/cn';
import { IssueCard } from './issue-card';
import { CATEGORY_GROUPS, categoryGroup, type CategoryGroup } from './issue-meta';
import { ModelIndicator } from './model-indicator';

export interface RoutingDecision {
  model: string;
  taskType: string;
  reason: string;
}

export type ReviewStatus = 'idle' | 'streaming' | 'done' | 'error';

interface ReviewResultProps {
  status: ReviewStatus;
  result: string;
  parsed: ReviewResponse | null;
  errorMsg: string;
  decision: RoutingDecision | null;
  activeLine: number | null;
  onSelectIssue: (line: number | null) => void;
}

type Filter = CategoryGroup | 'All';

export function ReviewResult({
  status,
  result,
  parsed,
  errorMsg,
  decision,
  activeLine,
  onSelectIssue,
}: ReviewResultProps) {
  const [filter, setFilter] = useState<Filter>('All');

  // 결과에 실제로 존재하는 그룹만 필터 칩으로 노출.
  const presentGroups = useMemo<CategoryGroup[]>(() => {
    if (!parsed) return [];
    const set = new Set(parsed.issues.map((i) => categoryGroup(i.category)));
    return CATEGORY_GROUPS.filter((g) => set.has(g));
  }, [parsed]);

  const visibleIssues = useMemo(() => {
    if (!parsed) return [];
    if (filter === 'All') return parsed.issues;
    return parsed.issues.filter((i) => categoryGroup(i.category) === filter);
  }, [parsed, filter]);

  return (
    <section className="border-border-default bg-bg-subtle space-y-4 rounded-lg border p-5">
      <h2 className="text-fg-default text-sm font-semibold">Review result</h2>

      {decision && (
        <div className="border-border-default bg-bg-default space-y-2 rounded-md border px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-fg-subtle">Detected</span>
            <span className="text-fg-muted font-mono">{decision.taskType}</span>
            <ArrowRight className="text-fg-subtle size-3" />
            <ModelIndicator model={decision.model} />
          </div>
          <p className="text-fg-muted text-xs leading-relaxed">
            <span className="text-fg-subtle font-medium">Why this model? </span>
            {decision.reason}
          </p>
        </div>
      )}

      {status === 'error' ? (
        <p className="text-error-default text-sm">{errorMsg}</p>
      ) : parsed ? (
        <div className="space-y-4">
          <p className="text-fg-default text-sm leading-relaxed">{parsed.summary}</p>

          {parsed.issues.length === 0 ? (
            <div className="border-border-default rounded-lg border border-dashed px-4 py-8 text-center">
              <p className="text-fg-default text-sm font-medium">발견된 이슈가 없습니다</p>
              <p className="text-fg-muted mt-1 text-xs">코드가 깔끔합니다 👍</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip
                  label={`All (${parsed.issues.length})`}
                  active={filter === 'All'}
                  onClick={() => setFilter('All')}
                />
                {presentGroups.map((group) => {
                  const count = parsed.issues.filter(
                    (i) => categoryGroup(i.category) === group,
                  ).length;
                  return (
                    <FilterChip
                      key={group}
                      label={`${group} (${count})`}
                      active={filter === group}
                      onClick={() => setFilter(group)}
                    />
                  );
                })}
              </div>

              <div className="space-y-2">
                {visibleIssues.map((issue, idx) => (
                  <IssueCard
                    key={idx}
                    issue={issue}
                    active={issue.line !== null && issue.line === activeLine}
                    onSelect={() => onSelectIssue(issue.line)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : status === 'streaming' ? (
        <pre className="text-fg-muted max-h-[480px] overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {result || '리뷰 생성 중…'}
        </pre>
      ) : (
        // status === 'done'인데 파싱 실패 — 원문 폴백.
        <div className="space-y-2">
          <p className="text-fg-muted text-xs">구조화 파싱에 실패해 원문을 표시합니다.</p>
          <pre className="text-fg-default max-h-[480px] overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        active
          ? 'bg-accent text-accent-fg border-transparent'
          : 'border-border-default text-fg-muted hover:text-fg-default hover:border-border-strong',
      )}
    >
      {label}
    </button>
  );
}
