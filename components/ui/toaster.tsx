'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <SonnerToaster
      theme={resolvedTheme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-bg-subtle group-[.toaster]:text-fg-default group-[.toaster]:border-border-default group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-fg-muted',
          actionButton: 'group-[.toast]:bg-accent group-[.toast]:text-accent-fg',
          cancelButton: 'group-[.toast]:bg-bg-muted group-[.toast]:text-fg-muted',
        },
      }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
