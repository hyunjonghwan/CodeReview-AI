'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
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
};

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <MonacoEditor
      value={value}
      language={language}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
      height={height}
      onChange={(next) => onChange(next ?? '')}
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
