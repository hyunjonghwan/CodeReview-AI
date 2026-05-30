'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { CodeEditor } from '@/components/code/code-editor';
import { ArrowRight } from '@/components/icons';
import {
  ReviewResult,
  type ReviewStatus,
  type RoutingDecision,
} from '@/components/review/review-result';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseReview } from '@/lib/ai/parse-review';
import type { ReviewResponse } from '@/lib/ai/prompts/output-schema';

const LANGUAGES = [
  { value: 'typescript', label: 'TypeScript', ext: 'ts' },
  { value: 'javascript', label: 'JavaScript', ext: 'js' },
  { value: 'tsx', label: 'TSX', ext: 'tsx' },
  { value: 'python', label: 'Python', ext: 'py' },
  { value: 'go', label: 'Go', ext: 'go' },
  { value: 'rust', label: 'Rust', ext: 'rs' },
  { value: 'java', label: 'Java', ext: 'java' },
  { value: 'cpp', label: 'C++', ext: 'cpp' },
  { value: 'csharp', label: 'C#', ext: 'cs' },
  { value: 'ruby', label: 'Ruby', ext: 'rb' },
  { value: 'php', label: 'PHP', ext: 'php' },
  { value: 'html', label: 'HTML', ext: 'html' },
  { value: 'css', label: 'CSS', ext: 'css' },
  { value: 'json', label: 'JSON', ext: 'json' },
  { value: 'markdown', label: 'Markdown', ext: 'md' },
  { value: 'shell', label: 'Shell', ext: 'sh' },
  { value: 'sql', label: 'SQL', ext: 'sql' },
] as const;

const DEFAULT_LANGUAGE = 'typescript';

export function NewReviewForm() {
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState('');

  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [result, setResult] = useState('');
  const [parsed, setParsed] = useState<ReviewResponse | null>(null);
  const [decision, setDecision] = useState<RoutingDecision | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const lines = code === '' ? 0 : code.split('\n').length;
  const isStreaming = status === 'streaming';
  const canSubmit = code.trim().length > 0 && !isStreaming;
  const ext = LANGUAGES.find((l) => l.value === language)?.ext ?? 'txt';

  // 이슈가 가리키는 라인들 (null 제외) — Monaco 데코레이션 입력.
  const highlightLines = useMemo(
    () => (parsed ? parsed.issues.map((i) => i.line).filter((l): l is number => l !== null) : []),
    [parsed],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus('streaming');
    setResult('');
    setParsed(null);
    setDecision(null);
    setErrorMsg('');
    setActiveLine(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `요청이 실패했습니다 (${res.status}).`);
      }

      // 라우팅 결정은 헤더로 도착한다 (reason은 인코딩되어 있음).
      setDecision({
        model: res.headers.get('X-Review-Model') ?? '',
        taskType: res.headers.get('X-Review-Task') ?? '',
        reason: decodeURIComponent(res.headers.get('X-Review-Reason') ?? ''),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error('응답 스트림을 읽을 수 없습니다.');

      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setResult(acc);
      }
      // 200 응답이라도 본문이 비면 스트림 중간에 모델 호출이 실패한 것.
      if (acc.trim().length === 0) {
        throw new Error('리뷰 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      // 펜스 스트립 + JSON.parse. 실패하면 null → 결과 패널이 원문 폴백을 보여준다.
      setParsed(parseReview(acc));
      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setStatus('error');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <header className="space-y-2">
          <Link
            href="/"
            className="text-fg-muted hover:text-fg-default inline-flex items-center text-sm transition-colors"
          >
            ← Back to home
          </Link>
          <h1 className="text-fg-default text-2xl font-semibold tracking-tight sm:text-3xl">
            New review
          </h1>
          <p className="text-fg-muted text-sm">
            Paste your code below. The router picks Haiku, Sonnet, or Opus based on size and
            complexity.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
          <div className="space-y-1.5">
            <label htmlFor="filename" className="text-fg-default text-sm font-medium">
              Filename <span className="text-fg-subtle font-normal">(optional)</span>
            </label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="auth/login.ts"
              className="font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="language" className="text-fg-default text-sm font-medium">
              Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-border-default bg-bg-subtle overflow-hidden rounded-lg border">
          <div className="border-border-default flex items-center justify-between border-b px-4 py-2 text-xs">
            <span className="text-fg-muted font-mono">{filename || `untitled.${ext}`}</span>
            <span className="text-fg-subtle font-mono">
              {lines} {lines === 1 ? 'line' : 'lines'}
            </span>
          </div>
          <div className="h-[480px]">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              highlightLines={highlightLines}
              activeLine={activeLine}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" disabled={!canSubmit}>
            {isStreaming ? 'Reviewing…' : 'Review code'}
            {!isStreaming && <ArrowRight className="size-4" />}
          </Button>
        </div>
      </form>

      {status !== 'idle' && (
        <ReviewResult
          status={status}
          result={result}
          parsed={parsed}
          errorMsg={errorMsg}
          decision={decision}
          activeLine={activeLine}
          onSelectIssue={setActiveLine}
        />
      )}
    </div>
  );
}
