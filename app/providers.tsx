'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';
import { Toaster } from '@/components/ui/toaster';

type Props = ComponentProps<typeof NextThemesProvider>;

export function Providers({ children, ...props }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
      <Toaster position="top-right" />
    </NextThemesProvider>
  );
}
