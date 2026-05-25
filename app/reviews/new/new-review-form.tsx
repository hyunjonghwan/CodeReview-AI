'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/code/code-editor';
import { ArrowRight } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  const lines = code === '' ? 0 : code.split('\n').length;
  const canSubmit = code.trim().length > 0;
  const ext = LANGUAGES.find((l) => l.value === language)?.ext ?? 'txt';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    toast.info('Review pipeline lands in Week 4.7.', {
      description: `${filename || `untitled.${ext}`} · ${language} · ${lines} LOC`,
    });
  }

  return (
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
          <CodeEditor value={code} onChange={setCode} language={language} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={!canSubmit}>
          Review code
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
