'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 items-center justify-center px-6 py-20">
      <Card className="flex max-w-md flex-col items-center gap-3 p-10 text-center">
        <h2 className="text-fg-default text-xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-fg-muted text-sm">
          {error.message || 'An unexpected error occurred while rendering this page.'}
        </p>
        {error.digest && <p className="text-fg-subtle font-mono text-xs">digest: {error.digest}</p>}
        <Button onClick={reset} size="sm" className="mt-2">
          Try again
        </Button>
      </Card>
    </div>
  );
}
