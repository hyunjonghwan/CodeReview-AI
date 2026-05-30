'use client';

import type { OnMount } from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string | number;
  // 이슈가 있는 라인 (gutter 바 + 라인 배경 데코, 5.3).
  highlightLines?: number[];
  // 카드 클릭으로 선택된 라인 — 강조 + 가운데로 스크롤 (5.6).
  activeLine?: number | null;
};

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  height = '100%',
  highlightLines = [],
  activeLine = null,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const collectionRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;
  };

  // 이슈 라인 데코레이션 갱신. value도 의존성에 둬 코드가 바뀌면 다시 그린다.
  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;

    const decorations: editor.IModelDeltaDecoration[] = highlightLines.map((line) => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: line === activeLine ? 'cr-issue-line cr-issue-line--active' : 'cr-issue-line',
        linesDecorationsClassName: 'cr-issue-gutter',
      },
    }));

    if (collectionRef.current) {
      collectionRef.current.set(decorations);
    } else {
      collectionRef.current = ed.createDecorationsCollection(decorations);
    }
  }, [highlightLines, activeLine, value]);

  // 선택된 라인으로 스크롤.
  useEffect(() => {
    if (activeLine !== null) editorRef.current?.revealLineInCenter(activeLine);
  }, [activeLine]);

  return (
    <MonacoEditor
      value={value}
      language={language}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
      height={height}
      onChange={(next) => onChange(next ?? '')}
      onMount={handleMount}
      loading={<Skeleton className="h-full w-full rounded-none" />}
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        fontFamily: 'var(--font-mono)',
        fontLigatures: true,
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        padding: { top: 12, bottom: 12 },
        tabSize: 2,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
      }}
    />
  );
}
