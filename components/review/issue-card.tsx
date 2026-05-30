import type { ReviewIssue } from '@/lib/ai/prompts/output-schema';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { categoryGroup, severityGlyph, severityVariant } from './issue-meta';

export interface IssueCardProps {
  issue: ReviewIssue;
  active?: boolean;
  onSelect?: () => void;
}

export function IssueCard({ issue, active = false, onSelect }: IssueCardProps) {
  // 라인 정보가 있을 때만 카드↔코드 연동(5.6)을 위한 인터랙션을 켠다.
  const interactive = Boolean(onSelect) && issue.line !== null;

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect?.() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      className={cn(
        'border-border-default bg-bg-default space-y-2 rounded-lg border p-3 text-sm',
        interactive && 'hover:border-border-strong cursor-pointer transition-colors',
        active && 'border-accent ring-accent ring-1',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={severityVariant(issue.severity)}>
          <span aria-hidden>{severityGlyph(issue.severity)}</span>
          {issue.severity}
        </Badge>
        <Badge variant="secondary">{categoryGroup(issue.category)}</Badge>
        {issue.line !== null && (
          <span className="text-fg-subtle font-mono text-xs">Line {issue.line}</span>
        )}
      </div>

      <p className="text-fg-default leading-relaxed">{issue.message}</p>

      {issue.suggestion && (
        <div className="border-border-subtle bg-bg-muted rounded-md border p-2">
          <p className="text-fg-subtle mb-1 text-xs font-medium">Suggested fix</p>
          <pre className="text-fg-default font-mono text-xs whitespace-pre-wrap">
            {issue.suggestion}
          </pre>
        </div>
      )}
    </div>
  );
}
